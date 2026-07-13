import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

export function useMultiplayer(initialState) {
  const [roomId, setRoomId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  
  const [gameState, setGameState] = useState(initialState);

  const peerInstance = useRef(null);
  // Se Host: armazena todas as conexões ativas de Guests
  const connections = useRef([]); 
  // Se Guest: armazena a conexão com o Host
  const hostConnection = useRef(null);

  // Inicializa o PeerJS apenas quando solicitado para economizar bateria/recursos
  const initPeer = () => {
    if (peerInstance.current) return peerInstance.current;
    
    // Conecta ao servidor público do PeerJS para gerar um ID
    const peer = new Peer({ debug: 2 });
    peerInstance.current = peer;

    peer.on('open', () => {
      // peer ID assigned by PeerJS server
    });

    peer.on('error', (err) => {
      console.error('PeerJS Error:', err);
      setError(err.message || 'Erro ao conectar');
      setIsConnected(false);
    });

    return peer;
  };

  // ----- FUNÇÕES DO HOST -----
  const createRoom = () => {
    setIsHost(true);
    setRoomId('');
    setError(null);
    const peer = initPeer();

    peer.on('open', (id) => {
      setRoomId(id); // O ID do host é o ID da sala
      setIsConnected(true);
    });

    // Quando um Guest se conecta
    peer.on('connection', (conn) => {
      connections.current.push(conn);
      
      conn.on('open', () => {
        // Envia o estado atual para o novo guest
        conn.send({ type: 'SYNC_STATE', state: gameState });
      });

      conn.on('data', (data) => {
        if (data.type === 'ACTION') {
          // Recebeu uma ação do Guest, atualiza o estado local e dá broadcast
          handleActionAsHost(data.state);
        }
      });

      conn.on('close', () => {
        connections.current = connections.current.filter(c => c.peer !== conn.peer);
      });
    });
  };

  const handleActionAsHost = (newStateFromGuest) => {
    // Processa a ação (Incremento, Decremento, etc)
    setGameState(newStateFromGuest);
    broadcastState(newStateFromGuest);
  };

  const broadcastState = (stateToBroadcast) => {
    connections.current.forEach(conn => {
      if (conn.open) {
        conn.send({ type: 'SYNC_STATE', state: stateToBroadcast });
      }
    });
  };

  // ----- FUNÇÕES DO GUEST -----
  const joinRoom = (hostId) => {
    setIsHost(false);
    setError(null);
    const peer = initPeer();

    peer.on('open', () => {
      const conn = peer.connect(hostId);
      hostConnection.current = conn;

      conn.on('open', () => {
        setRoomId(hostId);
        setIsConnected(true);
      });

      conn.on('data', (data) => {
        if (data.type === 'SYNC_STATE') {
          // Sobrescreve o estado local com a verdade absoluta do Host
          setGameState(data.state);
        }
      });

      conn.on('close', () => {
        setIsConnected(false);
        setRoomId('');
        setError('O Host encerrou a sala.');
      });
      
      conn.on('error', () => {
        setError('Falha ao conectar na sala.');
      });
    });
  };

  // ----- FUNÇÃO ÚNICA PARA ATUALIZAR O JOGO -----
  // Essa função é chamada pela UI. Ela sabe se você é Host, Guest ou Offline.
  const dispatchAction = (actionReducer) => {
    if (!isConnected) {
      // OFFLINE: Apenas atualiza o estado local
      setGameState(prev => actionReducer(prev));
      return;
    }

    if (isHost) {
      // HOST: Executa a lógica de Host
      const nextState = actionReducer(gameState);
      handleActionAsHost(nextState);
    } else {
      // GUEST: Calcula o novo estado e envia para o Host aprovar e dar broadcast
      setGameState(prev => {
        const nextState = actionReducer(prev);
        if (hostConnection.current?.open) {
          hostConnection.current.send({ 
            type: 'ACTION', 
            state: nextState
          });
        }
        return nextState;
      });
    }
  };

  const disconnect = () => {
    if (hostConnection.current) {
      hostConnection.current.close();
      hostConnection.current = null;
    }
    connections.current.forEach(c => c.close());
    connections.current = [];
    if (peerInstance.current) {
      peerInstance.current.destroy();
      peerInstance.current = null;
    }
    setIsConnected(false);
    setIsHost(false);
    setRoomId('');
    setError(null);
  };

  // Limpeza
  useEffect(() => {
    return () => {
      if (hostConnection.current) {
        hostConnection.current.close();
        hostConnection.current = null;
      }
      if (connections.current) {
        connections.current.forEach(c => c.close());
        connections.current = [];
      }
      if (peerInstance.current) {
        peerInstance.current.destroy();
        peerInstance.current = null;
      }
    };
  }, []);

  return {
    gameState,
    dispatchAction,
    isConnected,
    isHost,
    roomId,
    createRoom,
    joinRoom,
    disconnect,
    error,
    // Permite que o Tracker ainda acesse o setter direto caso necessário para carregar saves offline
    setGameStateDirect: setGameState 
  };
}

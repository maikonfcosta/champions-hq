import React, { useEffect, useState } from 'react';
import { getPacks, getCards } from '../services/api';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCloudSync } from '../hooks/useCloudSync';

export default function Collection() {
  const [packs, setPacks] = useState([]);
  const [cards, setCards] = useState([]);
  const [ownedPacks, setOwnedPacks] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { syncDataToCloud, getCloudData } = useCloudSync();

  useEffect(() => {
    const loadData = async () => {
      let saved = null;
      if (user) {
        saved = await getCloudData('mc_owned_packs');
      }
      if (!saved) {
        const local = localStorage.getItem('mc_owned_packs');
        if (local) {
          try {
            saved = JSON.parse(local);
          } catch {
            console.error("Error parsing saved packs");
          }
        }
      }
      if (saved) {
        setOwnedPacks(saved);
      }

      Promise.all([getPacks(), getCards()])
        .then(([packsData, cardsData]) => {
          setPacks(packsData.filter(p => p.code !== 'ron'));
          setCards(cardsData);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- getCloudData is unstable (recreated each render), adding it would cause infinite loops
  }, [user]);

  const togglePack = (packCode) => {
    const updated = { ...ownedPacks, [packCode]: !ownedPacks[packCode] };
    setOwnedPacks(updated);
    localStorage.setItem('mc_owned_packs', JSON.stringify(updated));
    if (user) syncDataToCloud('mc_owned_packs', updated);
  };

  const selectAll = () => {
    const all = {};
    packs.forEach(p => { all[p.code] = true; });
    setOwnedPacks(all);
    localStorage.setItem('mc_owned_packs', JSON.stringify(all));
    if (user) syncDataToCloud('mc_owned_packs', all);
  };

  const deselectAll = () => {
    setOwnedPacks({});
    localStorage.removeItem('mc_owned_packs');
    if (user) syncDataToCloud('mc_owned_packs', {});
  };

  const packImages = {
    'core': 'https://hallofheroeslcg.com/wp-content/uploads/2020/09/marvel-1.jpg',
    'gob': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/c1.webp',
    'cap': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/c2.webp',
    'msm': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/c3.webp',
    'twc': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/c4.webp',
    'thor': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/c5.webp',
    'bkw': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/c6.webp',
    'drs': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/c7.webp',
    'hlk': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/c8.webp',
    'trors': 'https://hallofheroeslcg.com/wp-content/uploads/2020/09/expansion12.jpeg',
    'toafk': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/z1-1.webp',
    'ant': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/z2-1.webp',
    'wsp': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/z3-1.webp',
    'qsv': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/z4.webp',
    'scw': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/z5.webp',
    'gmw': 'https://hallofheroeslcg.com/wp-content/uploads/2020/08/guardiansbox.jpg',
    'stld': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/1-1.webp',
    'gam': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/2-1.webp',
    'drax': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/3-1.webp',
    'vnm': 'https://hallofheroeslcg.com/wp-content/uploads/2021/06/0-1.png',
    'mts': 'https://hallofheroeslcg.com/wp-content/uploads/2021/05/thanos.png',
    'nebu': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/1-2.webp',
    'warm': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/2-2.webp',
    'hood': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/3-2.webp',
    'valk': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/4-1.webp',
    'vision': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/5.webp',
    'sm': 'https://hallofheroeslcg.com/wp-content/uploads/2021/09/sm.png',
    'nova': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/z1.webp',
    'ironheart': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/z2.webp',
    'spiderham': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/z3.webp',
    'spdr': 'https://hallofheroeslcg.com/wp-content/uploads/2022/04/ad-2.png',
    'mut_gen': 'https://hallofheroeslcg.com/wp-content/uploads/2022/05/mc1-2.png',
    'cyclops': 'https://hallofheroeslcg.com/wp-content/uploads/2022/06/c0.png',
    'phoenix': 'https://hallofheroeslcg.com/wp-content/uploads/2022/07/de1.png',
    'mojo': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/mj.png',
    'wolv': 'https://hallofheroeslcg.com/wp-content/uploads/2022/08/w1.png',
    'storm': 'https://hallofheroeslcg.com/wp-content/uploads/2022/09/storm.png',
    'gambit': 'https://hallofheroeslcg.com/wp-content/uploads/2022/10/g1.png',
    'rogue': 'https://hallofheroeslcg.com/wp-content/uploads/2022/11/123.png',
    'next_evol': 'https://hallofheroeslcg.com/wp-content/uploads/2023/04/1.png',
    'psylocke': 'https://hallofheroeslcg.com/wp-content/uploads/2023/04/z1-1.png',
    'angel': 'https://hallofheroeslcg.com/wp-content/uploads/2023/05/zz1.png',
    'x23': 'https://hallofheroeslcg.com/wp-content/uploads/2023/06/z1.png',
    'deadpool': 'https://hallofheroeslcg.com/wp-content/uploads/2023/08/zz1.png',
    'aoa': 'https://hallofheroeslcg.com/wp-content/uploads/2023/11/mc45_article_box-1.png',
    'iceman': 'https://hallofheroeslcg.com/wp-content/uploads/2024/01/z1.png',
    'jubilee': 'https://hallofheroeslcg.com/wp-content/uploads/2024/03/mc47_announce_box.png',
    'ncrawler': 'https://hallofheroeslcg.com/wp-content/uploads/2024/05/unnamed-file.png',
    'magneto': 'https://hallofheroeslcg.com/wp-content/uploads/2024/07/mc49_announce_box.png',
    'aos': 'https://hallofheroeslcg.com/wp-content/uploads/2024/09/agents-of-shield.png',
    'bp': 'https://hallofheroeslcg.com/wp-content/uploads/2025/01/mc51-image0500.png',
    'silk': 'https://hallofheroeslcg.com/wp-content/uploads/2025/03/silk-box.jpg',
    'falcon': 'https://hallofheroeslcg.com/wp-content/uploads/2025/03/mc53-image0_2000_2000x.webp',
    'winter': 'https://hallofheroeslcg.com/wp-content/uploads/2025/04/mc54-image0_2000_2000x.webp',
    'tt': 'https://hallofheroeslcg.com/wp-content/uploads/2025/05/mc55-image0500.png',
    'cw': 'https://hallofheroeslcg.com/wp-content/uploads/2025/06/mc56-image0500.png',
    'synthezoid': 'https://hallofheroeslcg.com/wp-content/uploads/2025/08/mc57-image0500.png',
    'wonder_man': 'https://hallofheroeslcg.com/wp-content/uploads/2025/10/mc58-image0500.png',
    'hercules': 'https://hallofheroeslcg.com/wp-content/uploads/2025/11/mc59-image0500.png'
  };

  const getPackImage = (packCode) => {
    // 1. Try to use official box art from Hall of Heroes
    if (packImages[packCode]) {
      return packImages[packCode];
    }

    // 2. Fallback to representative card from MarvelCDB
    let repCard = cards.find(c => c.pack_code === packCode && c.type_code === 'hero');
    if (!repCard) {
      repCard = cards.find(c => c.pack_code === packCode && (c.type_code === 'villain' || c.type_code === 'main_scheme'));
    }
    if (!repCard) {
      repCard = cards.find(c => c.pack_code === packCode);
    }

    if (repCard) {
      return repCard.imagesrc ? `https://marvelcdb.com${repCard.imagesrc}` : `https://marvelcdb.com/bundles/cards/${repCard.code}.png`;
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Loader2 className="text-primary" size={48} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Minha Coleção</h2>
          <p className="page-subtitle">Selecione as expansões e packs que você possui.</p>
        </div>
        <div className="action-buttons">
          <button onClick={selectAll} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Selecionar Tudo</button>
          <button onClick={deselectAll} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Limpar</button>
        </div>
      </div>

      <div className="collection-grid">
        {packs.map((pack) => {
          const isOwned = !!ownedPacks[pack.code];
          const packImage = getPackImage(pack.code);
          return (
            <div 
              key={pack.code} 
              className={`pack-card glass-panel ${isOwned ? 'owned' : ''}`}
              onClick={() => togglePack(pack.code)}
            >
              <div className="pack-image-wrapper">
                {packImage ? (
                  <img 
                    src={packImage} 
                    alt={pack.name} 
                    className="pack-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="pack-placeholder">{pack.name.charAt(0)}</div>
                )}
              </div>

              <div className="pack-text-wrapper">
                <h3 className="pack-title">
                  {pack.name}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

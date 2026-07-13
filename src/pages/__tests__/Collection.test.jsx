import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Collection from '../Collection';
import React from 'react';

// Mock contexts and hooks
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: vi.fn() }
  })
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: null })
}));

vi.mock('../../hooks/useCloudSync', () => ({
  useCloudSync: () => ({ syncDataToCloud: vi.fn(), getCloudData: vi.fn().mockResolvedValue(null) })
}));

vi.mock('../../services/api', () => ({
  getPacks: vi.fn().mockResolvedValue([
    { code: 'core', name: 'Core Set' },
    { code: 'cap', name: 'Captain America' }
  ]),
  getCards: vi.fn().mockResolvedValue([])
}));

describe('Collection Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(<Collection />);
    // Loading is indicated by the Loader2 component but we can just check if main container isn't there yet
    expect(screen.queryByText('collection.title')).not.toBeInTheDocument();
  });

  it('should render packs after loading data', async () => {
    render(<Collection />);
    
    await waitFor(() => {
      expect(screen.getByText('collection.title')).toBeInTheDocument();
    });

    expect(screen.getByText('Core Set')).toBeInTheDocument();
    expect(screen.getByText('Captain America')).toBeInTheDocument();
  });
});

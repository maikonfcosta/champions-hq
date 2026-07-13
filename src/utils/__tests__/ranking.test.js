import { describe, it, expect } from 'vitest';
import { calculateMatchXP, getRankInfo } from '../ranking';

describe('calculateMatchXP', () => {
  it('should return 200 for Vitória + Heroic', () => {
    expect(calculateMatchXP('Vitória', 'Heroic')).toBe(200);
  });
  it('should return 150 for Vitória + Expert', () => {
    expect(calculateMatchXP('Vitória', 'Expert')).toBe(150);
  });
  it('should return 100 for Vitória + Standard', () => {
    expect(calculateMatchXP('Vitória', 'Standard')).toBe(100);
  });
  it('should return 0 for Derrota + Heroic', () => {
    expect(calculateMatchXP('Derrota', 'Heroic')).toBe(0);
  });
  it('should return -15 for Derrota + Expert', () => {
    expect(calculateMatchXP('Derrota', 'Expert')).toBe(-15);
  });
  it('should return -25 for Derrota + Standard', () => {
    expect(calculateMatchXP('Derrota', 'Standard')).toBe(-25);
  });
});

describe('getRankInfo', () => {
  it('should return Recruta for XP < 500', () => {
    expect(getRankInfo(0).title).toBe('Recruta da S.H.I.E.L.D.');
    expect(getRankInfo(499).title).toBe('Recruta da S.H.I.E.L.D.');
  });
  it('should return Defensor for 500 <= XP < 1500', () => {
    expect(getRankInfo(500).title).toBe('Defensor de Nova York');
    expect(getRankInfo(1499).title).toBe('Defensor de Nova York');
  });
  it('should return Vingador for 1500 <= XP < 3000', () => {
    expect(getRankInfo(1500).title).toBe('Vingador');
    expect(getRankInfo(2999).title).toBe('Vingador');
  });
  it('should return Lenda Marvel for XP >= 3000', () => {
    expect(getRankInfo(3000).title).toBe('Lenda Marvel');
    expect(getRankInfo(99999).title).toBe('Lenda Marvel');
  });
});

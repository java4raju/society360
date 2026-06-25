import { Vendor } from '../shared/models/models';

const data: Array<[string, string, number, number]> = [
  ['SecureGuard Services', 'Security', 1440000, 4.6],
  ['CleanPro Housekeeping', 'Housekeeping', 960000, 4.3],
  ['GreenThumb Gardening', 'Gardening', 420000, 4.8],
  ['OtisCare Lift Maintenance', 'Lift Maintenance', 360000, 4.1],
  ['Sparky Electricals', 'Electricians', 280000, 4.5],
  ['AquaFlow Plumbing', 'Plumbing', 240000, 4.0],
  ['PestShield Control', 'Pest Control', 180000, 4.7],
  ['PowerGen Generators', 'Generator AMC', 320000, 4.2],
  ['AquaPure Water Tech', 'Water Treatment', 540000, 4.4],
  ['FireSafe Systems', 'Fire Safety', 410000, 4.6]
];
const statuses: Vendor['status'][] = ['Active', 'Active', 'Active', 'Expired', 'Pending'];

export const VENDORS: Vendor[] = data.map(([name, cat, value, rating], i) => ({
  id: `VND${(400 + i)}`,
  name, category: cat,
  contact: `+91 98${(100 + i * 7).toString()}${(40000 + i * 311)}`.slice(0, 14),
  email: `contact@${name.split(' ')[0].toLowerCase()}.in`,
  contractValue: value,
  contractStart: `2025-0${(i % 9) + 1}-01`,
  contractEnd: `2026-${(6 + i % 6).toString().padStart(2, '0')}-30`,
  rating,
  status: statuses[i % statuses.length]
}));

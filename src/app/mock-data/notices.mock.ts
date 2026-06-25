import { Notice } from '../shared/models/models';

export const NOTICES: Notice[] = [
  { id: 'NOT700', title: 'Water Supply Interruption - June 28', body: 'Due to STP maintenance, water supply will be interrupted from 10 AM to 2 PM on June 28. Please store water in advance.', category: 'Maintenance', author: 'Facility Manager', date: '2026-06-24', pinned: true, important: true },
  { id: 'NOT701', title: 'AGM Resolutions Now Available', body: 'Minutes and resolutions from the Annual General Meeting 2026 are available in the Documents section.', category: 'Governance', author: 'Secretary', date: '2026-06-20', pinned: true, important: false },
  { id: 'NOT702', title: 'Monsoon Preparedness Drive', body: 'A monsoon preparedness drive including drain cleaning and tree pruning will be conducted this weekend.', category: 'Safety', author: 'Maintenance Committee', date: '2026-06-18', pinned: false, important: true },
  { id: 'NOT703', title: 'Maintenance Fee Revised', body: 'As approved in the AGM, maintenance fees have been revised by 8% effective July 2026.', category: 'Finance', author: 'Treasurer', date: '2026-06-15', pinned: false, important: true },
  { id: 'NOT704', title: 'Clubhouse Booking Portal Live', body: 'The new clubhouse and hall booking portal is now live. Residents can book amenities online.', category: 'Amenities', author: 'Admin', date: '2026-06-12', pinned: false, important: false },
  { id: 'NOT705', title: 'Yoga Classes Every Morning', body: 'Complimentary yoga classes start at 6 AM daily at the garden lawn. All residents welcome.', category: 'Community', author: 'Cultural Committee', date: '2026-06-10', pinned: false, important: false },
  { id: 'NOT706', title: 'Visitor Parking Poll Open', body: 'Cast your vote on the new visitor parking policy in the Polls section before June 30.', category: 'Governance', author: 'Secretary', date: '2026-06-08', pinned: false, important: false },
  { id: 'NOT707', title: 'Pest Control Schedule', body: 'Quarterly pest control will be carried out block-wise from July 1 to July 4. Schedule on notice board.', category: 'Maintenance', author: 'Facility Manager', date: '2026-06-05', pinned: false, important: false }
];

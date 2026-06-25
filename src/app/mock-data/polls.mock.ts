import { Poll } from '../shared/models/models';

export const POLLS: Poll[] = [
  {
    id: 'POL600', title: 'Gym Equipment Upgrade', category: 'Amenities',
    description: 'Should the association invest INR 5.4L in upgrading gym equipment this year?',
    options: [
      { id: 'o1', label: 'Yes, upgrade now', votes: 142 },
      { id: 'o2', label: 'Defer to next year', votes: 38 },
      { id: 'o3', label: 'No, not needed', votes: 21 }
    ],
    totalVotes: 201, endDate: '2026-07-15', status: 'Active', hasVoted: false
  },
  {
    id: 'POL601', title: 'EV Charging Stations', category: 'Sustainability',
    description: 'Install 12 EV charging points in the basement parking?',
    options: [
      { id: 'o1', label: 'Strongly support', votes: 168 },
      { id: 'o2', label: 'Support with paid usage', votes: 74 },
      { id: 'o3', label: 'Oppose', votes: 19 }
    ],
    totalVotes: 261, endDate: '2026-07-20', status: 'Active', hasVoted: false
  },
  {
    id: 'POL602', title: 'Visitor Parking Policy', category: 'Governance',
    description: 'Adopt time-limited free visitor parking with paid extension?',
    options: [
      { id: 'o1', label: '2 hours free then paid', votes: 96 },
      { id: 'o2', label: 'Fully free', votes: 88 },
      { id: 'o3', label: 'Fully paid', votes: 34 }
    ],
    totalVotes: 218, endDate: '2026-06-30', status: 'Active', hasVoted: true
  },
  {
    id: 'POL603', title: 'Festival Budget Allocation', category: 'Cultural',
    description: 'Approve INR 3L budget for annual cultural festival?',
    options: [
      { id: 'o1', label: 'Approve full budget', votes: 203 },
      { id: 'o2', label: 'Approve INR 2L only', votes: 57 },
      { id: 'o3', label: 'Reject', votes: 12 }
    ],
    totalVotes: 272, endDate: '2026-05-30', status: 'Closed', hasVoted: true
  }
];

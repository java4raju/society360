import { Meeting } from '../shared/models/models';

export const MEETINGS: Meeting[] = [
  {
    id: 'MTG500', title: 'Annual General Meeting 2026', type: 'AGM',
    date: '2026-04-15', location: 'Clubhouse Auditorium', attendees: 187, status: 'Completed',
    agenda: ['Approval of FY25-26 audited accounts', 'Election of new managing committee', 'Maintenance fee revision proposal', 'Solar project approval'],
    decisions: ['Accounts approved unanimously', 'New committee elected for 2026-27', 'Maintenance fee increased by 8%', 'Solar project moved to feasibility study']
  },
  {
    id: 'MTG501', title: 'Monthly Committee Meeting - June', type: 'Committee',
    date: '2026-06-05', location: 'Committee Room', attendees: 9, status: 'Completed',
    agenda: ['Review of pending complaints', 'Lift upgrade progress', 'Vendor contract renewals'],
    decisions: ['Escalate critical complaints within 24h', 'Lift project on track for July', 'Renew housekeeping contract']
  },
  {
    id: 'MTG502', title: 'Emergency Meeting - Water Shortage', type: 'Emergency',
    date: '2026-05-20', location: 'Committee Room', attendees: 7, status: 'Completed',
    agenda: ['Address acute water shortage', 'Tanker arrangement', 'Borewell inspection'],
    decisions: ['Arrange 4 tankers daily', 'Inspect borewell within 3 days', 'Issue water conservation notice']
  },
  {
    id: 'MTG503', title: 'Finance Review Meeting', type: 'Committee',
    date: '2026-06-18', location: 'Committee Room', attendees: 6, status: 'Completed',
    agenda: ['Q1 financial review', 'Defaulter follow-up', 'Reserve fund allocation'],
    decisions: ['Q1 surplus of INR 4.2L noted', 'Legal notice to chronic defaulters', 'Allocate 15% to reserve fund']
  },
  {
    id: 'MTG504', title: 'Quarterly Committee Meeting - July', type: 'Committee',
    date: '2026-07-10', location: 'Committee Room', attendees: 0, status: 'Scheduled',
    agenda: ['Monsoon preparedness', 'CCTV project handover', 'Festival budget planning'],
    decisions: []
  },
  {
    id: 'MTG505', title: 'General Body Meeting - Amenities', type: 'General',
    date: '2026-07-25', location: 'Clubhouse Auditorium', attendees: 0, status: 'Scheduled',
    agenda: ['Gym upgrade proposal', 'EV charging poll results', 'Swimming pool revamp'],
    decisions: []
  }
];

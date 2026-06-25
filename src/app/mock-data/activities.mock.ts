import { Activity } from '../shared/models/models';

export const ACTIVITIES: Activity[] = [
  { id: 'A1', icon: 'payments', title: 'Maintenance payment received', detail: 'Flat A-302 paid INR 8,500', time: '12 min ago', type: 'finance' },
  { id: 'A2', icon: 'report_problem', title: 'New complaint raised', detail: 'Lift not working - Block C', time: '45 min ago', type: 'complaint' },
  { id: 'A3', icon: 'engineering', title: 'Project milestone updated', detail: 'CCTV Upgrade reached 65%', time: '2 hours ago', type: 'project' },
  { id: 'A4', icon: 'campaign', title: 'Notice published', detail: 'Water supply interruption June 28', time: '5 hours ago', type: 'notice' },
  { id: 'A5', icon: 'how_to_vote', title: 'Poll milestone', detail: 'EV Charging poll crossed 250 votes', time: '8 hours ago', type: 'project' },
  { id: 'A6', icon: 'task_alt', title: 'Complaint resolved', detail: 'Garbage collection - Block B', time: '1 day ago', type: 'complaint' },
  { id: 'A7', icon: 'groups', title: 'Meeting scheduled', detail: 'Quarterly Committee Meeting July 10', time: '1 day ago', type: 'meeting' },
  { id: 'A8', icon: 'person_add', title: 'New resident onboarded', detail: 'Flat D-201 - Tenant registered', time: '2 days ago', type: 'resident' }
];

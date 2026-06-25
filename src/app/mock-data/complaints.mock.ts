import { Complaint, ComplaintStatus, Priority } from '../shared/models/models';

const titles = ['Water leakage in bathroom', 'Lift not working', 'Power fluctuation', 'Garbage not collected',
  'Parking dispute', 'Noise complaint', 'Broken street light', 'Seepage on wall', 'Intercom not working',
  'Drainage block', 'Gym equipment broken', 'Pool not cleaned', 'Security gate issue', 'Pest infestation', 'Garden tap broken'];
const categories = ['Plumbing', 'Electrical', 'Security', 'Sanitation', 'Amenities', 'Parking', 'General'];
const statuses: ComplaintStatus[] = ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
const staff = ['Ramesh (Maintenance)', 'Suresh (Electrician)', 'Plumber Team', 'Security Head', null];
const residents = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Anjali Gupta'];

export const COMPLAINTS: Complaint[] = Array.from({ length: 30 }, (_, i) => {
  const status = statuses[i % statuses.length];
  const resolved = status === 'Resolved' || status === 'Closed';
  return {
    id: `CMP${(200 + i)}`,
    title: titles[i % titles.length],
    description: `Reported issue: ${titles[i % titles.length].toLowerCase()}. Requires attention from the maintenance committee.`,
    category: categories[i % categories.length],
    status,
    priority: priorities[i % priorities.length],
    resident: residents[i % residents.length],
    flatNumber: `${['A', 'B', 'C', 'D'][i % 4]}-${(i % 9) + 1}0${(i % 4) + 1}`,
    assignedTo: status === 'Open' ? null : staff[i % staff.length],
    createdDate: `2026-0${(i % 6) + 1}-${((i % 27) + 1).toString().padStart(2, '0')}`,
    resolvedDate: resolved ? `2026-0${(i % 6) + 1}-${(((i % 20) + 5)).toString().padStart(2, '0')}` : null
  };
});

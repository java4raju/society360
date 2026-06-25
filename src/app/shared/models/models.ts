export interface Resident {
  id: string;
  flatNumber: string;
  block: string;
  ownerName: string;
  tenantName: string | null;
  contact: string;
  email: string;
  parkingSlots: number;
  occupancy: 'Owner' | 'Tenant' | 'Vacant';
  status: 'Active' | 'Inactive';
  duesAmount: number;
  joinedDate: string;
}

export type TransactionType = 'Income' | 'Expense';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  method: string;
}

export type ComplaintStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: Priority;
  resident: string;
  flatNumber: string;
  assignedTo: string | null;
  createdDate: string;
  resolvedDate: string | null;
}

export type ProjectStatus = 'Proposed' | 'Approved' | 'In Progress' | 'Completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  budget: number;
  spent: number;
  progress: number;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  owner: string;
  category: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  contractValue: number;
  contractStart: string;
  contractEnd: string;
  rating: number;
  status: 'Active' | 'Expired' | 'Pending';
}

export interface Meeting {
  id: string;
  title: string;
  type: 'AGM' | 'Committee' | 'Emergency' | 'General';
  date: string;
  location: string;
  attendees: number;
  agenda: string[];
  decisions: string[];
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  category: string;
  options: PollOption[];
  totalVotes: number;
  endDate: string;
  status: 'Active' | 'Closed';
  hasVoted: boolean;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: string;
  author: string;
  date: string;
  pinned: boolean;
  important: boolean;
}

export interface DocItem {
  id: string;
  name: string;
  category: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
  description: string;
}

export interface Activity {
  id: string;
  icon: string;
  title: string;
  detail: string;
  time: string;
  type: 'finance' | 'complaint' | 'project' | 'notice' | 'meeting' | 'resident';
}

export interface DashboardSummary {
  totalResidents: number;
  monthlyCollection: number;
  monthlyExpense: number;
  openComplaints: number;
  activeProjects: number;
  bankBalance: number;
}

export interface User {
  username: string;
  name: string;
  role: string;
  email: string;
}

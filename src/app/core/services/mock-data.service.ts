import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Resident, Transaction, Complaint, Project, Vendor, Meeting, Poll, Notice, DocItem, Activity, DashboardSummary
} from '../../shared/models/models';
import { RESIDENTS } from '../../mock-data/residents.mock';
import { TRANSACTIONS } from '../../mock-data/transactions.mock';
import { COMPLAINTS } from '../../mock-data/complaints.mock';
import { PROJECTS } from '../../mock-data/projects.mock';
import { VENDORS } from '../../mock-data/vendors.mock';
import { MEETINGS } from '../../mock-data/meetings.mock';
import { POLLS } from '../../mock-data/polls.mock';
import { NOTICES } from '../../mock-data/notices.mock';
import { DOCUMENTS } from '../../mock-data/documents.mock';
import { ACTIVITIES } from '../../mock-data/activities.mock';

const LATENCY = 800;

@Injectable({ providedIn: 'root' })
export class MockDataService {
  private wrap<T>(data: T): Observable<T> {
    return of(structuredClone(data)).pipe(delay(LATENCY));
  }

  getResidents(): Observable<Resident[]> { return this.wrap(RESIDENTS); }
  getTransactions(): Observable<Transaction[]> { return this.wrap(TRANSACTIONS); }
  getComplaints(): Observable<Complaint[]> { return this.wrap(COMPLAINTS); }
  getProjects(): Observable<Project[]> { return this.wrap(PROJECTS); }
  getVendors(): Observable<Vendor[]> { return this.wrap(VENDORS); }
  getMeetings(): Observable<Meeting[]> { return this.wrap(MEETINGS); }
  getPolls(): Observable<Poll[]> { return this.wrap(POLLS); }
  getNotices(): Observable<Notice[]> { return this.wrap(NOTICES); }
  getDocuments(): Observable<DocItem[]> { return this.wrap(DOCUMENTS); }
  getActivities(): Observable<Activity[]> { return this.wrap(ACTIVITIES); }

  getDashboardSummary(): Observable<DashboardSummary> {
    const income = TRANSACTIONS.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
    const expense = TRANSACTIONS.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
    return this.wrap({
      totalResidents: RESIDENTS.filter(r => r.status === 'Active').length,
      monthlyCollection: Math.round(income / 12),
      monthlyExpense: Math.round(expense / 12),
      openComplaints: COMPLAINTS.filter(c => c.status === 'Open' || c.status === 'Assigned' || c.status === 'In Progress').length,
      activeProjects: PROJECTS.filter(p => p.status === 'In Progress' || p.status === 'Approved').length,
      bankBalance: income - expense + 5200000
    });
  }
}

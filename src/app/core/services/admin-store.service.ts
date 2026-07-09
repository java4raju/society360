import { Injectable, signal, inject } from '@angular/core';
import {
  Resident, Transaction, Complaint, Project, Vendor, Meeting, Poll, Notice
} from '../../shared/models/models';
import { RESIDENTS } from '../../mock-data/residents.mock';
import { TRANSACTIONS } from '../../mock-data/transactions.mock';
import { COMPLAINTS } from '../../mock-data/complaints.mock';
import { PROJECTS } from '../../mock-data/projects.mock';
import { VENDORS } from '../../mock-data/vendors.mock';
import { MEETINGS } from '../../mock-data/meetings.mock';
import { POLLS } from '../../mock-data/polls.mock';
import { NOTICES } from '../../mock-data/notices.mock';

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid(): string {
  return crypto.randomUUID();
}

@Injectable({ providedIn: 'root' })
export class AdminStoreService {
  readonly residents = signal<Resident[]>(load('adm_residents', RESIDENTS));
  readonly transactions = signal<Transaction[]>(load('adm_transactions', TRANSACTIONS));
  readonly complaints = signal<Complaint[]>(load('adm_complaints', COMPLAINTS));
  readonly projects = signal<Project[]>(load('adm_projects', PROJECTS));
  readonly vendors = signal<Vendor[]>(load('adm_vendors', VENDORS));
  readonly meetings = signal<Meeting[]>(load('adm_meetings', MEETINGS));
  readonly polls = signal<Poll[]>(load('adm_polls', POLLS));
  readonly notices = signal<Notice[]>(load('adm_notices', NOTICES));

  // ── Residents ──────────────────────────────────────────────────────────────
  addResident(r: Omit<Resident, 'id'>): void {
    this.residents.update(list => {
      const next = [...list, { ...r, id: uid() }];
      save('adm_residents', next);
      return next;
    });
  }
  updateResident(id: string, r: Partial<Resident>): void {
    this.residents.update(list => {
      const next = list.map(x => x.id === id ? { ...x, ...r } : x);
      save('adm_residents', next);
      return next;
    });
  }
  deleteResident(id: string): void {
    this.residents.update(list => {
      const next = list.filter(x => x.id !== id);
      save('adm_residents', next);
      return next;
    });
  }
  bulkImportResidents(rows: Omit<Resident, 'id'>[]): void {
    this.residents.update(list => {
      const next = [...list, ...rows.map(r => ({ ...r, id: uid() }))];
      save('adm_residents', next);
      return next;
    });
  }

  // ── Transactions ───────────────────────────────────────────────────────────
  addTransaction(t: Omit<Transaction, 'id'>): void {
    this.transactions.update(list => {
      const next = [...list, { ...t, id: uid() }];
      save('adm_transactions', next);
      return next;
    });
  }
  updateTransaction(id: string, t: Partial<Transaction>): void {
    this.transactions.update(list => {
      const next = list.map(x => x.id === id ? { ...x, ...t } : x);
      save('adm_transactions', next);
      return next;
    });
  }
  deleteTransaction(id: string): void {
    this.transactions.update(list => {
      const next = list.filter(x => x.id !== id);
      save('adm_transactions', next);
      return next;
    });
  }
  bulkImportTransactions(rows: Omit<Transaction, 'id'>[]): void {
    this.transactions.update(list => {
      const next = [...list, ...rows.map(t => ({ ...t, id: uid() }))];
      save('adm_transactions', next);
      return next;
    });
  }

  // ── Complaints ─────────────────────────────────────────────────────────────
  addComplaint(c: Omit<Complaint, 'id'>): void {
    this.complaints.update(list => {
      const next = [...list, { ...c, id: uid() }];
      save('adm_complaints', next);
      return next;
    });
  }
  updateComplaint(id: string, c: Partial<Complaint>): void {
    this.complaints.update(list => {
      const next = list.map(x => x.id === id ? { ...x, ...c } : x);
      save('adm_complaints', next);
      return next;
    });
  }
  deleteComplaint(id: string): void {
    this.complaints.update(list => {
      const next = list.filter(x => x.id !== id);
      save('adm_complaints', next);
      return next;
    });
  }

  // ── Projects ───────────────────────────────────────────────────────────────
  addProject(p: Omit<Project, 'id'>): void {
    this.projects.update(list => {
      const next = [...list, { ...p, id: uid() }];
      save('adm_projects', next);
      return next;
    });
  }
  updateProject(id: string, p: Partial<Project>): void {
    this.projects.update(list => {
      const next = list.map(x => x.id === id ? { ...x, ...p } : x);
      save('adm_projects', next);
      return next;
    });
  }
  deleteProject(id: string): void {
    this.projects.update(list => {
      const next = list.filter(x => x.id !== id);
      save('adm_projects', next);
      return next;
    });
  }

  // ── Vendors ────────────────────────────────────────────────────────────────
  addVendor(v: Omit<Vendor, 'id'>): void {
    this.vendors.update(list => {
      const next = [...list, { ...v, id: uid() }];
      save('adm_vendors', next);
      return next;
    });
  }
  updateVendor(id: string, v: Partial<Vendor>): void {
    this.vendors.update(list => {
      const next = list.map(x => x.id === id ? { ...x, ...v } : x);
      save('adm_vendors', next);
      return next;
    });
  }
  deleteVendor(id: string): void {
    this.vendors.update(list => {
      const next = list.filter(x => x.id !== id);
      save('adm_vendors', next);
      return next;
    });
  }

  // ── Meetings ───────────────────────────────────────────────────────────────
  addMeeting(m: Omit<Meeting, 'id'>): void {
    this.meetings.update(list => {
      const next = [...list, { ...m, id: uid() }];
      save('adm_meetings', next);
      return next;
    });
  }
  updateMeeting(id: string, m: Partial<Meeting>): void {
    this.meetings.update(list => {
      const next = list.map(x => x.id === id ? { ...x, ...m } : x);
      save('adm_meetings', next);
      return next;
    });
  }
  deleteMeeting(id: string): void {
    this.meetings.update(list => {
      const next = list.filter(x => x.id !== id);
      save('adm_meetings', next);
      return next;
    });
  }

  // ── Polls ──────────────────────────────────────────────────────────────────
  addPoll(p: Omit<Poll, 'id'>): void {
    this.polls.update(list => {
      const next = [...list, { ...p, id: uid() }];
      save('adm_polls', next);
      return next;
    });
  }
  updatePoll(id: string, p: Partial<Poll>): void {
    this.polls.update(list => {
      const next = list.map(x => x.id === id ? { ...x, ...p } : x);
      save('adm_polls', next);
      return next;
    });
  }
  deletePoll(id: string): void {
    this.polls.update(list => {
      const next = list.filter(x => x.id !== id);
      save('adm_polls', next);
      return next;
    });
  }

  // ── Notices ────────────────────────────────────────────────────────────────
  addNotice(n: Omit<Notice, 'id'>): void {
    this.notices.update(list => {
      const next = [...list, { ...n, id: uid() }];
      save('adm_notices', next);
      return next;
    });
  }
  updateNotice(id: string, n: Partial<Notice>): void {
    this.notices.update(list => {
      const next = list.map(x => x.id === id ? { ...x, ...n } : x);
      save('adm_notices', next);
      return next;
    });
  }
  deleteNotice(id: string): void {
    this.notices.update(list => {
      const next = list.filter(x => x.id !== id);
      save('adm_notices', next);
      return next;
    });
  }

  resetAll(): void {
    const keys = ['adm_residents','adm_transactions','adm_complaints','adm_projects','adm_vendors','adm_meetings','adm_polls','adm_notices'];
    keys.forEach(k => localStorage.removeItem(k));
    this.residents.set(structuredClone(RESIDENTS));
    this.transactions.set(structuredClone(TRANSACTIONS));
    this.complaints.set(structuredClone(COMPLAINTS));
    this.projects.set(structuredClone(PROJECTS));
    this.vendors.set(structuredClone(VENDORS));
    this.meetings.set(structuredClone(MEETINGS));
    this.polls.set(structuredClone(POLLS));
    this.notices.set(structuredClone(NOTICES));
  }
}

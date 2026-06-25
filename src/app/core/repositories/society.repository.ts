import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MockDataService } from '../services/mock-data.service';
import { environment } from '../../../environments/environment';
import {
  Resident, Transaction, Complaint, Project, Vendor, Meeting, Poll, Notice, DocItem, Activity, DashboardSummary
} from '../../shared/models/models';

/**
 * SocietyRepository is the single data access point for components.
 * It chooses between the live backend (HttpClient) and the mock data
 * service based on `environment.useBackend`.
 */
@Injectable({ providedIn: 'root' })
export class SocietyRepository {
  private mock = inject(MockDataService);
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  private fetch<T>(endpoint: string, mockFn: () => Observable<T>): Observable<T> {
    return environment.useBackend ? this.http.get<T>(`${this.base}/${endpoint}`) : mockFn();
  }

  getResidents() { return this.fetch<Resident[]>('residents', () => this.mock.getResidents()); }
  getTransactions() { return this.fetch<Transaction[]>('transactions', () => this.mock.getTransactions()); }
  getComplaints() { return this.fetch<Complaint[]>('complaints', () => this.mock.getComplaints()); }
  getProjects() { return this.fetch<Project[]>('projects', () => this.mock.getProjects()); }
  getVendors() { return this.fetch<Vendor[]>('vendors', () => this.mock.getVendors()); }
  getMeetings() { return this.fetch<Meeting[]>('meetings', () => this.mock.getMeetings()); }
  getPolls() { return this.fetch<Poll[]>('polls', () => this.mock.getPolls()); }
  getNotices() { return this.fetch<Notice[]>('notices', () => this.mock.getNotices()); }
  getDocuments() { return this.fetch<DocItem[]>('documents', () => this.mock.getDocuments()); }
  getActivities() { return this.fetch<Activity[]>('activities', () => this.mock.getActivities()); }
  getDashboardSummary() { return this.fetch<DashboardSummary>('dashboard/summary', () => this.mock.getDashboardSummary()); }
}

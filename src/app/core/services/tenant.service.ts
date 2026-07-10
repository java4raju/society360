import { Injectable, signal, computed } from '@angular/core';

export interface TenantInfo {
  tenantId: string;
  slug: string;
  name: string;
  status: 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  trialEndsAt: string | null;
  maxUnits: number;
  planName: string;
}

const STORAGE_KEY = 's360_tenant';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private tenantSignal = signal<TenantInfo | null>(this.readStored());

  readonly tenant = this.tenantSignal.asReadonly();

  readonly isTrial = computed(() => this.tenantSignal()?.status === 'TRIAL');
  readonly isSuspended = computed(() => this.tenantSignal()?.status === 'SUSPENDED');

  readonly trialDaysLeft = computed(() => {
    const t = this.tenantSignal();
    if (!t?.trialEndsAt) return null;
    const diff = new Date(t.trialEndsAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  });

  private readStored(): TenantInfo | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  setTenant(info: TenantInfo): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    this.tenantSignal.set(info);
  }

  clearTenant(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.tenantSignal.set(null);
  }

  /** Returns the API base URL prefixed with the tenant's subdomain context */
  getSubdomain(): string {
    const host = window.location.hostname;
    if (host.includes('.')) {
      return host.split('.')[0];
    }
    return this.tenantSignal()?.slug ?? 'demo';
  }
}

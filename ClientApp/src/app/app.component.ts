import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  template: `
    <div id="login-overlay" class="modal-overlay" *ngIf="!loggedIn" style="display:flex">
      <div class="modal-content login-card">
        <div class="login-logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <h2>Etaprise</h2>
        <p class="login-subtitle">Warehouse Management System</p>
        <form (submit)="login($event)">
          <div class="form-group">
            <label>Username</label>
            <input type="text" class="form-control" [(ngModel)]="username" name="username" value="admin" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password" value="Admin@123" required>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Sign In</button>
        </form>
      </div>
    </div>
    <router-outlet *ngIf="loggedIn"></router-outlet>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.3); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal-content {
      background: #ffffff; border: 1px solid var(--border-color); box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      border-radius: var(--radius); width: 92%; max-width: 380px;
      padding: 26px; animation: modalIn 0.25s ease;
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.95) translateY(-10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .login-card { text-align: center; }
    .login-logo { margin-bottom: 12px; }
    .login-subtitle { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 22px; }
    h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 4px; }
    .form-group { margin-bottom: 14px; text-align: left; }
    .form-group label { display: block; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 5px; font-weight: 500; }
    .form-control {
      width: 100%; background: var(--bg-input); border: 1px solid var(--border-color);
      color: var(--text-main); padding: 9px 13px; border-radius: var(--radius-sm);
      font-family: var(--font); font-size: 0.85rem; outline: none;
    }
    .form-control:focus { border-color: var(--color-primary); }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 9px 18px; border-radius: var(--radius-sm); font-family: var(--font); font-size: 0.85rem; font-weight: 500; cursor: pointer; border: none; }
    .btn-primary { background: var(--color-primary); color: #fff; width: 100%; }
    .btn-primary:hover { filter: brightness(1.12); box-shadow: 0 0 16px rgba(14,165,233,0.25); }
  `]
})
export class AppComponent {
  username = 'admin';
  password = 'Admin@123';
  loggedIn = false;

  constructor(private api: ApiService, private router: Router) {
    this.loggedIn = api.isLoggedIn;
    if (this.loggedIn) this.seedData();
  }

  async login(e: Event): Promise<void> {
    e.preventDefault();
    await this.api.seed().toPromise();
    const res = await this.api.login(this.username, this.password).toPromise();
    if (res?.token) {
      this.loggedIn = true;
      this.seedData();
    }
  }

  async seedData(): Promise<void> {
    const whs = await this.api.get<any[]>('/warehouse').toPromise();
    if (Array.isArray(whs) && whs.length > 0) return;

    const wh = await this.api.post<any>('/warehouse', {
      warehouseCode: 'WH-MUM-01', warehouseName: 'Mumbai Central Warehouse', timezone: 'Asia/Kolkata',
      totalAreaSqFt: 25000, address: 'Kurla Industrial Estate, Mumbai', isActive: true
    }).toPromise();
    if (!wh) return;

    const zoneTypes = [
      { code: 'Z-STORAGE', name: 'Bulk Storage', type: 'Storage', color: '#10b981' },
      { code: 'Z-DOCK', name: 'Receiving Dock', type: 'Dock', color: '#0ea5e9' },
      { code: 'Z-STAGING', name: 'Outbound Staging', type: 'Staging', color: '#f59e0b' },
      { code: 'Z-QUAR', name: 'Quarantine Area', type: 'Quarantine', color: '#ef4444' }
    ];
    for (const t of zoneTypes) {
      await this.api.post(`/warehouse/${wh.warehouseId}/zones`, { ...t, positionX: 10, positionY: 10, isActive: true }).toPromise();
    }

    await this.api.post('/item/uoms', { uomCode: 'PCS', description: 'Pieces', isActive: true }).toPromise();
    const items = ['SKU-ELV-RAIL-01','T-Guide Rail 5m', 'SKU-ELV-MOTOR-02','Traction Motor 10kW', 'SKU-ELV-CABIN-03','Cabin Assembly'];
    for (let i = 0; i < items.length; i += 2) {
      await this.api.post('/item', { skuCode: items[i], itemName: items[i+1], uomId: 'PCS', standardCost: i === 0 ? 4500 : i === 2 ? 125000 : 85000, hsnCode: '84313100', isActive: true }).toPromise();
    }

    const vendor = await this.api.post<any>('/item/vendors', {
      vendorCode: 'VND-ELV-01', vendorName: 'Elevator Spares India Ltd', contactPerson: 'Rajesh Sharma',
      email: 'sales@elvspares.in', mobile: '9876543210', isApproved: true, isActive: true
    }).toPromise();

    const customer = await this.api.post<any>('/item/customers', {
      customerCode: 'CST-ELV-01', customerName: 'Hilton Hotels Mumbai',
      siteAddress: 'Sahar Airport Road, Mumbai', isActive: true
    }).toPromise();
  }
}

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  showNotif = false;

  pageTitle = 'Warehouse Dashboard';

  expandedMenu: string = 'operations'; // default open

  constructor(
    private api: ApiService,
    private router: Router
  ) {

    this.router.events.subscribe(() => {

     const routes: Record<string, string> = {

  dashboard: 'Dashboard',

  inventory: 'Inventory',

  'inventory-management': 'Inventory Dashboard',

  warehouse: 'Warehouse Management',

  'model-master': 'Model Master',

  'item-master': 'Item Master',

  'create-item': 'Create New Item',

  procurement: 'Procurement',

  putaway: 'Putaway',

  picking: 'Picking',

  packing: 'Packing',

  dispatch: 'Dispatch',

  projects: 'Projects & BOM',

  reports: 'Reports',

  admin: 'Administration',

  'warehouse-setup': 'Warehouse Setup'
};

      const seg = this.router.url.split('/')[1] || 'dashboard';

      this.pageTitle = routes[seg] || 'Dashboard';
    });
  }

  toggleMenu(menu: string) {
    this.expandedMenu =
      this.expandedMenu === menu ? '' : menu;
  }

  isExpanded(menu: string): boolean {
    return this.expandedMenu === menu;
  }

  logout(): void {
    this.api.logout();
    window.location.reload();
  }

  ngOnInit() {
    document.body.style.margin = '0';
  }
}

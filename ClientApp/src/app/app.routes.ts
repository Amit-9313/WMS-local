import { Routes } from '@angular/router';
 
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
 
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventoryManagementComponent } from './components/inventory/inventory-management/inventory-management.component';
import { WarehouseComponent } from './components/inventory/warehouse/warehouse.component';
import { ModelMasterComponent } from './components/inventory/model-master/model-master.component';
import { ItemMasterComponent } from './components/inventory/item-master/item-master.component';
 
import { CreateItemComponent } from './components/inventory/item-master/create-item/create-item.component';
import { EditItemComponent } from './components/inventory/item-master/edit-item/edit-item.component';
import { ViewItemComponent } from './components/inventory/item-master/view-item/view-item.component';
 
import { CreateWarehouseComponent } from './components/inventory/warehouse/create-warehouse/create-warehouse.component';
 
import { ProcurementComponent } from './components/procurement/procurement.component';
 
import { ReceivingComponent } from './components/receiving/receiving.component';
import { CreateGrnComponent } from './components/receiving/create-grn/create-grn.component';
import { GrnDetailsComponent } from './components/receiving/grn-details/grn-details.component';
import { BarcodeScannerComponent } from './components/receiving/barcode-scanner/barcode-scanner.component';
import { InspectionComponent } from './components/receiving/inspection/inspection.component';
 
import { PutawayComponent } from './components/putaway/putaway.component';
import { PickingComponent } from './components/picking/picking.component';
import { PackingComponent } from './components/packing/packing.component';
import { DispatchComponent } from './components/dispatch/dispatch.component';
 
import { ProjectsComponent } from './components/projects/projects.component';
 
import { WarehouseSetupComponent } from './components/warehouse-setup/warehouse-setup.component';
import { Layout3dComponent } from './components/layout-3d/layout-3d.component';
 
import { QualityComponent } from './components/quality/quality.component';
import { ReturnsComponent } from './components/returns/returns.component';
 
import { ReportsComponent } from './components/reports/reports.component';
import { AdminComponent } from './components/admin/admin.component';
 
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
 
      
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
 
  {
    path: 'dashboard',
    component: DashboardComponent
  },
 
  {
    path: 'inventory',
    component: InventoryComponent
  },
 
  {
    path: 'inventory-management',
    component: InventoryManagementComponent
  },
 
  {
    path: 'warehouse',
    component: WarehouseComponent
  },
 
  {
    path: 'model-master',
    component: ModelMasterComponent
  },
 
  {
    path: 'create-model',
    loadComponent: () =>
      import('./components/inventory/model-master/create-model/create-model.component')
        .then(m => m.CreateModelComponent)
  },
 
  {
    path: 'edit-model/:id',
    loadComponent: () =>
      import('./components/inventory/model-master/edit-model/edit-model.component')
        .then(m => m.EditModelComponent)
  },
 
  {
    path: 'view-model/:id',
    loadComponent: () =>
      import('./components/inventory/model-master/view-model/view-model.component')
        .then(m => m.ViewModelComponent)
  },
 
  {
    path: 'item-master',
    component: ItemMasterComponent
  },
 
  {
    path: 'inventory/item-master/create',
    component: CreateItemComponent
  },
 
  {
    path: 'inventory/item-master/edit/:id',
    component: EditItemComponent
  },
 
  {
    path: 'inventory/item-master/view/:id',
    component: ViewItemComponent
  },
 
  {
    path: 'inventory/create-warehouse',
    component: CreateWarehouseComponent
  },
 
  {
    path: 'inventory/view-warehouse/:id',
    loadComponent: () =>
      import('./components/inventory/warehouse/view-warehouse/view-warehouse.component')
        .then(m => m.ViewWarehouseComponent)
  },
 
  {
    path: 'inventory/edit-warehouse/:id',
    loadComponent: () =>
      import('./components/inventory/warehouse/edit-warehouse/edit-warehouse.component')
        .then(m => m.EditWarehouseComponent)
  },
 
  {
    path: 'procurement',
    component: ProcurementComponent
  },
 
  {
    path: 'receiving',
    component: ReceivingComponent
  },
 
  {
    path: 'receiving/create',
    component: CreateGrnComponent
  },
 
  {
    path: 'receiving/details/:id',
    component: GrnDetailsComponent
  },
 
  {
    path: 'receiving/barcode',
    component: BarcodeScannerComponent
  },
 
  {
    path: 'receiving/barcode-scanner',
    component: BarcodeScannerComponent
  },
 
  {
    path: 'receiving/inspection',
    component: InspectionComponent
  },
 
  {
    path: 'putaway',
    component: PutawayComponent
  },
 
  {
    path: 'picking',
    component: PickingComponent
  },
 
  {
    path: 'packing',
    component: PackingComponent
  },
 
  {
    path: 'dispatch',
    component: DispatchComponent
  },
 
  {
    path: 'projects',
    component: ProjectsComponent
  },
 
  {
    path: 'warehouse-setup',
    component: WarehouseSetupComponent
  },
 
  {
    path: 'admin',
    component: AdminComponent
  },
 
  {
    path: 'admin/users',
    component: AdminComponent
  },
 
  {
    path: 'admin/settings',
    component: AdminComponent
  },
 
  {
    path: 'reports',
    component: ReportsComponent
  },
 
  {
    path: 'quality',
    component: QualityComponent
  },
 
  {
    path: 'returns',
    component: ReturnsComponent
  },
 
  {
    path: 'layout-3d',
    component: Layout3dComponent
  }
]
 
 
},
 
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
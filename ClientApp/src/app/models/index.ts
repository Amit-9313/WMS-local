export interface Warehouse {
  warehouseId: string; warehouseCode: string; warehouseName: string;
  address?: string; timezone: string; totalAreaSqFt?: number; isActive: boolean;
}
export interface Zone {
  zoneId: string; warehouseId: string; zoneCode: string; zoneName: string;
  zoneType: string; colorHex?: string; stageAssignment?: string;
}
export interface Rack {
  rackId: string; zoneId: string; rackCode: string; levelCount: number;
  orientation: string; length: number; width: number; height: number;
}
export interface Shelf {
  shelfId: string; rackId: string; shelfCode: string; levelIndex: number;
}
export interface Bin {
  binId: string; shelfId: string; binCode: string;
  capacityWeightKg: number; capacityVolumeL: number;
  mixRule: string; isFrozen: boolean; barcodeUrl?: string;
}
export interface Item {
  itemId: string; skuCode: string; itemName: string; description?: string;
  uomId: string; hsnCode?: string; standardCost: number;
  weightKg?: number; minStockQty?: number; isActive: boolean;
}
export interface Vendor {
  vendorId: string; vendorCode: string; vendorName: string;
  contactPerson?: string; email?: string; mobile?: string;
  gstNumber?: string; rating?: number; isApproved: boolean;
}
export interface Customer {
  customerId: string; customerCode: string; customerName: string;
  projectName?: string; contactPerson?: string; mobile?: string;
  gstNumber?: string; siteAddress?: string;
}
export interface Project {
  projectId: string; projectCode: string; projectName: string;
  customerId: string; warehouseId: string; status: string;
  startDate?: string; endDate?: string; completionPct?: number;
  customer?: Customer; warehouse?: Warehouse;
}
export interface BOM {
  bomId: string; projectId: string; version: number; status: string;
  lines: BOMLine[];
}
export interface BOMLine {
  bomLineId: string; itemId: string; stageCode: string;
  requiredQty: number; allocatedQty: number; pickedQty: number;
  item?: Item;
}
export interface Stage {
  stageId: string; projectId: string; stageCode: string; stageName: string;
  status: string; completionPct: number; plannedStartDate?: string; plannedEndDate?: string;
  actualStartDate?: string; actualEndDate?: string;
}
export interface PR {
  prId: string; prNumber: string; priority: string;
  requiredByDate?: string; status: string; approvalLevel: number;
}
export interface PO {
  poId: string; poNumber: string; vendorId: string; warehouseId: string;
  poDate: string; totalAmount: number; status: string;
  vendor?: Vendor; warehouse?: Warehouse;
  lines: POLine[];
}
export interface POLine {
  poLineId: string; itemId: string; orderedQty: number;
  receivedQty: number; unitPrice: number; item?: Item;
}
export interface GRN {
  grnId: string; grnNumber: string; poId: string;
  vendorId: string; receiptType: string; invoiceNumber?: string;
  vehicleNumber?: string; status: string; receivedAt: string;
  vendor?: Vendor; po?: PO;
  lines: GRNLine[];
}
export interface GRNLine {
  grnLineId: string; itemId: string; receivedQty: number;
  acceptedQty: number; rejectedQty: number; lotNumber?: string;
  inspectionStatus: string; item?: Item;
}
export interface Stock {
  stockId: string; warehouseId: string; binId: string;
  itemId: string; lotNumber?: string; onHandQty: number;
  reservedQty: number; availableQty: number; damagedQty: number;
  item?: Item; bin?: Bin; warehouse?: Warehouse;
}
export interface Movement {
  movementId: string; transactionNumber: string; movementType: string;
  itemId: string; sourceBinId?: string; destinationBinId?: string;
  qty: number; performedAt: string;
  item?: Item; sourceBin?: Bin; destinationBin?: Bin;
}
export interface CycleCount {
  cycleCountId: string; countSheetNumber: string; countDate: string;
  warehouseId: string; countType: string; status: string;
  warehouse?: Warehouse; zone?: Zone;
}
export interface Transfer {
  transferId: string; transferNumber: string;
  sourceWarehouseId: string; destWarehouseId: string;
  status: string; transferDate: string;
  sourceWarehouse?: Warehouse; destWarehouse?: Warehouse;
}
export interface PickWave {
  waveId: string; waveNumber: string; waveType: string;
  projectId?: string; stageCode?: string; status: string;
  totalLines: number; completedLines: number;
  project?: Project;
}
export interface PickTask {
  pickTaskId: string; waveId: string; itemId: string;
  sourceBinId: string; requestedQty: number; pickedQty: number;
  status: string; lotNumber?: string;
  item?: Item; sourceBin?: Bin; wave?: PickWave;
}
export interface Package {
  packageId: string;
  packageNumber: string;

  projectId?: string;
  project?: any;

  packedById?: string;
  packedAt?: string;

  status: 'Open' | 'Sealed' | 'Dispatched';

  weightKg: number;

  declaredValue?: number;

  isHazmatPackage?: boolean;

  hazmatLabel?: string;

  barcodeUrl?: string;

  labelTemplate?: string;

  stageCode?: string;

  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
}
export interface Shipment {
  shipmentId: string; shipmentNumber: string;
  customerId: string; sourceWarehouseId: string;
  deliveryAddress?: string; transportMode: string;
  ewayBillNumber?: string; status: string;
  totalPackages: number;
  customer?: Customer; sourceWarehouse?: Warehouse;
}
export interface Inspection {
  inspectionId: string; inspectionNumber: string;
  grnLineId: string; itemId: string; lotNumber?: string;
  inspectionType: string; sampleQty: number;
  passQty: number; failQty: number; result: string;
  item?: Item; inspector?: string;
}
export interface CRN {
  crnId: string; crnNumber: string; customerId: string;
  returnReason: string; status: string;
  customer?: Customer; lines: CRNLine[];
}
export interface CRNLine {
  crnLineId: string; itemId: string; returnedQty: number;
  acceptedQty: number; condition: string; item?: Item;
}
export interface VRN {
  vrnId: string; vrnNumber: string; vendorId: string;
  returnReason: string; status: string;
  vendor?: Vendor; lines: VRNLine[];
}
export interface VRNLine {
  vrnLineId: string; itemId: string; returnQty: number;
  returnReason: string; item?: Item;
}
export interface UOM {
  uomId: string; uomCode: string; description: string;
}
export interface LoginResponse {
  token: string; refreshToken: string; username: string; role: string;
}
export interface KpiData {
  totalStockValue: number; activeSkus: number; binUtilization: number;
  activeProjects: number; pendingTasks: number; accuracyRate: number;
}

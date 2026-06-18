const API = 'http://localhost:5000/api';
let token = localStorage.getItem('wms_token') || '';
let currentTab = 'dashboard';
let canvas, ctx;

document.addEventListener('DOMContentLoaded', () => {
  init();
  if (token) loginSuccess();
});

function init() {
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('logout-btn')?.addEventListener('click', logout);
  document.getElementById('global-search')?.addEventListener('keyup', e => {
    if (e.key === 'Enter') searchGlobal(e.target.value);
  });

  // Warehouse form
  document.getElementById('form-wh')?.addEventListener('submit', e => { e.preventDefault(); createWarehouse(); });
  document.getElementById('form-zone')?.addEventListener('submit', e => { e.preventDefault(); createZone(); });
  document.getElementById('form-bin')?.addEventListener('submit', e => { e.preventDefault(); createBin(); });
  document.getElementById('form-item')?.addEventListener('submit', e => { e.preventDefault(); createItem(); });
  document.getElementById('form-project')?.addEventListener('submit', e => { e.preventDefault(); createProject(); });

  // Modal forms
  document.getElementById('form-pr')?.addEventListener('submit', e => { e.preventDefault(); createPR(); });
  document.getElementById('form-po')?.addEventListener('submit', e => { e.preventDefault(); createPO(); });
  document.getElementById('form-grn')?.addEventListener('submit', e => { e.preventDefault(); createGRN(); });
  document.getElementById('form-wave')?.addEventListener('submit', e => { e.preventDefault(); createWave(); });
  document.getElementById('form-package')?.addEventListener('submit', e => { e.preventDefault(); createPackage(); });
  document.getElementById('form-shipment')?.addEventListener('submit', e => { e.preventDefault(); createShipment(); });
  document.getElementById('form-vendor')?.addEventListener('submit', e => { e.preventDefault(); createVendor(); });
  document.getElementById('form-customer')?.addEventListener('submit', e => { e.preventDefault(); createCustomer(); });
  document.getElementById('form-adjust')?.addEventListener('submit', e => { e.preventDefault(); adjustStock(); });
  document.getElementById('form-move')?.addEventListener('submit', e => { e.preventDefault(); moveStock(); });
  document.getElementById('form-cycle')?.addEventListener('submit', e => { e.preventDefault(); createCycleCount(); });
  document.getElementById('form-transfer')?.addEventListener('submit', e => { e.preventDefault(); createTransfer(); });
  document.getElementById('form-bom')?.addEventListener('submit', e => { e.preventDefault(); importBOM(); });
  document.getElementById('form-inspect')?.addEventListener('submit', e => { e.preventDefault(); createInspection(); });
  document.getElementById('form-crn')?.addEventListener('submit', e => { e.preventDefault(); createCRN(); });
  document.getElementById('form-vrn')?.addEventListener('submit', e => { e.preventDefault(); createVRN(); });

  canvas = document.getElementById('wms-canvas');
  if (canvas) { ctx = canvas.getContext('2d'); setupCanvas(); }
}

// ===== AUTH =====
async function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById('login-username').value;
  const p = document.getElementById('login-password').value;
  await fetch(`${API}/auth/seed`, { method: 'POST' }).catch(() => {});
  const res = await api('/auth/login', 'POST', { username: u, password: p });
  if (res?.token) {
    token = res.token;
    localStorage.setItem('wms_token', token);
    toast('Authenticated successfully', 'success');
    loginSuccess();
    seedDemoData();
  }
}

function loginSuccess() {
  document.getElementById('login-overlay').style.display = 'none';
  document.getElementById('sidebar').style.display = 'flex';
  document.querySelector('main').style.display = 'flex';
  loadTab('dashboard');
}

function logout() {
  token = '';
  localStorage.removeItem('wms_token');
  document.getElementById('sidebar').style.display = 'none';
  document.querySelector('main').style.display = 'none';
  document.getElementById('login-overlay').style.display = 'flex';
}

// ===== API HELPER =====
async function api(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const res = await fetch(`${API}${endpoint}`, { method, headers, body: body ? JSON.stringify(body) : null });
    if (res.status === 401) { logout(); return null; }
    if (!res.ok) { const e = await res.json().catch(() => ({})); toast(e.message || 'Request failed', 'error'); return null; }
    return res.status === 204 ? true : await res.json().catch(() => ({}));
  } catch { toast('Network error', 'error'); return null; }
}

// ===== TAB SWITCHING =====
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector(`.nav-item[data-tab="${tab}"]`)?.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${tab}`)?.classList.add('active');
  const titles = { dashboard:'Dashboard', procurement:'Procurement', receiving:'Receiving (GRN)', inventory:'Inventory',
    putaway:'Putaway', 'warehouse-setup':'Warehouse Setup', layout:'3D Layout', projects:'Projects & BOM',
    picking:'Picking', packing:'Packing', dispatch:'Dispatch', quality:'Quality Inspection',
    returns:'Returns', reports:'Reports' };
  document.getElementById('page-title').textContent = titles[tab] || tab;
  loadTab(tab);
}

function switchSubTab(parent, sub, btn) {
  const container = btn.closest('.tab-content') || document;
  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  container.querySelectorAll('.sub-tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`sub-${parent}-${sub}`)?.classList.add('active');
}

function loadTab(tab) {
  const fns = { dashboard: loadDashboard, procurement: loadProcurement, receiving: loadReceiving,
    inventory: loadInventory, putaway: loadPutaway, 'warehouse-setup': loadWarehouseSetup,
    layout: loadLayout, projects: loadProjects, picking: loadPicking, packing: loadPacking,
    dispatch: loadDispatch, quality: loadQuality, returns: loadReturns, reports: () => {} };
  fns[tab]?.();
}

// ===== DASHBOARD =====
async function loadDashboard() {
  const items = await api('/item').catch(() => []);
  const projects = await api('/project').catch(() => []);
  document.getElementById('dash-skus').textContent = Array.isArray(items) ? items.length : 0;
  document.getElementById('dash-projects').textContent = Array.isArray(projects) ? projects.length : 0;

  const movBody = document.getElementById('dash-movements');
  const moves = await api('/inventory/movements?limit=5').catch(() => []);
  if (Array.isArray(moves) && moves.length) {
    movBody.innerHTML = moves.map(m => `<tr>
      <td>${m.performedAt ? new Date(m.performedAt).toLocaleTimeString() : '-'}</td>
      <td><span class="badge badge-primary">${m.movementType || '-'}</span></td>
      <td>${m.item?.skuCode || '-'}</td>
      <td>${m.sourceBin?.binCode || 'Inbound'}</td>
      <td>${m.destinationBin?.binCode || 'Outbound'}</td>
      <td>${m.qty}</td>
      <td>Admin</td>
    </tr>`).join('');
  }
}

// ===== WAREHOUSE SETUP =====
async function loadWarehouseSetup() {
  const whs = await api('/warehouse').catch(() => []);
  const whBody = document.getElementById('wh-list-body');
  if (whBody) {
    whBody.innerHTML = Array.isArray(whs) && whs.length
      ? whs.map(w => `<tr><td>${w.warehouseCode}</td><td>${w.warehouseName}</td><td>${w.address || '-'}</td><td>${w.timezone}</td><td>${w.totalAreaSqFt || 0}</td><td><span class="badge badge-success">Active</span></td></tr>`).join('')
      : '<tr><td colspan="6" class="text-center text-muted">No warehouses</td></tr>';
  }

  // Populate zone dropdown
  const zWh = document.getElementById('zone-wh');
  if (zWh && Array.isArray(whs)) zWh.innerHTML = whs.map(w => `<option value="${w.warehouseId}">${w.warehouseName}</option>`).join('');

  // Zones
  const zones = [];
  if (Array.isArray(whs)) {
    for (const w of whs) {
      const z = await api(`/warehouse/${w.warehouseId}/zones`).catch(() => []);
      if (Array.isArray(z)) zones.push(...z.map(x => ({ ...x, whName: w.warehouseName })));
    }
  }
  const zBody = document.getElementById('zone-list-body');
  if (zBody) {
    zBody.innerHTML = zones.length
      ? zones.map(z => `<tr><td>${z.whName}</td><td>${z.zoneCode}</td><td>${z.zoneName}</td><td><span class="badge badge-primary">${z.zoneType}</span></td><td>${z.stageAssignment || '-'}</td><td><span style="display:inline-block;width:14px;height:14px;border-radius:3px;background:${z.colorHex || '#888'}"></span></td></tr>`).join('')
      : '<tr><td colspan="6" class="text-center text-muted">No zones</td></tr>';
  }

  // Populate bin zone dropdown
  const bZone = document.getElementById('bin-zone');
  if (bZone) bZone.innerHTML = zones.map(z => `<option value="${z.zoneId}">${z.zoneCode} - ${z.zoneName}</option>`).join('') || '<option value="">No zones available</option>';

  // Bins
  const bins = [];
  for (const w of (Array.isArray(whs) ? whs : [])) {
    const zs = await api(`/warehouse/${w.warehouseId}/zones`).catch(() => []);
    if (Array.isArray(zs)) {
      for (const z of zs) {
        const rs = await api(`/warehouse/zones/${z.zoneId}/racks`).catch(() => []);
        if (Array.isArray(rs)) {
          for (const r of rs) {
            const ss = await api(`/warehouse/racks/${r.rackId}/shelves`).catch(() => []);
            if (Array.isArray(ss)) {
              for (const s of ss) {
                const bs = await api(`/warehouse/shelves/${s.shelfId}/bins`).catch(() => []);
                if (Array.isArray(bs)) bins.push(...bs.map(b => ({ ...b, zoneCode: z.zoneCode, rackCode: r.rackCode })));
              }
            }
          }
        }
      }
    }
  }
  const binBody = document.getElementById('bin-list-body');
  if (binBody) {
    binBody.innerHTML = bins.length
      ? bins.map(b => `<tr><td>${b.binCode}</td><td>${b.rackCode || '-'}</td><td>${b.zoneCode}</td><td>${b.capacityWeightKg}</td><td>${b.capacityVolumeL}</td><td>${b.mixRule}</td><td><span class="badge ${b.isFrozen ? 'badge-danger' : 'badge-success'}">${b.isFrozen ? 'Frozen' : 'Active'}</span></td></tr>`).join('')
      : '<tr><td colspan="7" class="text-center text-muted">No bins</td></tr>';
  }

  // Items
  loadItems();
  loadVendorsCustomers();

  // Populate project dropdowns
  populateProjectSelects();
}

async function loadItems() {
  const items = await api('/item').catch(() => []);
  const body = document.getElementById('items-list-body');
  if (body) {
    body.innerHTML = Array.isArray(items) && items.length
      ? items.map(i => `<tr><td>${i.skuCode}</td><td>${i.itemName}</td><td>${i.category || '-'}</td><td>${i.uom || 'PCS'}</td><td>${i.hsnCode || '-'}</td><td>₹${i.standardCost || 0}</td><td>${i.minStockQty || 0}</td><td><span class="badge badge-success">Active</span></td></tr>`).join('')
      : '<tr><td colspan="8" class="text-center text-muted">No items</td></tr>';
  }
}

async function loadVendorsCustomers() {
  const vendors = await api('/item/vendors').catch(() => []);
  const vBody = document.getElementById('vendor-list-body');
  if (vBody) {
    vBody.innerHTML = Array.isArray(vendors) && vendors.length
      ? vendors.map(v => `<tr><td>${v.vendorCode}</td><td>${v.vendorName}</td><td>${v.contactPerson || '-'}</td><td>${v.gstNumber || '-'}</td><td>${v.rating || '-'}</td><td><span class="badge ${v.isApproved ? 'badge-success' : 'badge-warning'}">${v.isApproved ? 'Approved' : 'Pending'}</span></td></tr>`).join('')
      : '<tr><td colspan="6" class="text-center text-muted">No vendors</td></tr>';
  }

  const customers = await api('/item/customers').catch(() => []);
  const cBody = document.getElementById('customer-list-body');
  if (cBody) {
    cBody.innerHTML = Array.isArray(customers) && customers.length
      ? customers.map(c => `<tr><td>${c.customerCode}</td><td>${c.customerName}</td><td>${c.projectName || '-'}</td><td>${c.contactPerson || '-'}</td><td>${c.gstNumber || '-'}</td><td><span class="badge badge-success">Active</span></td></tr>`).join('')
      : '<tr><td colspan="6" class="text-center text-muted">No customers</td></tr>';
  }
}

// ===== WAREHOUSE CRUD =====
async function createWarehouse() {
  const payload = {
    warehouseCode: document.getElementById('wh-code').value,
    warehouseName: document.getElementById('wh-name').value,
    timezone: document.getElementById('wh-tz').value,
    totalAreaSqFt: parseFloat(document.getElementById('wh-area').value) || 0,
    isActive: true
  };
  const res = await api('/warehouse', 'POST', payload);
  if (res) { toast('Warehouse created', 'success'); loadWarehouseSetup(); }
}

async function createZone() {
  const payload = {
    zoneCode: document.getElementById('zone-code').value,
    zoneName: document.getElementById('zone-name').value,
    zoneType: document.getElementById('zone-type').value,
    isActive: true
  };
  const whId = document.getElementById('zone-wh').value;
  const res = await api(`/warehouse/${whId}/zones`, 'POST', payload);
  if (res) { toast('Zone created', 'success'); loadWarehouseSetup(); }
}

async function createBin() {
  const payload = {
    binCode: document.getElementById('bin-code').value,
    capacityWeightKg: parseFloat(document.getElementById('bin-weight').value) || 1000,
    capacityVolumeL: parseFloat(document.getElementById('bin-volume').value) || 500,
    mixRule: document.getElementById('bin-mix').value,
    isActive: true
  };
  // Create rack + shelf + bin in one quick seed
  const zoneId = document.getElementById('bin-zone').value;
  if (!zoneId) { toast('Select a zone first', 'warning'); return; }
  const rack = await api(`/warehouse/zones/${zoneId}/racks`, 'POST', { rackCode: 'R-'+payload.binCode, length:2000, width:800, height:3000, orientation:'N', levelCount:1, isActive:true });
  if (!rack) return;
  const shelf = await api(`/warehouse/racks/${rack.rackId}/shelves`, 'POST', { shelfCode: 'S-'+payload.binCode, levelIndex:1, isActive:true });
  if (!shelf) return;
  const bin = await api(`/warehouse/shelves/${shelf.shelfId}/bins`, 'POST', payload);
  if (bin) { toast('Bin created with rack+shelf', 'success'); loadWarehouseSetup(); }
}

async function createItem() {
  const payload = {
    skuCode: document.getElementById('item-sku').value,
    itemName: document.getElementById('item-name').value,
    uomId: document.getElementById('item-uom').value,
    hsnCode: document.getElementById('item-hsn').value,
    standardCost: parseFloat(document.getElementById('item-cost').value) || 0,
    isActive: true
  };
  const res = await api('/item', 'POST', payload);
  if (res) { toast('Item created', 'success'); loadWarehouseSetup(); }
}

// ===== PROJECTS =====
async function loadProjects() {
  const projects = await api('/project').catch(() => []);
  const body = document.getElementById('project-list-body');
  if (body) {
    body.innerHTML = Array.isArray(projects) && projects.length
      ? projects.map(p => `<tr>
        <td>${p.projectCode}</td>
        <td>${p.projectName}</td>
        <td>${p.customer?.customerName || '-'}</td>
        <td>${p.startDate ? new Date(p.startDate).toLocaleDateString() : '-'}</td>
        <td>${p.endDate ? new Date(p.endDate).toLocaleDateString() : '-'}</td>
        <td>${p.completionPct || 0}%</td>
        <td><span class="badge badge-primary">${p.status}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="showModal('modal-bom')">BOM</button></td>
      </tr>`).join('')
      : '<tr><td colspan="8" class="text-center text-muted">No projects</td></tr>';
  }

  // BOM data
  const bomBody = document.getElementById('bom-list-body');
  if (bomBody) {
    let bomRows = [];
    if (Array.isArray(projects)) {
      for (const p of projects) {
        const boms = await api(`/project/${p.projectId}/bom`).catch(() => []);
        if (Array.isArray(boms)) {
          for (const b of boms) {
            for (const l of (b.lines || [])) {
              bomRows.push(`<tr><td>BOM-${b.version || 1}</td><td>${p.projectName}</td><td>v${b.version || 1}</td><td>${l.item?.skuCode || '-'}</td><td><span class="badge badge-accent">Stage ${l.stageCode}</span></td><td>${l.requiredQty}</td><td>${l.allocatedQty || 0}</td><td>${l.pickedQty || 0}</td><td><span class="badge badge-success">Active</span></td></tr>`);
            }
          }
        }
      }
    }
    bomBody.innerHTML = bomRows.length ? bomRows.join('') : '<tr><td colspan="9" class="text-center text-muted">No BOM data</td></tr>';
  }

  populateProjectSelects();
}

async function createProject() {
  const payload = {
    projectCode: document.getElementById('proj-code').value,
    projectName: document.getElementById('proj-name').value,
    customerId: document.getElementById('proj-customer').value,
    warehouseId: document.getElementById('proj-wh').value,
    status: 'Active',
    startDate: new Date().toISOString()
  };
  const res = await api('/project', 'POST', payload);
  if (res) { toast('Project created', 'success'); loadProjects(); }
}

// ===== PROCUREMENT =====
async function loadProcurement() {
  const prs = await api('/purchase/pr').catch(() => []);
  const prBody = document.getElementById('pr-list-body');
  if (prBody) {
    prBody.innerHTML = Array.isArray(prs) && prs.length
      ? prs.map(p => `<tr><td>${p.prNumber}</td><td>Admin</td><td>Warehouse</td><td><span class="badge badge-warning">${p.priority}</span></td><td>${p.requiredByDate ? new Date(p.requiredByDate).toLocaleDateString() : '-'}</td><td><span class="badge badge-primary">${p.status}</span></td><td>L${p.approvalLevel || 0}</td><td><button class="btn btn-secondary btn-sm">View</button></td></tr>`).join('')
      : '<tr><td colspan="8" class="text-center text-muted">No requisitions</td></tr>';
  }

  const pos = await api('/purchase/po').catch(() => []);
  const poBody = document.getElementById('po-list-body');
  if (poBody) {
    poBody.innerHTML = Array.isArray(pos) && pos.length
      ? pos.map(p => `<tr><td>${p.poNumber}</td><td>${p.vendor?.vendorName || '-'}</td><td>${p.warehouse?.warehouseName || '-'}</td><td>${p.poDate ? new Date(p.poDate).toLocaleDateString() : '-'}</td><td>₹${(p.totalAmount || 0).toLocaleString()}</td><td><span class="badge badge-${p.status === 'Confirmed' ? 'success' : 'warning'}">${p.status}</span></td><td><button class="btn btn-primary btn-sm" onclick="receivePO('${p.poId}')">Receive</button></td></tr>`).join('')
      : '<tr><td colspan="7" class="text-center text-muted">No purchase orders</td></tr>';
  }

  populateSelects();
}

function receivePO(poId) {
  closeModal('modal-po');
  document.getElementById('grn-po').value = poId;
  showModal('modal-grn');
}

// ===== RECEIVING =====
async function loadReceiving() {
  const grns = await api('/purchase/grn').catch(() => []);
  const body = document.getElementById('grn-list-body');
  if (body) {
    body.innerHTML = Array.isArray(grns) && grns.length
      ? grns.map(g => `<tr>
        <td>${g.grnNumber}</td>
        <td>${g.po?.poNumber || '-'}</td>
        <td>${g.vendor?.vendorName || '-'}</td>
        <td>${g.invoiceNumber || '-'}</td>
        <td>${g.dockZone?.zoneCode || 'Dock'}</td>
        <td>${g.receivedAt ? new Date(g.receivedAt).toLocaleDateString() : '-'}</td>
        <td><span class="badge badge-${g.status === 'Closed' ? 'success' : 'warning'}">${g.status}</span></td>
        <td>${g.status !== 'Closed' ? `<button class="btn btn-primary btn-sm" onclick="confirmGRN('${g.grnId}')">Putaway</button>` : '✓'}</td>
      </tr>`).join('')
      : '<tr><td colspan="8" class="text-center text-muted">No receipts</td></tr>';
  }

  // Quality inspections
  const inspBody = document.getElementById('inspect-list-body');
  if (inspBody) {
    const insps = await api('/purchase/inspections').catch(() => []);
    inspBody.innerHTML = Array.isArray(insps) && insps.length
      ? insps.map(i => `<tr><td>${i.inspectionNumber}</td><td>${i.grnLine?.grnLineId || '-'}</td><td>${i.item?.itemName || '-'}</td><td>${i.lotNumber || '-'}</td><td>${i.sampleQty}</td><td>${i.passQty}</td><td>${i.failQty}</td><td><span class="badge badge-${i.result === 'Passed' ? 'success' : 'danger'}">${i.result}</span></td><td><button class="btn btn-secondary btn-sm">Details</button></td></tr>`).join('')
      : '<tr><td colspan="9" class="text-center text-muted">No inspections</td></tr>';
  }
}

async function confirmGRN(grnId) {
  const res = await api(`/purchase/grn/${grnId}/confirm`, 'POST');
  if (res) { toast('GRN confirmed, putaway tasks generated', 'success'); loadReceiving(); }
}

// ===== INVENTORY =====
async function loadInventory() {
  // Stock ledger
  const stock = await api('/inventory').catch(() => []);
  const sBody = document.getElementById('stock-ledger-body');
  if (sBody) {
    sBody.innerHTML = Array.isArray(stock) && stock.length
      ? stock.map(s => `<tr>
        <td><strong>${s.item?.skuCode || '-'}</strong></td>
        <td>${s.item?.itemName || '-'}</td>
        <td>${s.warehouse?.warehouseName || '-'}</td>
        <td>${s.bin?.binCode || '-'}</td>
        <td>${s.lotNumber || '-'}</td>
        <td>${s.onHandQty || 0}</td>
        <td>${s.reservedQty || 0}</td>
        <td><strong>${(s.onHandQty || 0) - (s.reservedQty || 0)}</strong></td>
        <td>₹${((s.onHandQty || 0) * (s.item?.standardCost || 0)).toLocaleString()}</td>
      </tr>`).join('')
      : '<tr><td colspan="9" class="text-center text-muted">No stock data</td></tr>';
  }

  // Movements
  const moves = await api('/inventory/movements').catch(() => []);
  const mBody = document.getElementById('movements-body');
  if (mBody) {
    mBody.innerHTML = Array.isArray(moves) && moves.length
      ? moves.map(m => `<tr><td>${m.transactionNumber}</td><td><span class="badge badge-primary">${m.movementType}</span></td><td>${m.item?.skuCode || '-'}</td><td>${m.sourceBin?.binCode || 'Inbound'}</td><td>${m.destinationBin?.binCode || 'Outbound'}</td><td>${m.qty}</td><td>Admin</td><td>${m.performedAt ? new Date(m.performedAt).toLocaleDateString() : '-'}</td></tr>`).join('')
      : '<tr><td colspan="8" class="text-center text-muted">No movements</td></tr>';
  }

  // Cycle counts
  const cycles = await api('/inventory/cyclecounts').catch(() => []);
  const cBody = document.getElementById('cycle-list-body');
  if (cBody) {
    cBody.innerHTML = Array.isArray(cycles) && cycles.length
      ? cycles.map(c => `<tr><td>${c.countSheetNumber}</td><td>${c.countDate ? new Date(c.countDate).toLocaleDateString() : '-'}</td><td>${c.warehouse?.warehouseName || '-'}</td><td>${c.zone?.zoneCode || 'All'}</td><td>${c.countType}</td><td><span class="badge badge-${c.status === 'Completed' ? 'success' : 'warning'}">${c.status}</span></td><td>${c.variancePct || 0}%</td><td><button class="btn btn-secondary btn-sm">Review</button></td></tr>`).join('')
      : '<tr><td colspan="8" class="text-center text-muted">No count sheets</td></tr>';
  }

  // Transfers
  const transfers = await api('/inventory/transfers').catch(() => []);
  const tBody = document.getElementById('transfer-list-body');
  if (tBody) {
    tBody.innerHTML = Array.isArray(transfers) && transfers.length
      ? transfers.map(t => `<tr><td>${t.transferNumber}</td><td>${t.sourceWarehouse?.warehouseName || '-'}</td><td>${t.destWarehouse?.warehouseName || '-'}</td><td>${t.lines?.length || 0} items</td><td><span class="badge badge-${t.status === 'Received' ? 'success' : t.status === 'In Transit' ? 'warning' : 'primary'}">${t.status}</span></td><td>Admin</td><td>${t.transferDate ? new Date(t.transferDate).toLocaleDateString() : '-'}</td></tr>`).join('')
      : '<tr><td colspan="7" class="text-center text-muted">No transfers</td></tr>';
  }
}

function filterStock(val) {
  document.querySelectorAll('#stock-ledger-body tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
  });
}

// ===== PUTAWAY =====
async function loadPutaway() {
  const tasks = await api('/inventory?zoneType=Dock').catch(() => []);
  const body = document.getElementById('putaway-body');
  if (body) {
    body.innerHTML = Array.isArray(tasks) && tasks.length
      ? tasks.map(t => `<tr><td>${t.lastMovementType || 'N/A'}</td><td>${t.item?.itemName || '-'}</td><td>${t.lotNumber || '-'}</td><td>Dock Zone</td><td>Auto-allocated</td><td>${t.onHandQty || 0}</td><td><span class="badge badge-warning">Pending</span></td><td><button class="btn btn-primary btn-sm" onclick="executePutaway('${t.stockId}')">Execute</button></td></tr>`).join('')
      : '<tr><td colspan="8" class="text-center text-muted">No active putaway tasks</td></tr>';
  }
}

async function executePutaway(stockId) {
  const res = await api(`/inventory/${stockId}/putaway`, 'POST');
  if (res) { toast('Putaway executed', 'success'); loadPutaway(); }
}

// ===== PICKING =====
async function loadPicking() {
  const waves = await api('/pick/waves').catch(() => []);
  const body = document.getElementById('wave-list-body');
  if (body) {
    body.innerHTML = Array.isArray(waves) && waves.length
      ? waves.map(w => `<tr>
        <td>${w.waveNumber}</td>
        <td><span class="badge badge-${w.waveType === 'Project' ? 'accent' : 'primary'}">${w.waveType}</span></td>
        <td>${w.project?.projectName || '-'}</td>
        <td>${w.stageCode ? `Stage ${w.stageCode}` : '-'}</td>
        <td>${w.totalLines || 0}</td>
        <td>${w.completedLines || 0}</td>
        <td><span class="badge badge-${w.status === 'Completed' ? 'success' : w.status === 'In Progress' ? 'warning' : 'primary'}">${w.status}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="viewWaveTasks('${w.waveId}')">Tasks</button></td>
      </tr>`).join('')
      : '<tr><td colspan="8" class="text-center text-muted">No waves</td></tr>';
  }
}

async function viewWaveTasks(waveId) {
  const tasks = await api(`/pick/tasks?waveId=${waveId}`).catch(() => []);
  const body = document.getElementById('pick-tasks-body');
  if (body) {
    body.innerHTML = Array.isArray(tasks) && tasks.length
      ? tasks.map(t => `<tr>
        <td>${t.pickTaskId?.slice(0,8) || '-'}</td>
        <td>${t.wave?.waveNumber || '-'}</td>
        <td>${t.item?.skuCode || '-'}</td>
        <td>${t.sourceBin?.binCode || '-'}</td>
        <td>${t.requestedQty}</td>
        <td>${t.pickedQty || 0}</td>
        <td><span class="badge badge-${t.status === 'Completed' ? 'success' : t.status === 'In Progress' ? 'warning' : 'primary'}">${t.status}</span></td>
        <td>${t.status === 'Pending' ? `<button class="btn btn-primary btn-sm" onclick="confirmPick('${t.pickTaskId}',${t.requestedQty})">Pick</button>` : '✓'}</td>
      </tr>`).join('')
      : '<tr><td colspan="8" class="text-center text-muted">No tasks for this wave</td></tr>';
  }
  // Switch to tasks tab
  document.querySelector('#tab-picking .tab-btn[data-sub="pick-tasks"]')?.click();
}

async function confirmPick(taskId, qty) {
  const res = await api(`/pick/tasks/${taskId}/confirm`, 'POST', { pickedQty: qty, lotNumber: 'LOT-2026-A' });
  if (res) { toast('Pick confirmed', 'success'); loadPicking(); }
}

// ===== PACKING =====
async function loadPacking() {
  const pkgs = await api('/pack').catch(() => []);
  const body = document.getElementById('package-list-body');
  if (body) {
    body.innerHTML = Array.isArray(pkgs) && pkgs.length
      ? pkgs.map(p => `<tr>
        <td>${p.packageNumber}</td>
        <td>${p.project?.projectName || '-'}</td>
        <td>${p.stageCode ? `Stage ${p.stageCode}` : '-'}</td>
        <td>${p.weightKg || 0}</td>
        <td>${p.lengthCm || 0}x${p.widthCm || 0}x${p.heightCm || 0}</td>
        <td><span class="badge badge-primary">QR</span></td>
        <td><span class="badge badge-${p.status === 'Sealed' ? 'success' : 'warning'}">${p.status}</span></td>
        <td><button class="btn btn-secondary btn-sm" onclick="sealPackage('${p.packageId}')">${p.status === 'Sealed' ? 'Print Label' : 'Seal'}</button></td>
      </tr>`).join('')
      : '<tr><td colspan="8" class="text-center text-muted">No packages</td></tr>';
  }
}

async function sealPackage(pkgId) {
  const res = await api(`/pack/${pkgId}/seal`, 'POST');
  if (res) { toast('Package sealed', 'success'); loadPacking(); }
}

// ===== DISPATCH =====
async function loadDispatch() {
  const ships = await api('/shipment').catch(() => []);
  const body = document.getElementById('shipment-list-body');
  if (body) {
    body.innerHTML = Array.isArray(ships) && ships.length
      ? ships.map(s => `<tr>
        <td>${s.shipmentNumber}</td>
        <td>${s.customer?.customerName || '-'}</td>
        <td>${s.sourceWarehouse?.warehouseName || '-'}</td>
        <td>${s.transportMode || 'Road'}</td>
        <td>${s.ewayBillNumber || '-'}</td>
        <td>${s.totalPackages || 0}</td>
        <td><span class="badge badge-${s.status === 'Dispatched' ? 'success' : s.status === 'In Transit' ? 'warning' : 'primary'}">${s.status}</span></td>
        <td>${s.status !== 'Dispatched' ? `<button class="btn btn-primary btn-sm" onclick="dispatchShipment('${s.shipmentId}')">Dispatch</button>` : '✓'}</td>
      </tr>`).join('')
      : '<tr><td colspan="8" class="text-center text-muted">No shipments</td></tr>';
  }
}

async function dispatchShipment(id) {
  const res = await api(`/shipment/${id}/dispatch`, 'POST');
  if (res) { toast('Shipment dispatched!', 'success'); loadDispatch(); }
}

// ===== QUALITY =====
async function loadQuality() {
  const insps = await api('/purchase/inspections').catch(() => []);
  const body = document.getElementById('quality-list-body');
  if (body) {
    body.innerHTML = Array.isArray(insps) && insps.length
      ? insps.map(i => `<tr>
        <td>${i.inspectionNumber}</td>
        <td>${i.item?.itemName || '-'}</td>
        <td>${i.lotNumber || '-'}</td>
        <td>${i.inspectionType}</td>
        <td>${i.sampleQty}</td>
        <td>${i.passQty}</td>
        <td>${i.failQty}</td>
        <td><span class="badge badge-${i.result === 'Passed' ? 'success' : i.result === 'Failed' ? 'danger' : 'warning'}">${i.result}</span></td>
        <td>Admin</td>
        <td><button class="btn btn-secondary btn-sm">View</button></td>
      </tr>`).join('')
      : '<tr><td colspan="10" class="text-center text-muted">No inspections</td></tr>';
  }
}

// ===== RETURNS =====
async function loadReturns() {
  const crns = await api('/returns/customer').catch(() => []);
  const crnBody = document.getElementById('crn-list-body');
  if (crnBody) {
    crnBody.innerHTML = Array.isArray(crns) && crns.length
      ? crns.map(c => `<tr><td>${c.crnNumber}</td><td>${c.customer?.customerName || '-'}</td><td>${c.shipment?.shipmentNumber || '-'}</td><td>${c.returnReason}</td><td>${c.lines?.length || 0}</td><td><span class="badge badge-warning">${c.status}</span></td><td><button class="btn btn-secondary btn-sm">Process</button></td></tr>`).join('')
      : '<tr><td colspan="7" class="text-center text-muted">No customer returns</td></tr>';
  }

  const vrns = await api('/returns/vendor').catch(() => []);
  const vrnBody = document.getElementById('vrn-list-body');
  if (vrnBody) {
    vrnBody.innerHTML = Array.isArray(vrns) && vrns.length
      ? vrns.map(v => `<tr><td>${v.vrnNumber}</td><td>${v.vendor?.vendorName || '-'}</td><td>${v.grn?.grnNumber || '-'}</td><td>${v.returnReason}</td><td>${v.lines?.length || 0}</td><td><span class="badge badge-warning">${v.status}</span></td><td><button class="btn btn-secondary btn-sm">Process</button></td></tr>`).join('')
      : '<tr><td colspan="7" class="text-center text-muted">No vendor returns</td></tr>';
  }
}

// ===== LAYOUT =====
function loadLayout() { drawLayout(); }

function drawLayout() {
  if (!ctx) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, h-10); ctx.stroke(); }

  // Title
  ctx.fillStyle = '#e8edf5';
  ctx.font = '13px Inter, sans-serif';
  ctx.fillText('U-Shape Flow Visualizer', 18, 28);

  // Dock Zone
  ctx.fillStyle = 'rgba(14,165,233,0.18)';
  ctx.strokeStyle = '#0ea5e9';
  ctx.lineWidth = 2;
  ctx.fillRect(40, 260, 140, 90);
  ctx.strokeRect(40, 260, 140, 90);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Dock / Receiving', 55, 295);
  ctx.fillStyle = 'rgba(56,189,248,0.6)';
  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('Utilization: 15%', 65, 315);

  // Staging Zone
  ctx.fillStyle = 'rgba(245,158,11,0.18)';
  ctx.strokeStyle = '#f59e0b';
  ctx.fillRect(540, 260, 140, 90);
  ctx.strokeRect(540, 260, 140, 90);
  ctx.fillStyle = '#fbbf24';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('Staging Zone', 565, 295);
  ctx.fillStyle = 'rgba(251,191,36,0.6)';
  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('Crates: 2 active', 575, 315);

  // Quarantine
  ctx.fillStyle = 'rgba(239,68,68,0.12)';
  ctx.strokeStyle = '#ef4444';
  ctx.fillRect(40, 70, 110, 45);
  ctx.strokeRect(40, 70, 110, 45);
  ctx.fillStyle = '#fca5a5';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('Quarantine', 55, 95);

  // Racks - Top row
  const racks = [
    { x:180, y:65, w:160, h:55, label:'Rack A - Storage', color:'#10b981', pct:'Empty' },
    { x:360, y:65, w:160, h:55, label:'Rack B - Occupied', color:'#f59e0b', pct:'65%' },
    { x:540, y:65, w:140, h:55, label:'Rack C - Full', color:'#ef4444', pct:'92%' }
  ];
  racks.forEach(r => {
    ctx.fillStyle = r.color + '22';
    ctx.strokeStyle = r.color;
    ctx.lineWidth = 1.5;
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.strokeRect(r.x, r.y, r.w, r.h);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(r.label, r.x+8, r.y+22);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px Inter, sans-serif';
    ctx.fillText(r.pct, r.x+8, r.y+40);
  });

  // Middle rack - project stage
  ctx.fillStyle = 'rgba(139,92,246,0.18)';
  ctx.strokeStyle = '#8b5cf6';
  ctx.fillRect(180, 148, 320, 55);
  ctx.strokeRect(180, 148, 320, 55);
  ctx.fillStyle = '#c4b5fd';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('Rack D - Project Allocated (Stage Storage)', 195, 178);

  // Conveyor line
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(110, 260);
  ctx.lineTo(110, 220);
  ctx.lineTo(610, 220);
  ctx.lineTo(610, 260);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('→ Flow Path', 580, 248);
}

function setupCanvas() {
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = x * scaleX;
    const cy = y * scaleY;

    const info = document.getElementById('layout-info');
    if (!info) return;

    if (cx >= 40 && cx <= 180 && cy >= 260 && cy <= 350)
      info.innerHTML = '<b>Dock Zone</b><br>Utilization: 15%<br>Capacity: 10,000 Kg<br>Current load: 1,500 Kg';
    else if (cx >= 540 && cx <= 680 && cy >= 260 && cy <= 350)
      info.innerHTML = '<b>Staging Zone</b><br>Status: Outbound ready<br>Crates: 2 active';
    else if (cx >= 180 && cx <= 340 && cy >= 65 && cy <= 120)
      info.innerHTML = '<b>Rack A</b><br>Type: Storage<br>Bins: 8 empty / 2 occupied<br>Safety: Clear';
    else if (cx >= 360 && cx <= 520 && cy >= 65 && cy <= 120)
      info.innerHTML = '<b>Rack B</b><br>Type: ProjectStage Storage<br>SKUs: 3 items<br>Utilization: 65%';
    else if (cx >= 540 && cx <= 680 && cy >= 65 && cy <= 120)
      info.innerHTML = '<b>Rack C</b><br>Type: Quarantine<br>Items: 2 on hold<br>Utilization: 92%';
    else if (cx >= 180 && cx <= 500 && cy >= 148 && cy <= 203)
      info.innerHTML = '<b>Rack D - Project Storage</b><br>Stage allocation: Active<br>Projects: Hilton, Ritz C1<br>Utilization: 42%';
    else if (cx >= 40 && cx <= 150 && cy >= 70 && cy <= 115)
      info.innerHTML = '<b>Quarantine Zone</b><br>Items: 2 on QC Hold<br>Status: Under Review';
    else
      info.innerHTML = '<span class="text-muted">Hover over elements for details</span>';
  });
}

// ===== REPORTS =====
function loadReport(type) {
  const titles = {
    'stock-summary': 'Stock Summary',
    'stock-ledger': 'Stock Movement Log',
    'aging': 'Inventory Aging Report',
    'abc-analysis': 'ABC Analysis',
    'vendor-perf': 'Vendor Performance',
    'pick-efficiency': 'Pick Efficiency',
    'project-consumption': 'Project Consumption Report',
    'audit-trail': 'System Audit Trail'
  };
  document.getElementById('report-title').textContent = titles[type] || 'Report';

  const data = {
    'stock-summary': { h: ['SKU Code','Item Name','On Hand','Reserved','Available','Valuation'], d: [] },
    'stock-ledger': { h: ['Txn #','Type','Item','From','To','Qty','Date'], d: [] },
    'aging': { h: ['SKU','Lot','Received','Age (Days)','Qty','Value','ABC Class'], d: [] },
    'abc-analysis': { h: ['SKU','Annual Value','% Total','Class'], d: [] },
    'vendor-perf': { h: ['Vendor','On-Time %','Rejection Rate','Avg Delay','Rating'], d: [] },
    'pick-efficiency': { h: ['Operator','Tasks','Avg Time','Short %','Accuracy'], d: [] },
    'project-consumption': { h: ['Project','Item','Required','Picked','Packed','Variance'], d: [] },
    'audit-trail': { h: ['Event','Document','User','Timestamp','Details'], d: [] }
  };

  const r = data[type] || { h: ['No Data'], d: [] };
  const thead = document.getElementById('report-thead');
  const tbody = document.getElementById('report-tbody');
  if (thead) thead.innerHTML = '<tr>' + r.h.map(h => `<th>${h}</th>`).join('') + '</tr>';
  if (tbody) {
    tbody.innerHTML = r.d.length
      ? r.d.map(row => '<tr>' + row.map(c => `<td>${c}</td>`).join('') + '</tr>').join('')
      : `<tr><td colspan="${r.h.length}" class="text-center text-muted">Connect and seed data, then refresh</td></tr>`;
  }
}

// ===== CREATE ACTIONS =====
async function createPR() {
  const payload = {
    itemId: document.getElementById('pr-item').value,
    requiredQty: parseFloat(document.getElementById('pr-qty').value),
    priority: document.getElementById('pr-priority').value,
    requiredByDate: document.getElementById('pr-date').value,
    justification: document.getElementById('pr-just').value
  };
  const res = await api('/purchase/pr', 'POST', payload);
  if (res) { toast('PR created', 'success'); closeModal('modal-pr'); loadProcurement(); }
}

async function createPO() {
  const payload = {
    vendorId: document.getElementById('po-vendor').value,
    warehouseId: document.getElementById('po-wh').value,
    lines: [{ itemId: document.getElementById('po-item').value, orderedQty: parseFloat(document.getElementById('po-qty').value), unitPrice: parseFloat(document.getElementById('po-price').value), discountPct: 0, taxPct: 18 }]
  };
  const res = await api('/purchase/po', 'POST', payload);
  if (res) { toast('PO created', 'success'); closeModal('modal-po'); loadProcurement(); }
}

async function createGRN() {
  const payload = {
    poId: document.getElementById('grn-po').value,
    receiptType: 'PO',
    invoiceNumber: document.getElementById('grn-invoice').value,
    vehicleNumber: document.getElementById('grn-vehicle').value,
    lines: [{ receivedQty: parseFloat(document.getElementById('grn-qty').value), lotNumber: document.getElementById('grn-lot').value }]
  };
  const res = await api('/purchase/grn', 'POST', payload);
  if (res) { toast('GRN logged', 'success'); closeModal('modal-grn'); loadReceiving(); }
}

async function createWave() {
  const payload = {
    waveType: document.getElementById('wave-type').value,
    projectId: document.getElementById('wave-project').value,
    stageCode: document.getElementById('wave-stage').value
  };
  const res = await api('/pick/waves', 'POST', payload);
  if (res) { toast('Wave released', 'success'); closeModal('modal-wave'); loadPicking(); }
}

async function createPackage() {
  const payload = {
    projectId: document.getElementById('pkg-project').value,
    stageCode: document.getElementById('pkg-stage').value,
    lines: [{ itemId: document.getElementById('pkg-item').value, packedQty: parseFloat(document.getElementById('pkg-qty').value) }],
    weightKg: parseFloat(document.getElementById('pkg-weight').value),
    lengthCm: parseFloat(document.getElementById('pkg-length').value)
  };
  const res = await api('/pack', 'POST', payload);
  if (res) { toast('Package created', 'success'); closeModal('modal-package'); loadPacking(); }
}

async function createShipment() {
  const payload = {
    customerId: document.getElementById('ship-customer').value,
    packageIds: [document.getElementById('ship-package').value],
    sourceWarehouseId: document.getElementById('ship-wh').value,
    deliveryAddress: document.getElementById('ship-address').value,
    transportMode: document.getElementById('ship-mode').value,
    ewayBillNumber: document.getElementById('ship-eway').value,
    shipmentDate: new Date().toISOString()
  };
  const res = await api('/shipment', 'POST', payload);
  if (res) { toast('Shipment registered', 'success'); closeModal('modal-shipment'); loadDispatch(); }
}

async function createVendor() {
  const payload = {
    vendorCode: document.getElementById('v-code').value,
    vendorName: document.getElementById('v-name').value,
    contactPerson: document.getElementById('v-contact').value,
    mobile: document.getElementById('v-mobile').value,
    email: document.getElementById('v-email').value,
    gstNumber: document.getElementById('v-gst').value,
    isActive: true
  };
  const res = await api('/item/vendors', 'POST', payload);
  if (res) { toast('Vendor added', 'success'); closeModal('modal-vendor'); loadWarehouseSetup(); }
}

async function createCustomer() {
  const payload = {
    customerCode: document.getElementById('c-code').value,
    customerName: document.getElementById('c-name').value,
    contactPerson: document.getElementById('c-contact').value,
    mobile: document.getElementById('c-mobile').value,
    gstNumber: document.getElementById('c-gst').value,
    siteAddress: document.getElementById('c-address').value,
    isActive: true
  };
  const res = await api('/item/customers', 'POST', payload);
  if (res) { toast('Customer added', 'success'); closeModal('modal-customer'); loadWarehouseSetup(); }
}

async function adjustStock() {
  const payload = {
    itemId: document.getElementById('adj-item').value,
    binId: document.getElementById('adj-bin').value,
    adjustmentQty: parseFloat(document.getElementById('adj-qty').value),
    reason: document.getElementById('adj-reason').value
  };
  const res = await api('/inventory/adjust', 'POST', payload);
  if (res) { toast('Stock adjusted', 'success'); closeModal('modal-adjust'); loadInventory(); }
}

async function moveStock() {
  const payload = {
    itemId: document.getElementById('move-item').value,
    sourceBinId: document.getElementById('move-source').value,
    destinationBinId: document.getElementById('move-dest').value,
    qty: parseFloat(document.getElementById('move-qty').value)
  };
  const res = await api('/inventory/move', 'POST', payload);
  if (res) { toast('Stock moved', 'success'); closeModal('modal-move'); loadInventory(); }
}

async function createCycleCount() {
  const payload = {
    warehouseId: document.getElementById('cycle-wh').value,
    countType: document.getElementById('cycle-type').value,
    zoneId: document.getElementById('cycle-zone').value || null,
    countDate: new Date().toISOString()
  };
  const res = await api('/inventory/cyclecounts', 'POST', payload);
  if (res) { toast('Cycle count started', 'success'); closeModal('modal-cycle'); loadInventory(); }
}

async function createTransfer() {
  const payload = {
    sourceWarehouseId: document.getElementById('tr-from').value,
    destWarehouseId: document.getElementById('tr-to').value,
    lines: [{ itemId: document.getElementById('tr-item').value, requestedQty: parseFloat(document.getElementById('tr-qty').value) }]
  };
  const res = await api('/inventory/transfers', 'POST', payload);
  if (res) { toast('Transfer created', 'success'); closeModal('modal-transfer'); loadInventory(); }
}

async function importBOM() {
  const fileInput = document.getElementById('bom-file');
  const projectId = document.getElementById('bom-project').value;
  if (!fileInput.files[0]) { toast('Select a CSV file', 'warning'); return; }
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  try {
    const res = await fetch(`${API}/project/${projectId}/bom/import`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
    });
    if (res.ok) { toast('BOM imported', 'success'); closeModal('modal-bom'); loadProjects(); }
    else toast('Import failed', 'error');
  } catch { toast('Network error', 'error'); }
}

async function createInspection() {
  const payload = {
    grnLineId: document.getElementById('ins-grn').value,
    inspectionType: document.getElementById('ins-type').value,
    sampleQty: parseFloat(document.getElementById('ins-sample').value),
    passQty: parseFloat(document.getElementById('ins-pass').value),
    failQty: parseFloat(document.getElementById('ins-fail').value),
    inspectionNotes: document.getElementById('ins-notes').value
  };
  const res = await api('/purchase/inspections', 'POST', payload);
  if (res) { toast('Inspection recorded', 'success'); closeModal('modal-inspect'); loadQuality(); }
}

async function createCRN() {
  const payload = {
    customerId: document.getElementById('crn-customer').value,
    lines: [{ itemId: document.getElementById('crn-item').value, returnedQty: parseFloat(document.getElementById('crn-qty').value) }],
    returnReason: document.getElementById('crn-reason').value
  };
  const res = await api('/returns/customer', 'POST', payload);
  if (res) { toast('CRN created', 'success'); closeModal('modal-crn'); loadReturns(); }
}

async function createVRN() {
  const payload = {
    vendorId: document.getElementById('vrn-vendor').value,
    lines: [{ itemId: document.getElementById('vrn-item').value, returnQty: parseFloat(document.getElementById('vrn-qty').value) }],
    returnReason: document.getElementById('vrn-reason').value
  };
  const res = await api('/returns/vendor', 'POST', payload);
  if (res) { toast('VRN created', 'success'); closeModal('modal-vrn'); loadReturns(); }
}

// ===== POPULATE SELECTORS =====
async function populateSelects() {
  const [vendors, whs, items, projects, customers] = await Promise.all([
    api('/item/vendors').catch(() => []),
    api('/warehouse').catch(() => []),
    api('/item').catch(() => []),
    api('/project').catch(() => []),
    api('/item/customers').catch(() => [])
  ]);

  const vArr = Array.isArray(vendors) ? vendors : [];
  const wArr = Array.isArray(whs) ? whs : [];
  const iArr = Array.isArray(items) ? items : [];
  const pArr = Array.isArray(projects) ? projects : [];
  const cArr = Array.isArray(customers) ? customers : [];

  setOptions('po-vendor', vArr, 'vendorId', 'vendorName');
  setOptions('po-wh', wArr, 'warehouseId', 'warehouseName');
  setOptions('po-item', iArr, 'itemId', 'skuCode');
  setOptions('pr-item', iArr, 'itemId', 'skuCode');
  setOptions('grn-po', pArr, 'projectId', 'projectCode');
  setOptions('wave-project', pArr, 'projectId', 'projectName');
  setOptions('pkg-project', pArr, 'projectId', 'projectName');
  setOptions('pkg-item', iArr, 'itemId', 'skuCode');
  setOptions('ship-customer', cArr, 'customerId', 'customerName');
  setOptions('ship-wh', wArr, 'warehouseId', 'warehouseName');
  setOptions('adj-item', iArr, 'itemId', 'skuCode');
  setOptions('adj-bin', [], 'binId', 'binCode');
  setOptions('move-item', iArr, 'itemId', 'skuCode');
  setOptions('cycle-wh', wArr, 'warehouseId', 'warehouseName');
  setOptions('tr-from', wArr, 'warehouseId', 'warehouseName');
  setOptions('tr-to', wArr, 'warehouseId', 'warehouseName');
  setOptions('tr-item', iArr, 'itemId', 'skuCode');
  setOptions('bom-project', pArr, 'projectId', 'projectName');
  setOptions('ins-grn', [], 'grnLineId', 'grnNumber');
  setOptions('crn-customer', cArr, 'customerId', 'customerName');
  setOptions('crn-item', iArr, 'itemId', 'skuCode');
  setOptions('vrn-vendor', vArr, 'vendorId', 'vendorName');
  setOptions('vrn-item', iArr, 'itemId', 'skuCode');
  setOptions('proj-customer', cArr, 'customerId', 'customerName');
  setOptions('proj-wh', wArr, 'warehouseId', 'warehouseName');

  // Package item
  setOptions('pkg-item', iArr, 'itemId', 'skuCode');
  // Package select
  api('/pack').catch(() => []).then(pkgs => {
    const pkgArr = Array.isArray(pkgs) ? pkgs : [];
    setOptions('ship-package', pkgArr, 'packageId', 'packageNumber');
  });
}

function populateProjectSelects() {
  api('/item/customers').catch(() => []).then(custs => {
    const arr = Array.isArray(custs) ? custs : [];
    setOptions('proj-customer', arr, 'customerId', 'customerName');
  });
  api('/warehouse').catch(() => []).then(whs => {
    const arr = Array.isArray(whs) ? whs : [];
    setOptions('proj-wh', arr, 'warehouseId', 'warehouseName');
    setOptions('cycle-zone', [], 'zoneId', 'zoneCode');
  });
}

function setOptions(id, arr, valKey, labelKey) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = arr.length
    ? arr.map(item => `<option value="${item[valKey]}">${item[labelKey] || item[valKey]}</option>`).join('')
    : '<option value="">No data available</option>';
}

// ===== MODAL HELPERS =====
function showModal(id) {
  populateSelects();
  document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// ===== NOTIFICATIONS =====
function toggleNotifications() {
  document.getElementById('notif-dropdown')?.classList.toggle('show');
}

document.addEventListener('click', e => {
  const dd = document.getElementById('notif-dropdown');
  if (dd && !e.target.closest('.notification-bell') && !e.target.closest('.notification-dropdown')) {
    dd.classList.remove('show');
  }
});

// ===== TOAST =====
function toast(msg, type = 'primary') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + (type || '');
  t.style.display = 'block';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.style.display = 'none', 3500);
}

// ===== GLOBAL SEARCH =====
async function searchGlobal(query) {
  if (!query.trim()) return;
  const results = await api(`/item?search=${encodeURIComponent(query)}`).catch(() => []);
  if (Array.isArray(results) && results.length) {
    toast(`Found ${results.length} result(s) for "${query}"`, 'success');
  } else {
    toast(`No results for "${query}"`, 'warning');
  }
}

// ===== SEED DEMO DATA =====
async function seedDemoData() {
  const whs = await api('/warehouse').catch(() => []);
  if (Array.isArray(whs) && whs.length > 0) { loadTab(currentTab); return; }

  toast('Seeding demo data...', 'primary');

  // Create warehouse
  const wh = await api('/warehouse', 'POST', {
    warehouseCode: 'WH-MUM-01', warehouseName: 'Mumbai Central Warehouse', timezone: 'Asia/Kolkata',
    totalAreaSqFt: 25000, address: 'Kurla Industrial Estate, Mumbai', isActive: true
  });
  if (!wh) return;

  // Create zones
  const types = [
    { code: 'Z-STORAGE', name: 'Bulk Storage', type: 'Storage', color: '#10b981' },
    { code: 'Z-DOCK', name: 'Receiving Dock', type: 'Dock', color: '#0ea5e9' },
    { code: 'Z-STAGING', name: 'Outbound Staging', type: 'Staging', color: '#f59e0b' },
    { code: 'Z-QUAR', name: 'Quarantine Area', type: 'Quarantine', color: '#ef4444' }
  ];
  const zones = {};
  for (const t of types) {
    zones[t.code] = await api(`/warehouse/${wh.warehouseId}/zones`, 'POST', {
      zoneCode: t.code, zoneName: t.name, zoneType: t.type, colorHex: t.color, positionX: 10, positionY: 10, isActive: true
    });
  }

  // Create bins
  const storageRack = await api(`/warehouse/zones/${zones['Z-STORAGE']?.zoneId}/racks`, 'POST', {
    rackCode: 'R-STORAGE-A', length: 2000, width: 800, height: 3000, orientation: 'N', levelCount: 3, isActive: true
  });
  if (storageRack) {
    const shelf = await api(`/warehouse/racks/${storageRack.rackId}/shelves`, 'POST', { shelfCode: 'S-STORAGE-A1', levelIndex: 1, isActive: true });
    if (shelf) {
      await api(`/warehouse/shelves/${shelf.shelfId}/bins`, 'POST', { binCode: 'WH1-Z-L-R001-S01-B01', capacityWeightKg: 2000, capacityVolumeL: 1000, mixRule: 'Multi', isActive: true });
    }
  }

  // Create dock bin
  const dockRack = await api(`/warehouse/zones/${zones['Z-DOCK']?.zoneId}/racks`, 'POST', {
    rackCode: 'R-DOCK-1', length: 1000, width: 1000, height: 1000, orientation: 'S', levelCount: 1, isActive: true
  });
  if (dockRack) {
    const ds = await api(`/warehouse/racks/${dockRack.rackId}/shelves`, 'POST', { shelfCode: 'S-DOCK-1', levelIndex: 1, isActive: true });
    if (ds) await api(`/warehouse/shelves/${ds.shelfId}/bins`, 'POST', { binCode: 'WH1-DOCK-B01', capacityWeightKg: 10000, capacityVolumeL: 5000, mixRule: 'Multi', isActive: true });
  }

  // Create staging bin
  const stRack = await api(`/warehouse/zones/${zones['Z-STAGING']?.zoneId}/racks`, 'POST', {
    rackCode: 'R-STAGING-1', length: 1000, width: 1000, height: 1000, orientation: 'E', levelCount: 1, isActive: true
  });
  if (stRack) {
    const ss = await api(`/warehouse/racks/${stRack.rackId}/shelves`, 'POST', { shelfCode: 'S-STAGING-1', levelIndex: 1, isActive: true });
    if (ss) await api(`/warehouse/shelves/${ss.shelfId}/bins`, 'POST', { binCode: 'WH1-STAGING-B01', capacityWeightKg: 10000, capacityVolumeL: 5000, mixRule: 'Multi', isActive: true });
  }

  // Create UOMs
  await api('/item/uoms', 'POST', { uomCode: 'PCS', description: 'Pieces', isActive: true });
  await api('/item/uoms', 'POST', { uomCode: 'MTR', description: 'Meters', isActive: true });

  // Create Items
  const items = [
    { skuCode: 'SKU-ELV-RAIL-01', itemName: 'T-Guide Rail 5m', hsnCode: '84313100', standardCost: 4500, weightKg: 45 },
    { skuCode: 'SKU-ELV-MOTOR-02', itemName: 'Traction Motor 10kW', hsnCode: '85015290', standardCost: 125000, weightKg: 350 },
    { skuCode: 'SKU-ELV-CABIN-03', itemName: 'Cabin Assembly Frame', hsnCode: '84313100', standardCost: 85000, weightKg: 200 },
    { skuCode: 'SKU-ELV-DOOR-04', itemName: 'Automatic Door Operator', hsnCode: '84313100', standardCost: 22000, weightKg: 35 },
    { skuCode: 'SKU-ELV-CABLE-05', itemName: 'Traveling Cable 30m', hsnCode: '85444920', standardCost: 8500, weightKg: 18 }
  ];
  for (const item of items) await api('/item', 'POST', { ...item, uomId: 'PCS', isActive: true });

  // Create Vendor
  const vendor = await api('/item/vendors', 'POST', {
    vendorCode: 'VND-ELV-01', vendorName: 'Elevator Spares India Ltd', contactPerson: 'Rajesh Sharma',
    email: 'sales@elvspares.in', mobile: '9876543210', isApproved: true, isActive: true
  });

  // Create Customer
  const customer = await api('/item/customers', 'POST', {
    customerCode: 'CST-ELV-01', customerName: 'Hilton Hotels Mumbai', projectName: 'Hilton Grand Elevators Upgrade',
    siteAddress: 'Sahar Airport Road, Mumbai', isActive: true
  });

  // Create Project
  const project = await api('/project', 'POST', {
    projectCode: 'PRJ-HILTON-01', projectName: 'Hilton Grand Elevator Upgrade',
    customerId: customer?.customerId, warehouseId: wh.warehouseId, status: 'Active', startDate: new Date().toISOString()
  });

  // Create PO
  if (vendor && project) {
    const po = await api('/purchase/po', 'POST', {
      vendorId: vendor.vendorId, warehouseId: wh.warehouseId,
      lines: [{ itemId: items[0].skuCode, orderedQty: 20, unitPrice: 4500, discountPct: 0, taxPct: 18 }]
    });
    if (po) {
      // Create GRN
      await api('/purchase/grn', 'POST', {
        poId: po.poId, receiptType: 'PO', invoiceNumber: 'INV-001', vehicleNumber: 'MH-12-AB-9988',
        lines: [{ itemId: items[0].skuCode, receivedQty: 20, lotNumber: 'LOT-2026-A' }]
      });
    }
  }

  toast('Demo data seeded successfully!', 'success');
  loadTab(currentTab);
}

// Initialize on modal close clicks
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => {
    if (e.target === el) el.style.display = 'none';
  });
});

// Load initial data
loadTab('dashboard');
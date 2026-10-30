export type CustomerStatus = 'Aktif' | 'Prospek' | 'Pasif';

export type DealStage =
  | 'Prospek Baru'
  | 'Kualifikasi'
  | 'Proposal'
  | 'Negosiasi'
  | 'Menang'
  | 'Batal';

export const DEAL_STAGES: DealStage[] = [
  'Prospek Baru',
  'Kualifikasi',
  'Proposal',
  'Negosiasi',
  'Menang',
  'Batal',
];

export const ACTIVE_PIPELINE_STAGES: DealStage[] = [
  'Prospek Baru',
  'Kualifikasi',
  'Proposal',
  'Negosiasi',
];

export const STAGE_PROBABILITY: Record<DealStage, number> = {
  'Prospek Baru': 0.15,
  'Kualifikasi': 0.35,
  'Proposal': 0.6,
  'Negosiasi': 0.8,
  'Menang': 1.0,
  'Batal': 0.0,
};

export interface Customer {
  id: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  location: string;
  lastContactDate: string; // YYYY-MM-DD
  owner: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  customerId: string;
  company: string;
  contactName: string;
  value: number; // IDR
  stage: DealStage;
  expectedCloseDate: string; // YYYY-MM-DD
  owner: string;
  updatedAt: string;
}

export type ActivityType = 'Telepon' | 'Email' | 'Rapat' | 'Catatan';

export interface ActivityLog {
  id: string;
  customerId: string;
  customerName: string;
  company: string;
  type: ActivityType;
  summary: string;
  createdAt: string; // YYYY-MM-DD HH:mm
  author: string;
}

export interface FollowUpTask {
  id: string;
  customerId: string;
  customerName: string;
  company: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  priority: 'Tinggi' | 'Normal' | 'Rendah';
  completed: boolean;
  assignee: string;
}

export interface StageBreakdownItem {
  stage: DealStage;
  count: number;
  totalValue: number;
  weightedValue: number;
  percentageOfPipeline: number;
}

export interface CrmMetrics {
  totalPipelineValue: number;
  weightedPipelineValue: number;
  wonValue: number;
  wonCount: number;
  lostCount: number;
  activeDealsCount: number;
  winRatePercent: number;
  activeCustomersCount: number;
  totalCustomersCount: number;
  pendingTasksCount: number;
  completedTasksCount: number;
  stageBreakdown: StageBreakdownItem[];
}

export function formatIDR(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return 'Rp ' + safe.toLocaleString('id-ID');
}

export function formatCompactIDR(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  if (safe >= 1_000_000_000) {
    return `Rp ${(safe / 1_000_000_000).toFixed(2).replace('.', ',')} M`;
  }
  if (safe >= 1_000_000) {
    return `Rp ${(safe / 1_000_000).toFixed(1).replace(',0', '').replace('.', ',')} Jt`;
  }
  return formatIDR(safe);
}

export interface CustomerFormInput {
  name: string;
  role: string;
  company: string;
  industry: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  location: string;
  initialDealTitle?: string;
  initialDealValue?: string;
}

export function validateCustomerInput(input: CustomerFormInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Nama lengkap kontak wajib diisi (minimal 2 karakter).';
  }
  if (!input.company || input.company.trim().length < 2) {
    errors.company = 'Nama perusahaan wajib diisi.';
  }
  const emailTrimmed = (input.email || '').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailTrimmed) {
    errors.email = 'Alamat email bisnis wajib diisi.';
  } else if (!emailRegex.test(emailTrimmed)) {
    errors.email = 'Format alamat email tidak valid.';
  }
  if (!input.phone || input.phone.trim().length < 6) {
    errors.phone = 'Nomor telepon wajib diisi.';
  }
  if (input.initialDealValue && input.initialDealValue.trim() !== '') {
    const parsed = Number(input.initialDealValue);
    if (!Number.isFinite(parsed) || parsed < 0) {
      errors.initialDealValue = 'Nilai potensi deal harus berupa angka positif.';
    }
  }
  return errors;
}

export interface DealFormInput {
  title: string;
  customerId: string;
  value: string;
  stage: DealStage;
  expectedCloseDate: string;
}

export function validateDealInput(input: DealFormInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.title || input.title.trim().length < 3) {
    errors.title = 'Nama peluang / deal wajib diisi (minimal 3 karakter).';
  }
  if (!input.customerId || input.customerId.trim() === '') {
    errors.customerId = 'Pilih pelanggan terkait untuk deal ini.';
  }
  const parsedValue = Number(input.value);
  if (!input.value || input.value.trim() === '' || !Number.isFinite(parsedValue) || parsedValue <= 0) {
    errors.value = 'Nilai kontrak harus lebih besar dari Rp 0.';
  }
  if (!input.expectedCloseDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.expectedCloseDate)) {
    errors.expectedCloseDate = 'Tanggal target penutupan wajib diisi.';
  }
  return errors;
}

export interface TaskFormInput {
  title: string;
  customerId: string;
  dueDate: string;
  priority: 'Tinggi' | 'Normal' | 'Rendah';
}

export function validateTaskInput(input: TaskFormInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.title || input.title.trim().length < 3) {
    errors.title = 'Deskripsi tindak lanjut wajib diisi.';
  }
  if (!input.customerId || input.customerId.trim() === '') {
    errors.customerId = 'Pilih pelanggan terkait.';
  }
  if (!input.dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) {
    errors.dueDate = 'Tanggal jatuh tempo wajib diisi.';
  }
  return errors;
}

export function calculateCrmMetrics(
  customers: Customer[],
  deals: Deal[],
  tasks: FollowUpTask[]
): CrmMetrics {
  let totalPipelineValue = 0;
  let weightedPipelineValue = 0;
  let wonValue = 0;
  let wonCount = 0;
  let lostCount = 0;
  let activeDealsCount = 0;

  for (const deal of deals) {
    const prob = STAGE_PROBABILITY[deal.stage] ?? 0;
    if (deal.stage === 'Menang') {
      wonValue += deal.value;
      wonCount += 1;
    } else if (deal.stage === 'Batal') {
      lostCount += 1;
    } else {
      totalPipelineValue += deal.value;
      weightedPipelineValue += Math.round(deal.value * prob);
      activeDealsCount += 1;
    }
  }

  const closedTotal = wonCount + lostCount;
  const winRatePercent = closedTotal > 0 ? Math.round((wonCount / closedTotal) * 100) : 0;

  const activeCustomersCount = customers.filter((c) => c.status === 'Aktif').length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const totalAllDealsValue = totalPipelineValue + wonValue;

  const stageBreakdown: StageBreakdownItem[] = DEAL_STAGES.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage);
    const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
    const weightedValue = Math.round(totalValue * (STAGE_PROBABILITY[stage] ?? 0));
    const percentageOfPipeline =
      totalAllDealsValue > 0 ? Math.round((totalValue / totalAllDealsValue) * 100) : 0;
    return {
      stage,
      count: stageDeals.length,
      totalValue,
      weightedValue,
      percentageOfPipeline,
    };
  });

  return {
    totalPipelineValue,
    weightedPipelineValue,
    wonValue,
    wonCount,
    lostCount,
    activeDealsCount,
    winRatePercent,
    activeCustomersCount,
    totalCustomersCount: customers.length,
    pendingTasksCount,
    completedTasksCount,
    stageBreakdown,
  };
}

export function filterCustomers(
  customers: Customer[],
  deals: Deal[],
  query: string,
  statusFilter: 'Semua' | CustomerStatus,
  sortBy: 'name' | 'value' | 'recent'
): Array<Customer & { totalDealValue: number; dealCount: number }> {
  const normalizedQuery = query.trim().toLowerCase();

  const enriched = customers.map((customer) => {
    const customerDeals = deals.filter(
      (d) => d.customerId === customer.id && d.stage !== 'Batal'
    );
    const totalDealValue = customerDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      ...customer,
      totalDealValue,
      dealCount: customerDeals.length,
    };
  });

  const filtered = enriched.filter((c) => {
    if (statusFilter !== 'Semua' && c.status !== statusFilter) {
      return false;
    }
    if (!normalizedQuery) return true;
    return (
      c.name.toLowerCase().includes(normalizedQuery) ||
      c.company.toLowerCase().includes(normalizedQuery) ||
      c.email.toLowerCase().includes(normalizedQuery) ||
      c.industry.toLowerCase().includes(normalizedQuery) ||
      c.location.toLowerCase().includes(normalizedQuery)
    );
  });

  return filtered.sort((a, b) => {
    if (sortBy === 'value') {
      return b.totalDealValue - a.totalDealValue;
    }
    if (sortBy === 'recent') {
      return b.lastContactDate.localeCompare(a.lastContactDate);
    }
    return a.name.localeCompare(b.name, 'id');
  });
}

export function filterDeals(
  deals: Deal[],
  query: string,
  stageFilter: 'Semua' | DealStage
): Deal[] {
  const normalizedQuery = query.trim().toLowerCase();
  return deals
    .filter((d) => {
      if (stageFilter !== 'Semua' && d.stage !== stageFilter) {
        return false;
      }
      if (!normalizedQuery) return true;
      return (
        d.title.toLowerCase().includes(normalizedQuery) ||
        d.company.toLowerCase().includes(normalizedQuery) ||
        d.contactName.toLowerCase().includes(normalizedQuery)
      );
    })
    .sort((a, b) => b.value - a.value);
}

const ORDERED_PROGRESSION: DealStage[] = [
  'Prospek Baru',
  'Kualifikasi',
  'Proposal',
  'Negosiasi',
  'Menang',
];

export function getNextDealStage(stage: DealStage): DealStage | null {
  const idx = ORDERED_PROGRESSION.indexOf(stage);
  if (idx === -1 || idx >= ORDERED_PROGRESSION.length - 1) return null;
  return ORDERED_PROGRESSION[idx + 1];
}

export function getPrevDealStage(stage: DealStage): DealStage | null {
  if (stage === 'Batal') return 'Negosiasi';
  const idx = ORDERED_PROGRESSION.indexOf(stage);
  if (idx <= 0) return null;
  return ORDERED_PROGRESSION[idx - 1];
}

export function exportCustomersToCsv(
  customers: Array<Customer & { totalDealValue: number; dealCount: number }>
): string {
  const headers = [
    'ID',
    'Nama Kontak',
    'Jabatan',
    'Perusahaan',
    'Industri',
    'Status',
    'Email',
    'Telepon',
    'Lokasi',
    'Jumlah Deal',
    'Total Nilai Deal (IDR)',
    'Kontak Terakhir',
  ];
  const escapeCsv = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const rows = customers.map((c) =>
    [
      c.id,
      c.name,
      c.role,
      c.company,
      c.industry,
      c.status,
      c.email,
      c.phone,
      c.location,
      c.dealCount,
      c.totalDealValue,
      c.lastContactDate,
    ]
      .map(escapeCsv)
      .join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-101',
    name: 'Nadia Pramesti',
    role: 'VP of Operations',
    company: 'PT Samudera Kargo Nusantara',
    industry: 'Logistik & Maritim',
    email: 'nadia.pramesti@samuderakargo.co.id',
    phone: '+62 811-9420-381',
    status: 'Aktif',
    location: 'Jakarta Utara',
    lastContactDate: '2026-10-29',
    owner: 'Raka Wijaya',
    createdAt: '2026-08-14',
  },
  {
    id: 'cust-102',
    name: 'Hendra Gunawan',
    role: 'Head of Procurement',
    company: 'PT Sentosa Agro Makmur',
    industry: 'Agribisnis & Pangan',
    email: 'hendra.g@sentosaagro.id',
    phone: '+62 812-3081-994',
    status: 'Aktif',
    location: 'Surabaya',
    lastContactDate: '2026-10-28',
    owner: 'Sinta Maharani',
    createdAt: '2026-09-02',
  },
  {
    id: 'cust-103',
    name: 'Larasati Kusuma',
    role: 'Chief Technology Officer',
    company: 'ArthaPay Digital Indonesia',
    industry: 'Teknologi Finansial',
    email: 'larasati@arthapay.id',
    phone: '+62 813-8821-409',
    status: 'Prospek',
    location: 'Jakarta Selatan',
    lastContactDate: '2026-10-27',
    owner: 'Raka Wijaya',
    createdAt: '2026-09-19',
  },
  {
    id: 'cust-104',
    name: 'Dimas Wahyudi',
    role: 'Plant Director',
    company: 'PT Krakatau Presisi Komponen',
    industry: 'Manufaktur Industri',
    email: 'dimas.wahyudi@krakataupresisi.co.id',
    phone: '+62 815-7704-112',
    status: 'Aktif',
    location: 'Cilegon',
    lastContactDate: '2026-10-25',
    owner: 'Sinta Maharani',
    createdAt: '2026-07-22',
  },
  {
    id: 'cust-105',
    name: 'Clarissa Tanojo',
    role: 'Supply Chain Manager',
    company: 'Prima Medika Farma',
    industry: 'Farmasi & Kesehatan',
    email: 'clarissa.t@primamedika.co.id',
    phone: '+62 818-2409-550',
    status: 'Prospek',
    location: 'Bandung',
    lastContactDate: '2026-10-24',
    owner: 'Raka Wijaya',
    createdAt: '2026-10-05',
  },
  {
    id: 'cust-106',
    name: 'Bambang Suryono',
    role: 'General Manager',
    company: 'CV Mega Tekstil Abadi',
    industry: 'Tekstil & Garmen',
    email: 'bambang@megatekstil.id',
    phone: '+62 817-6120-733',
    status: 'Pasif',
    location: 'Semarang',
    lastContactDate: '2026-09-18',
    owner: 'Sinta Maharani',
    createdAt: '2026-06-11',
  },
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-201',
    title: 'Lisensi Armada Telemetry & ERP Gudang (3 Tahun)',
    customerId: 'cust-101',
    company: 'PT Samudera Kargo Nusantara',
    contactName: 'Nadia Pramesti',
    value: 320_000_000,
    stage: 'Negosiasi',
    expectedCloseDate: '2026-11-15',
    owner: 'Raka Wijaya',
    updatedAt: '2026-10-29',
  },
  {
    id: 'deal-202',
    title: 'Implementasi Modul Rantai Dingin Distribusi',
    customerId: 'cust-102',
    company: 'PT Sentosa Agro Makmur',
    contactName: 'Hendra Gunawan',
    value: 185_000_000,
    stage: 'Menang',
    expectedCloseDate: '2026-10-20',
    owner: 'Sinta Maharani',
    updatedAt: '2026-10-20',
  },
  {
    id: 'deal-203',
    title: 'Integrasi API Rekonsiliasi Merchant Enterprise',
    customerId: 'cust-103',
    company: 'ArthaPay Digital Indonesia',
    contactName: 'Larasati Kusuma',
    value: 240_000_000,
    stage: 'Proposal',
    expectedCloseDate: '2026-11-28',
    owner: 'Raka Wijaya',
    updatedAt: '2026-10-27',
  },
  {
    id: 'deal-204',
    title: 'Sistem Otomasi Inventaris Suku Cadang Pabrik',
    customerId: 'cust-104',
    company: 'PT Krakatau Presisi Komponen',
    contactName: 'Dimas Wahyudi',
    value: 410_000_000,
    stage: 'Menang',
    expectedCloseDate: '2026-10-12',
    owner: 'Sinta Maharani',
    updatedAt: '2026-10-12',
  },
  {
    id: 'deal-205',
    title: 'Audit Kepatuhan Distribusi Farmasi Regional',
    customerId: 'cust-105',
    company: 'Prima Medika Farma',
    contactName: 'Clarissa Tanojo',
    value: 145_000_000,
    stage: 'Kualifikasi',
    expectedCloseDate: '2026-12-05',
    owner: 'Raka Wijaya',
    updatedAt: '2026-10-24',
  },
  {
    id: 'deal-206',
    title: 'Ekspansi Lisensi Cabang Pelabuhan Tanjung Perak',
    customerId: 'cust-101',
    company: 'PT Samudera Kargo Nusantara',
    contactName: 'Nadia Pramesti',
    value: 95_000_000,
    stage: 'Prospek Baru',
    expectedCloseDate: '2026-12-18',
    owner: 'Raka Wijaya',
    updatedAt: '2026-10-29',
  },
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-301',
    customerId: 'cust-101',
    customerName: 'Nadia Pramesti',
    company: 'PT Samudera Kargo Nusantara',
    type: 'Rapat',
    summary: 'Review draf SLA dan klausul penalti keterlambatan bersama tim legal klien.',
    createdAt: '2026-10-29 14:30',
    author: 'Raka Wijaya',
  },
  {
    id: 'act-302',
    customerId: 'cust-103',
    customerName: 'Larasati Kusuma',
    company: 'ArthaPay Digital Indonesia',
    type: 'Email',
    summary: 'Mengirimkan dokumen arsitektur keamanan ISO 27001 dan penawaran harga kuartal IV.',
    createdAt: '2026-10-27 10:15',
    author: 'Raka Wijaya',
  },
  {
    id: 'act-303',
    customerId: 'cust-102',
    customerName: 'Hendra Gunawan',
    company: 'PT Sentosa Agro Makmur',
    type: 'Telepon',
    summary: 'Konfirmasi jadwal pelatihan operator gudang pasca penandatanganan kontrak.',
    createdAt: '2026-10-26 16:00',
    author: 'Sinta Maharani',
  },
  {
    id: 'act-304',
    customerId: 'cust-105',
    customerName: 'Clarissa Tanojo',
    company: 'Prima Medika Farma',
    type: 'Catatan',
    summary: 'Klien membutuhkan integrasi sensor suhu gudang untuk 4 titik distribusi Jawa Barat.',
    createdAt: '2026-10-24 11:20',
    author: 'Raka Wijaya',
  },
];

export const INITIAL_TASKS: FollowUpTask[] = [
  {
    id: 'task-401',
    customerId: 'cust-101',
    customerName: 'Nadia Pramesti',
    company: 'PT Samudera Kargo Nusantara',
    title: 'Kirim revisi final kontrak lisensi 3 tahun ke bagian pengadaan',
    dueDate: '2026-10-31',
    priority: 'Tinggi',
    completed: false,
    assignee: 'Raka Wijaya',
  },
  {
    id: 'task-402',
    customerId: 'cust-103',
    customerName: 'Larasati Kusuma',
    company: 'ArthaPay Digital Indonesia',
    title: 'Demo teknis sandbox API bersama tim engineering ArthaPay',
    dueDate: '2026-11-02',
    priority: 'Tinggi',
    completed: false,
    assignee: 'Raka Wijaya',
  },
  {
    id: 'task-403',
    customerId: 'cust-105',
    customerName: 'Clarissa Tanojo',
    company: 'Prima Medika Farma',
    title: 'Susun estimasi kebutuhan perangkat IoT rantai dingin',
    dueDate: '2026-11-04',
    priority: 'Normal',
    completed: false,
    assignee: 'Raka Wijaya',
  },
  {
    id: 'task-404',
    customerId: 'cust-102',
    customerName: 'Hendra Gunawan',
    company: 'PT Sentosa Agro Makmur',
    title: 'Verifikasi berita acara serah terima tahap 1',
    dueDate: '2026-10-25',
    priority: 'Normal',
    completed: true,
    assignee: 'Sinta Maharani',
  },
];

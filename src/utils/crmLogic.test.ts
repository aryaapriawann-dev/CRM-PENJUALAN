import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCrmMetrics,
  filterCustomers,
  filterDeals,
  getNextDealStage,
  getPrevDealStage,
  validateCustomerInput,
  validateDealInput,
  validateTaskInput,
  INITIAL_CUSTOMERS,
  INITIAL_DEALS,
  INITIAL_TASKS,
  exportCustomersToCsv,
} from './crmLogic';

test('calculateCrmMetrics computes accurate pipeline, won value, and stage breakdown', () => {
  const metrics = calculateCrmMetrics(INITIAL_CUSTOMERS, INITIAL_DEALS, INITIAL_TASKS);

  // Active pipeline deals: 320M (Negosiasi) + 240M (Proposal) + 145M (Kualifikasi) + 95M (Prospek Baru) = 800,000,000
  assert.equal(metrics.totalPipelineValue, 800_000_000);
  // Won deals: 185M + 410M = 595,000,000
  assert.equal(metrics.wonValue, 595_000_000);
  assert.equal(metrics.wonCount, 2);
  assert.equal(metrics.activeDealsCount, 4);
  assert.equal(metrics.activeCustomersCount, 3);
  assert.equal(metrics.pendingTasksCount, 3);
  assert.equal(metrics.completedTasksCount, 1);
});

test('validateCustomerInput enforces required fields and email format', () => {
  const emptyErrors = validateCustomerInput({
    name: '',
    role: 'Director',
    company: '',
    industry: 'Logistik',
    email: 'invalid-email',
    phone: '123',
    status: 'Aktif',
    location: 'Jakarta',
  });

  assert.ok(emptyErrors.name);
  assert.ok(emptyErrors.company);
  assert.ok(emptyErrors.email);
  assert.ok(emptyErrors.phone);

  const validErrors = validateCustomerInput({
    name: 'Budi Santoso',
    role: 'Direktur Operasional',
    company: 'PT Nusantara Logistik',
    industry: 'Logistik',
    email: 'budi@nusantaralogistik.id',
    phone: '+62 812-9988-7766',
    status: 'Aktif',
    location: 'Jakarta',
    initialDealTitle: 'Kontrak Armada Tahunan',
    initialDealValue: '45000000',
  });

  assert.equal(Object.keys(validErrors).length, 0);
});

test('validateDealInput and validateTaskInput reject invalid values', () => {
  const dealErrors = validateDealInput({
    title: 'AB',
    customerId: '',
    value: '-500',
    stage: 'Proposal',
    expectedCloseDate: '',
  });
  assert.ok(dealErrors.title);
  assert.ok(dealErrors.customerId);
  assert.ok(dealErrors.value);
  assert.ok(dealErrors.expectedCloseDate);

  const taskErrors = validateTaskInput({
    title: '',
    customerId: '',
    dueDate: 'invalid',
    priority: 'Tinggi',
  });
  assert.ok(taskErrors.title);
  assert.ok(taskErrors.customerId);
  assert.ok(taskErrors.dueDate);
});

test('filterCustomers filters by query, status, and sorts by deal value', () => {
  const results = filterCustomers(INITIAL_CUSTOMERS, INITIAL_DEALS, 'Samudera', 'Semua', 'value');
  assert.equal(results.length, 1);
  assert.equal(results[0].company, 'PT Samudera Kargo Nusantara');
  assert.equal(results[0].totalDealValue, 415_000_000);

  const activeOnly = filterCustomers(INITIAL_CUSTOMERS, INITIAL_DEALS, '', 'Aktif', 'value');
  assert.equal(activeOnly.length, 3);
  assert.ok(activeOnly[0].totalDealValue >= activeOnly[1].totalDealValue);
});

test('filterDeals filters by stage and search query', () => {
  const wonDeals = filterDeals(INITIAL_DEALS, '', 'Menang');
  assert.equal(wonDeals.length, 2);

  const searchDeals = filterDeals(INITIAL_DEALS, 'ArthaPay', 'Semua');
  assert.equal(searchDeals.length, 1);
  assert.equal(searchDeals[0].id, 'deal-203');
});

test('getNextDealStage and getPrevDealStage progress accurately across stages', () => {
  assert.equal(getNextDealStage('Prospek Baru'), 'Kualifikasi');
  assert.equal(getNextDealStage('Negosiasi'), 'Menang');
  assert.equal(getNextDealStage('Menang'), null);
  assert.equal(getPrevDealStage('Proposal'), 'Kualifikasi');
  assert.equal(getPrevDealStage('Prospek Baru'), null);
});

test('exportCustomersToCsv outputs header and escaped rows', () => {
  const enriched = filterCustomers(INITIAL_CUSTOMERS, INITIAL_DEALS, '', 'Semua', 'name');
  const csv = exportCustomersToCsv(enriched);
  const lines = csv.split('\n');
  assert.equal(lines.length, INITIAL_CUSTOMERS.length + 1);
  assert.ok(lines[0].includes('Nama Kontak'));
  assert.ok(csv.includes('PT Samudera Kargo Nusantara'));
});

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityLog,
  ActivityType,
  calculateCrmMetrics,
  Customer,
  CustomerFormInput,
  CustomerStatus,
  Deal,
  DealFormInput,
  DealStage,
  FollowUpTask,
  INITIAL_ACTIVITIES,
  INITIAL_CUSTOMERS,
  INITIAL_DEALS,
  INITIAL_TASKS,
  TaskFormInput,
} from './utils/crmLogic';
import { OverviewTab } from './components/OverviewTab';
import { PipelineTab } from './components/PipelineTab';
import { CustomersTab } from './components/CustomersTab';
import { TasksTab } from './components/TasksTab';
import { CustomerDetailModal } from './components/CustomerDetailModal';
import {
  AddCustomerModal,
  AddDealModal,
  AddTaskModal,
} from './components/Modals';

type ActiveTab = 'ringkasan' | 'pipeline' | 'pelanggan' | 'tugas';

const STORAGE_KEYS = {
  customers: 'karsa_crm_customers_v1',
  deals: 'karsa_crm_deals_v1',
  activities: 'karsa_crm_activities_v1',
  tasks: 'karsa_crm_tasks_v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as unknown as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ringkasan');
  const [stageFilter, setStageFilter] = useState<'Semua' | DealStage>('Semua');

  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadFromStorage(STORAGE_KEYS.customers, INITIAL_CUSTOMERS)
  );
  const [deals, setDeals] = useState<Deal[]>(() =>
    loadFromStorage(STORAGE_KEYS.deals, INITIAL_DEALS)
  );
  const [activities, setActivities] = useState<ActivityLog[]>(() =>
    loadFromStorage(STORAGE_KEYS.activities, INITIAL_ACTIVITIES)
  );
  const [tasks, setTasks] = useState<FollowUpTask[]>(() =>
    loadFromStorage(STORAGE_KEYS.tasks, INITIAL_TASKS)
  );

  // Active modals & detail panel
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.customers,
        JSON.stringify(customers)
      );
    } catch {
      // ignore storage errors
    }
  }, [customers]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.deals, JSON.stringify(deals));
    } catch {
      // ignore storage errors
    }
  }, [deals]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.activities,
        JSON.stringify(activities)
      );
    } catch {
      // ignore storage errors
    }
  }, [activities]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    } catch {
      // ignore storage errors
    }
  }, [tasks]);

  const metrics = useMemo(
    () => calculateCrmMetrics(customers, deals, tasks),
    [customers, deals, tasks]
  );

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId]
  );

  // Handlers
  const handleAddCustomer = (input: CustomerFormInput) => {
    const today = '2026-10-30';
    const newId = `cust-${Date.now()}`;
    const newCustomer: Customer = {
      id: newId,
      name: input.name.trim(),
      role: input.role.trim() || 'Kontak Utama',
      company: input.company.trim(),
      industry: input.industry.trim() || 'Umum',
      email: input.email.trim(),
      phone: input.phone.trim(),
      status: input.status,
      location: input.location.trim() || 'Jakarta',
      lastContactDate: today,
      owner: 'Raka Wijaya',
      createdAt: today,
    };

    setCustomers((prev) => [newCustomer, ...prev]);

    const initialValueNum = Number(input.initialDealValue);
    if (
      input.initialDealTitle?.trim() ||
      (Number.isFinite(initialValueNum) && initialValueNum > 0)
    ) {
      const dealValue =
        Number.isFinite(initialValueNum) && initialValueNum > 0
          ? initialValueNum
          : 25_000_000;
      const newDeal: Deal = {
        id: `deal-${Date.now()}`,
        title:
          input.initialDealTitle?.trim() ||
          `Peluang Kemitraan ${newCustomer.company}`,
        customerId: newId,
        company: newCustomer.company,
        contactName: newCustomer.name,
        value: dealValue,
        stage: 'Prospek Baru',
        expectedCloseDate: '2026-12-15',
        owner: 'Raka Wijaya',
        updatedAt: today,
      };
      setDeals((prev) => [newDeal, ...prev]);
    }

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      customerId: newId,
      customerName: newCustomer.name,
      company: newCustomer.company,
      type: 'Catatan',
      summary: `Akun pelanggan ${newCustomer.company} ditambahkan ke direktori CRM.`,
      createdAt: '2026-10-30 09:00',
      author: 'Raka Wijaya',
    };
    setActivities((prev) => [newAct, ...prev]);
    setIsAddCustomerOpen(false);
  };

  const handleAddDeal = (input: DealFormInput) => {
    const cust = customers.find((c) => c.id === input.customerId);
    if (!cust) return;
    const today = '2026-10-30';
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: input.title.trim(),
      customerId: cust.id,
      company: cust.company,
      contactName: cust.name,
      value: Math.round(Number(input.value)),
      stage: input.stage,
      expectedCloseDate: input.expectedCloseDate,
      owner: 'Raka Wijaya',
      updatedAt: today,
    };
    setDeals((prev) => [newDeal, ...prev]);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === cust.id ? { ...c, lastContactDate: today } : c
      )
    );
    setIsAddDealOpen(false);
  };

  const handleAddTask = (input: TaskFormInput) => {
    const cust = customers.find((c) => c.id === input.customerId);
    if (!cust) return;
    const newTask: FollowUpTask = {
      id: `task-${Date.now()}`,
      customerId: cust.id,
      customerName: cust.name,
      company: cust.company,
      title: input.title.trim(),
      dueDate: input.dueDate,
      priority: input.priority,
      completed: false,
      assignee: 'Raka Wijaya',
    };
    setTasks((prev) => [newTask, ...prev]);
    setIsAddTaskOpen(false);
  };

  const handleUpdateDealStage = (dealId: string, newStage: DealStage) => {
    const today = '2026-10-30';
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId ? { ...d, stage: newStage, updatedAt: today } : d
      )
    );
  };

  const handleUpdateCustomerStatus = (
    customerId: string,
    status: CustomerStatus
  ) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, status } : c))
    );
  };

  const handleAddActivity = (
    customerId: string,
    type: ActivityType,
    summary: string
  ) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;
    const today = '2026-10-30';
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      customerId: cust.id,
      customerName: cust.name,
      company: cust.company,
      type,
      summary,
      createdAt: `${today} 10:45`,
      author: 'Raka Wijaya',
    };
    setActivities((prev) => [newAct, ...prev]);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, lastContactDate: today } : c
      )
    );
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    setDeals((prev) => prev.filter((d) => d.customerId !== customerId));
    setTasks((prev) => prev.filter((t) => t.customerId !== customerId));
    setActivities((prev) => prev.filter((a) => a.customerId !== customerId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-y-2 gap-x-4 md:gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#ringkasan"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('ringkasan');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Karsa CRM
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav
            aria-label="Navigasi Utama"
            className="order-3 sm:order-2 w-full sm:w-auto flex items-center justify-between sm:justify-center gap-4 sm:gap-7 text-xs sm:text-sm font-medium text-slate-600 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0"
          >
            <a
              href="#ringkasan"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('ringkasan');
              }}
              aria-current={activeTab === 'ringkasan' ? 'page' : undefined}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'ringkasan'
                  ? 'text-slate-900 font-semibold underline decoration-2 underline-offset-8 decoration-blue-600'
                  : 'hover:text-slate-900 hover:underline underline-offset-8'
              }`}
            >
              Ringkasan
            </a>
            <a
              href="#pipeline"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('pipeline');
              }}
              aria-current={activeTab === 'pipeline' ? 'page' : undefined}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'pipeline'
                  ? 'text-slate-900 font-semibold underline decoration-2 underline-offset-8 decoration-blue-600'
                  : 'hover:text-slate-900 hover:underline underline-offset-8'
              }`}
            >
              Pipeline
            </a>
            <a
              href="#pelanggan"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('pelanggan');
              }}
              aria-current={activeTab === 'pelanggan' ? 'page' : undefined}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'pelanggan'
                  ? 'text-slate-900 font-semibold underline decoration-2 underline-offset-8 decoration-blue-600'
                  : 'hover:text-slate-900 hover:underline underline-offset-8'
              }`}
            >
              Pelanggan
            </a>
            <a
              href="#tugas"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('tugas');
              }}
              aria-current={activeTab === 'tugas' ? 'page' : undefined}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'tugas'
                  ? 'text-slate-900 font-semibold underline decoration-2 underline-offset-8 decoration-blue-600'
                  : 'hover:text-slate-900 hover:underline underline-offset-8'
              }`}
            >
              Tugas
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsAddCustomerOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Tambah Pelanggan
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'ringkasan' && (
          <OverviewTab
            metrics={metrics}
            deals={deals}
            tasks={tasks}
            activities={activities}
            onNavigateTab={setActiveTab}
            onSelectStageFilter={setStageFilter}
            onToggleTask={handleToggleTask}
            onSelectCustomer={(id) => setSelectedCustomerId(id)}
            onOpenNewDeal={() => setIsAddDealOpen(true)}
            onOpenNewTask={() => setIsAddTaskOpen(true)}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineTab
            deals={deals}
            stageFilter={stageFilter}
            onChangeStageFilter={setStageFilter}
            onUpdateDealStage={handleUpdateDealStage}
            onSelectCustomer={(id) => setSelectedCustomerId(id)}
            onOpenNewDeal={() => setIsAddDealOpen(true)}
          />
        )}

        {activeTab === 'pelanggan' && (
          <CustomersTab
            customers={customers}
            deals={deals}
            onSelectCustomer={(id) => setSelectedCustomerId(id)}
            onOpenNewCustomer={() => setIsAddCustomerOpen(true)}
          />
        )}

        {activeTab === 'tugas' && (
          <TasksTab
            tasks={tasks}
            activities={activities}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onSelectCustomer={(id) => setSelectedCustomerId(id)}
            onOpenNewTask={() => setIsAddTaskOpen(true)}
          />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Karsa CRM — Sistem Manajemen Pelanggan & Pipeline Penjualan B2B</span>
          <span>Data tersimpan secara lokal di peramban Anda</span>
        </div>
      </footer>

      {/* Modals & Detail Slide-Over */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          deals={deals}
          activities={activities}
          tasks={tasks}
          onClose={() => setSelectedCustomerId(null)}
          onUpdateStatus={handleUpdateCustomerStatus}
          onUpdateDealStage={handleUpdateDealStage}
          onAddActivity={handleAddActivity}
          onToggleTask={handleToggleTask}
          onDeleteCustomer={handleDeleteCustomer}
        />
      )}

      {isAddCustomerOpen && (
        <AddCustomerModal
          onClose={() => setIsAddCustomerOpen(false)}
          onSave={handleAddCustomer}
        />
      )}

      {isAddDealOpen && (
        <AddDealModal
          customers={customers}
          onClose={() => setIsAddDealOpen(false)}
          onSave={handleAddDeal}
        />
      )}

      {isAddTaskOpen && (
        <AddTaskModal
          customers={customers}
          onClose={() => setIsAddTaskOpen(false)}
          onSave={handleAddTask}
        />
      )}
    </div>
  );
}

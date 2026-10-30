import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  Customer,
  CustomerFormInput,
  CustomerStatus,
  DEAL_STAGES,
  DealFormInput,
  DealStage,
  TaskFormInput,
  validateCustomerInput,
  validateDealInput,
  validateTaskInput,
} from '../utils/crmLogic';

interface AddCustomerModalProps {
  onClose: () => void;
  onSave: (input: CustomerFormInput) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<CustomerFormInput>({
    name: '',
    role: 'Direktur Operasional',
    company: '',
    industry: 'Logistik & Distribusi',
    email: '',
    phone: '',
    status: 'Aktif',
    location: 'Jakarta',
    initialDealTitle: '',
    initialDealValue: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCustomerInput(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSave(form);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-add-customer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px]"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2
            id="modal-add-customer-title"
            className="text-base font-bold text-slate-900"
          >
            Tambah Pelanggan Baru
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir pelanggan"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cust-name"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Nama Lengkap Kontak *
              </label>
              <input
                id="cust-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.name && (
                <p role="alert" className="text-[11px] text-red-600 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cust-company"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Nama Perusahaan *
              </label>
              <input
                id="cust-company"
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Contoh: PT Nusantara Logistik"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.company && (
                <p role="alert" className="text-[11px] text-red-600 mt-1">
                  {errors.company}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="cust-email"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Email Bisnis *
              </label>
              <input
                id="cust-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nama@perusahaan.id"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.email && (
                <p role="alert" className="text-[11px] text-red-600 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cust-phone"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Nomor Telepon / WhatsApp *
              </label>
              <input
                id="cust-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+62 812-xxxx-xxxx"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.phone && (
                <p role="alert" className="text-[11px] text-red-600 mt-1">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="cust-role"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Jabatan
              </label>
              <input
                id="cust-role"
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="cust-industry"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Sektor Industri
              </label>
              <input
                id="cust-industry"
                type="text"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="cust-status"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Status Akun
              </label>
              <select
                id="cust-status"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as CustomerStatus })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Aktif">Aktif</option>
                <option value="Prospek">Prospek</option>
                <option value="Pasif">Pasif</option>
              </select>
            </div>
          </div>

          {/* Optional Initial Deal */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <p className="text-xs font-semibold text-slate-700">
              Peluang Kontrak Awal (Opsional)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cust-deal-title"
                  className="block text-[11px] font-medium text-slate-600 mb-1"
                >
                  Nama Peluang / Proyek
                </label>
                <input
                  id="cust-deal-title"
                  type="text"
                  value={form.initialDealTitle}
                  onChange={(e) =>
                    setForm({ ...form, initialDealTitle: e.target.value })
                  }
                  placeholder="Contoh: Lisensi Tahunan ERP"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="cust-deal-value"
                  className="block text-[11px] font-medium text-slate-600 mb-1"
                >
                  Estimasi Nilai (IDR)
                </label>
                <input
                  id="cust-deal-value"
                  type="number"
                  min="0"
                  step="1000000"
                  value={form.initialDealValue}
                  onChange={(e) =>
                    setForm({ ...form, initialDealValue: e.target.value })
                  }
                  placeholder="45000000"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {errors.initialDealValue && (
                  <p role="alert" className="text-[11px] text-red-600 mt-1">
                    {errors.initialDealValue}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Simpan Pelanggan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddDealModalProps {
  customers: Customer[];
  onClose: () => void;
  onSave: (input: DealFormInput) => void;
}

export const AddDealModal: React.FC<AddDealModalProps> = ({
  customers,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<DealFormInput>({
    title: '',
    customerId: customers[0]?.id ?? '',
    value: '',
    stage: 'Kualifikasi',
    expectedCloseDate: '2026-11-30',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateDealInput(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSave(form);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-add-deal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px]"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2
            id="modal-add-deal-title"
            className="text-base font-bold text-slate-900"
          >
            Tambah Peluang Deal Baru
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir deal"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          <div>
            <label
              htmlFor="deal-title"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Nama Peluang / Proyek *
            </label>
            <input
              id="deal-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Pengadaan Modul Gudang Regional"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.title && (
              <p role="alert" className="text-[11px] text-red-600 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="deal-customer"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Pelanggan / Perusahaan *
            </label>
            <select
              id="deal-customer"
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">-- Pilih Pelanggan --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company} ({c.name})
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p role="alert" className="text-[11px] text-red-600 mt-1">
                {errors.customerId}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="deal-value"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Nilai Kontrak (IDR) *
              </label>
              <input
                id="deal-value"
                type="number"
                min="0"
                step="1000000"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="150000000"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.value && (
                <p role="alert" className="text-[11px] text-red-600 mt-1">
                  {errors.value}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="deal-stage"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Tahapan Awal
              </label>
              <select
                id="deal-stage"
                value={form.stage}
                onChange={(e) =>
                  setForm({ ...form, stage: e.target.value as DealStage })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {DEAL_STAGES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="deal-close-date"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Target Penutupan Kontrak *
            </label>
            <input
              id="deal-close-date"
              type="date"
              value={form.expectedCloseDate}
              onChange={(e) =>
                setForm({ ...form, expectedCloseDate: e.target.value })
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.expectedCloseDate && (
              <p role="alert" className="text-[11px] text-red-600 mt-1">
                {errors.expectedCloseDate}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Simpan Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddTaskModalProps {
  customers: Customer[];
  onClose: () => void;
  onSave: (input: TaskFormInput) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  customers,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<TaskFormInput>({
    title: '',
    customerId: customers[0]?.id ?? '',
    dueDate: '2026-11-05',
    priority: 'Tinggi',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateTaskInput(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSave(form);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-add-task-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px]"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2
            id="modal-add-task-title"
            className="text-base font-bold text-slate-900"
          >
            Jadwalkan Tindak Lanjut Baru
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir tugas"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Agenda Tindak Lanjut *
            </label>
            <input
              id="task-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Presentasi proposal harga ke direksi"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.title && (
              <p role="alert" className="text-[11px] text-red-600 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="task-customer"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Pelanggan Terkait *
            </label>
            <select
              id="task-customer"
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">-- Pilih Pelanggan --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company} ({c.name})
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p role="alert" className="text-[11px] text-red-600 mt-1">
                {errors.customerId}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-due-date"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Tanggal Tenggat *
              </label>
              <input
                id="task-due-date"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.dueDate && (
                <p role="alert" className="text-[11px] text-red-600 mt-1">
                  {errors.dueDate}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Tingkat Prioritas
              </label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as 'Tinggi' | 'Normal' | 'Rendah',
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Tinggi">Tinggi</option>
                <option value="Normal">Normal</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Simpan Jadwal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  CheckCircle2,
  Circle,
  Send,
  Trash2,
} from 'lucide-react';
import {
  ActivityLog,
  ActivityType,
  Customer,
  CustomerStatus,
  DEAL_STAGES,
  Deal,
  DealStage,
  FollowUpTask,
  formatIDR,
} from '../utils/crmLogic';

interface CustomerDetailModalProps {
  customer: Customer;
  deals: Deal[];
  activities: ActivityLog[];
  tasks: FollowUpTask[];
  onClose: () => void;
  onUpdateStatus: (customerId: string, status: CustomerStatus) => void;
  onUpdateDealStage: (dealId: string, stage: DealStage) => void;
  onAddActivity: (customerId: string, type: ActivityType, summary: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  deals,
  activities,
  tasks,
  onClose,
  onUpdateStatus,
  onUpdateDealStage,
  onAddActivity,
  onToggleTask,
  onDeleteCustomer,
}) => {
  const [activityType, setActivityType] = useState<ActivityType>('Catatan');
  const [activitySummary, setActivitySummary] = useState('');
  const [activityError, setActivityError] = useState('');

  const customerDeals = deals.filter((d) => d.customerId === customer.id);
  const customerActivities = activities.filter((a) => a.customerId === customer.id);
  const customerTasks = tasks.filter((t) => t.customerId === customer.id);

  const totalDealValue = customerDeals
    .filter((d) => d.stage !== 'Batal')
    .reduce((sum, d) => sum + d.value, 0);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activitySummary.trim() || activitySummary.trim().length < 3) {
      setActivityError('Ringkasan interaksi wajib diisi (minimal 3 karakter).');
      return;
    }
    setActivityError('');
    onAddActivity(customer.id, activityType, activitySummary.trim());
    setActivitySummary('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-customer-title"
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-[1px]"
    >
      <div className="relative w-full max-w-2xl bg-white h-full overflow-y-auto border-l border-slate-200 flex flex-col justify-between">
        <div>
          {/* Top Bar */}
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Profil Pelanggan · {customer.industry}
              </p>
              <h2
                id="detail-customer-title"
                className="text-lg font-bold text-slate-900"
              >
                {customer.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup panel detail pelanggan"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Metadata & Status Switcher */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{customer.company}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {customer.role} · PIC Internal: {customer.owner}
                  </p>
                </div>

                {/* Interactive Status Segmented Control */}
                <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start">
                  {(['Aktif', 'Prospek', 'Pasif'] as CustomerStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onUpdateStatus(customer.id, st)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        customer.status === st
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-mono tabular-nums">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{customer.location}</span>
                </div>
              </div>
            </div>

            {/* Linked Deals */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  Peluang & Kontrak Terkait ({customerDeals.length})
                </h3>
                <span className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                  Total: {formatIDR(totalDealValue)}
                </span>
              </div>

              {customerDeals.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 border-t border-slate-200">
                  Belum ada peluang kontrak untuk pelanggan ini.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-200">
                  {customerDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          {deal.title}
                        </p>
                        <p className="text-[11px] font-mono text-slate-500 tabular-nums mt-0.5">
                          {formatIDR(deal.value)} · Target {deal.expectedCloseDate}
                        </p>
                      </div>
                      <select
                        aria-label={`Ubah tahapan deal ${deal.title}`}
                        value={deal.stage}
                        onChange={(e) =>
                          onUpdateDealStage(deal.id, e.target.value as DealStage)
                        }
                        className="text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                      >
                        {DEAL_STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Log New Activity Form */}
            <section className="border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Catat Interaksi Baru
              </h3>
              <form onSubmit={handleLogSubmit} className="space-y-3">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
                  {(['Catatan', 'Telepon', 'Email', 'Rapat'] as ActivityType[]).map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setActivityType(t)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          activityType === t
                            ? 'bg-white text-slate-900 shadow-xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>

                <div>
                  <label htmlFor="activity-note-input" className="sr-only">
                    Ringkasan Interaksi
                  </label>
                  <textarea
                    id="activity-note-input"
                    rows={2}
                    value={activitySummary}
                    onChange={(e) => setActivitySummary(e.target.value)}
                    placeholder="Tuliskan hasil panggilan, poin rapat, atau tindak lanjut..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  {activityError && (
                    <p role="alert" className="text-xs text-red-600 mt-1">
                      {activityError}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Simpan Catatan</span>
                  </button>
                </div>
              </form>
            </section>

            {/* Follow-up Tasks for this Customer */}
            {customerTasks.length > 0 && (
              <section className="space-y-2.5">
                <h3 className="text-sm font-semibold text-slate-900">
                  Jadwal Tindak Lanjut ({customerTasks.length})
                </h3>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-200">
                  {customerTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => onToggleTask(task.id)}
                          aria-label={`Tandai tugas: ${task.title}`}
                          className="text-slate-400 hover:text-emerald-600 cursor-pointer"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <span
                          className={`text-xs ${
                            task.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-800 font-medium'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 tabular-nums shrink-0">
                        {task.dueDate}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Activity History Timeline */}
            <section className="space-y-2.5">
              <h3 className="text-sm font-semibold text-slate-900">
                Riwayat Aktivitas ({customerActivities.length})
              </h3>
              {customerActivities.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Belum ada catatan interaksi untuk pelanggan ini.
                </p>
              ) : (
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-200">
                  {customerActivities.map((act) => (
                    <div key={act.id} className="p-3.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">
                          {act.type} · {act.author}
                        </span>
                        <span className="font-mono tabular-nums">{act.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {act.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Footer with Delete Customer Option */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onDeleteCustomer(customer.id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Akun Pelanggan</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

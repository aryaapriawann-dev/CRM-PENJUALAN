import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  PhoneCall,
  Mail,
  Users,
  FileText,
  TrendingUp,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import {
  ActivityLog,
  CrmMetrics,
  Deal,
  DealStage,
  FollowUpTask,
  formatCompactIDR,
  formatIDR,
  STAGE_PROBABILITY,
} from '../utils/crmLogic';

interface OverviewTabProps {
  metrics: CrmMetrics;
  deals: Deal[];
  tasks: FollowUpTask[];
  activities: ActivityLog[];
  onNavigateTab: (tab: 'ringkasan' | 'pipeline' | 'pelanggan' | 'tugas') => void;
  onSelectStageFilter: (stage: 'Semua' | DealStage) => void;
  onToggleTask: (taskId: string) => void;
  onSelectCustomer: (customerId: string) => void;
  onOpenNewDeal: () => void;
  onOpenNewTask: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  deals,
  tasks,
  activities,
  onNavigateTab,
  onSelectStageFilter,
  onToggleTask,
  onSelectCustomer,
  onOpenNewDeal,
  onOpenNewTask,
}) => {
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 5);
  const topActiveDeals = deals
    .filter((d) => d.stage !== 'Menang' && d.stage !== 'Batal')
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'Telepon':
        return <PhoneCall className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
      case 'Rapat':
        return <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Kuartal IV 2026 · Pembaruan Langsung
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Ringkasan Kinerja Penjualan
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenNewTask}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Jadwalkan Tindak Lanjut
          </button>
          <button
            type="button"
            onClick={onOpenNewDeal}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Tambah Peluang Deal
          </button>
        </div>
      </div>

      {/* 4-Column Full-Width KPI Strip */}
      <section
        aria-label="Metrik Utama CRM"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-slate-200 rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200"
      >
        <div className="p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Nilai Pipeline Aktif</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <p
            data-testid="kpi-pipeline-value"
            className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums mt-1.5"
          >
            {formatCompactIDR(metrics.totalPipelineValue)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono tabular-nums whitespace-nowrap truncate">
            {metrics.activeDealsCount} deal aktif · Bobot {formatCompactIDR(metrics.weightedPipelineValue)}
          </p>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Pendapatan Deal Menang</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p
            data-testid="kpi-won-value"
            className="text-2xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums mt-1.5"
          >
            {formatCompactIDR(metrics.wonValue)}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono tabular-nums whitespace-nowrap truncate">
            {metrics.wonCount} kontrak selesai · Rasio menang {metrics.winRatePercent}%
          </p>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Pelanggan Aktif</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <p
            data-testid="kpi-customers-count"
            className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums mt-1.5"
          >
            {metrics.activeCustomersCount}{' '}
            <span className="text-sm font-normal text-slate-500">
              / {metrics.totalCustomersCount} akun
            </span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Direktori akun B2B terverifikasi
          </p>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Tindak Lanjut Tertunda</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p
            data-testid="kpi-pending-tasks"
            className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums mt-1.5"
          >
            {metrics.pendingTasksCount}{' '}
            <span className="text-sm font-normal text-slate-500">tugas</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
            {metrics.completedTasksCount} tindak lanjut telah diselesaikan
          </p>
        </div>
      </section>

      {/* Pipeline Distribution Breakdown */}
      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Distribusi Tahapan Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik pada tahapan untuk memfilter daftar peluang di halaman Pipeline
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onSelectStageFilter('Semua');
              onNavigateTab('pipeline');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Buka Papan Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-200 mt-1">
          {metrics.stageBreakdown
            .filter((item) => item.stage !== 'Batal')
            .map((item) => {
              const probPercent = Math.round((STAGE_PROBABILITY[item.stage] ?? 0) * 100);
              return (
                <div
                  key={item.stage}
                  className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors px-2 -mx-2 rounded-lg"
                >
                  <div className="min-w-[200px]">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectStageFilter(item.stage);
                        onNavigateTab('pipeline');
                      }}
                      className="text-xs font-semibold text-slate-900 hover:text-blue-700 transition-colors text-left cursor-pointer"
                    >
                      {item.stage}
                    </button>
                    <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {item.count} deal · Bobot probabilitas {probPercent}%
                    </p>
                  </div>

                  <div className="flex-1 max-w-md">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-200 ${
                          item.stage === 'Menang' ? 'bg-emerald-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.max(item.percentageOfPipeline, item.count > 0 ? 6 : 0)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-left sm:text-right min-w-[180px] font-mono tabular-nums">
                    <p className="text-xs font-semibold text-slate-900">
                      {formatIDR(item.totalValue)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {item.percentageOfPipeline}% dari total nilai
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* Two-Column Split: Priority Deals & Follow-up Tasks / Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 columns: Top Active Deals */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Peluang Prioritas Aktif
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Diurutkan berdasarkan nilai kontrak tertinggi
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('pipeline')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Lihat Semua ({metrics.activeDealsCount})
              </button>
            </div>

            {topActiveDeals.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-600">
                  Belum ada peluang aktif di pipeline.
                </p>
                <button
                  type="button"
                  onClick={onOpenNewDeal}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Tambah Peluang Pertama
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {topActiveDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onSelectCustomer(deal.customerId)}
                        className="text-sm font-semibold text-slate-900 hover:text-blue-700 transition-colors text-left truncate block max-w-full cursor-pointer"
                      >
                        {deal.title}
                      </button>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">{deal.company}</span>
                        <span aria-hidden="true">·</span>
                        <span>{deal.contactName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-blue-700 font-medium">{deal.stage}</span>
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0 font-mono tabular-nums">
                      <p className="text-sm font-semibold text-slate-900">
                        {formatIDR(deal.value)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Target {deal.expectedCloseDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 rounded-b-xl flex items-center justify-between text-xs text-slate-600">
            <span>Total eksposur peluang aktif</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {formatIDR(metrics.totalPipelineValue)}
            </span>
          </div>
        </section>

        {/* Right 5 columns: Tasks & Recent Interactions */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Tindak Lanjut Terdekat
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tandai selesai langsung setelah dihubungi
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('tugas')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Kelola Tugas
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="p-6 text-center border-b border-slate-200">
                <p className="text-sm text-slate-600">
                  Semua jadwal tindak lanjut telah diselesaikan.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 border-b border-slate-200">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="px-6 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      aria-label={`Tandai selesai: ${task.title}`}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 leading-snug">
                        {task.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <button
                          type="button"
                          onClick={() => onSelectCustomer(task.customerId)}
                          className="hover:text-blue-700 underline-offset-2 hover:underline cursor-pointer"
                        >
                          {task.company}
                        </button>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{task.dueDate}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            task.priority === 'Tinggi'
                              ? 'text-amber-700 font-medium'
                              : 'text-slate-500'
                          }
                        >
                          Prioritas {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Activity Log */}
            <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/60">
              <h3 className="text-xs font-semibold text-slate-700">
                Log Aktivitas Terakhir
              </h3>
            </div>
            <div className="divide-y divide-slate-200">
              {activities.slice(0, 3).map((act) => (
                <div key={act.id} className="px-6 py-3 flex items-start gap-3">
                  <div className="mt-0.5">{getActivityIcon(act.type)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {act.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <span className="font-medium text-slate-700">{act.company}</span>
                      <span aria-hidden="true">·</span>
                      <span>{act.type}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{act.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 rounded-b-xl flex items-center justify-between text-xs text-slate-600">
            <span>Total log interaksi tercatat</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {activities.length} aktivitas
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

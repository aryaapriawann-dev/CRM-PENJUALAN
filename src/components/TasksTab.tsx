import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  PhoneCall,
  Mail,
  Users,
  FileText,
} from 'lucide-react';
import { ActivityLog, FollowUpTask } from '../utils/crmLogic';

interface TasksTabProps {
  tasks: FollowUpTask[];
  activities: ActivityLog[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectCustomer: (customerId: string) => void;
  onOpenNewTask: () => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({
  tasks,
  activities,
  onToggleTask,
  onDeleteTask,
  onSelectCustomer,
  onOpenNewTask,
}) => {
  const [taskFilter, setTaskFilter] = useState<'semua' | 'tertunda' | 'selesai'>('tertunda');

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'tertunda') return !t.completed;
    if (taskFilter === 'selesai') return t.completed;
    return true;
  });

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Manajemen Aktivitas Tim · Pengingat Komunikasi Pelanggan
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Jadwal Tindak Lanjut & Log Aktivitas
          </h1>
        </div>
        <button
          type="button"
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Jadwalkan Tindak Lanjut</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Follow-Up Tasks */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Daftar Tugas Tindak Lanjut
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik kotak centang untuk memperbarui status penyelesaian
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setTaskFilter('tertunda')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  taskFilter === 'tertunda'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Belum Selesai ({tasks.filter((t) => !t.completed).length})
              </button>
              <button
                type="button"
                onClick={() => setTaskFilter('selesai')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  taskFilter === 'selesai'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Selesai ({tasks.filter((t) => t.completed).length})
              </button>
              <button
                type="button"
                onClick={() => setTaskFilter('semua')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  taskFilter === 'semua'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({tasks.length})
              </button>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-700">
                Tidak ada tugas pada kategori ini.
              </p>
              <button
                type="button"
                onClick={onOpenNewTask}
                className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Buat Tugas Baru
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      aria-label={`Ubah status selesai untuk ${task.title}`}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium leading-snug ${
                          task.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <button
                          type="button"
                          onClick={() => onSelectCustomer(task.customerId)}
                          className="font-medium text-slate-700 hover:text-blue-700 cursor-pointer"
                        >
                          {task.company}
                        </button>
                        <span aria-hidden="true">·</span>
                        <span>{task.customerName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          Tenggat {task.dueDate}
                        </span>
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

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    aria-label={`Hapus tugas ${task.title}`}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right 5 Columns: Complete Activity Log */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-semibold text-slate-900">
              Riwayat Interaksi Pelanggan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Catatan panggilan, rapat, dan email terbaru dengan klien
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {activities.map((act) => (
              <div key={act.id} className="px-6 py-4 flex items-start gap-3">
                <div className="mt-0.5">{getActivityIcon(act.type)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectCustomer(act.customerId)}
                      className="text-xs font-semibold text-slate-900 hover:text-blue-700 text-left truncate cursor-pointer"
                    >
                      {act.company}
                    </button>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0">
                      {act.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {act.summary}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {act.type} bersama {act.customerName} · Dicatat oleh {act.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

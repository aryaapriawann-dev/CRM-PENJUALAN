import React, { useState } from 'react';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Plus,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';
import {
  ACTIVE_PIPELINE_STAGES,
  DEAL_STAGES,
  Deal,
  DealStage,
  filterDeals,
  formatCompactIDR,
  formatIDR,
  getNextDealStage,
  getPrevDealStage,
  STAGE_PROBABILITY,
} from '../utils/crmLogic';

interface PipelineTabProps {
  deals: Deal[];
  stageFilter: 'Semua' | DealStage;
  onChangeStageFilter: (stage: 'Semua' | DealStage) => void;
  onUpdateDealStage: (dealId: string, newStage: DealStage) => void;
  onSelectCustomer: (customerId: string) => void;
  onOpenNewDeal: () => void;
}

export const PipelineTab: React.FC<PipelineTabProps> = ({
  deals,
  stageFilter,
  onChangeStageFilter,
  onUpdateDealStage,
  onSelectCustomer,
  onOpenNewDeal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  const filteredDeals = filterDeals(deals, searchQuery, stageFilter);

  const boardStages: DealStage[] =
    stageFilter === 'Semua'
      ? [...ACTIVE_PIPELINE_STAGES, 'Menang']
      : [stageFilter];

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Manajemen Siklus Kontrak · Tahapan Deal B2B
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Pipeline Penjualan
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Papan Tahapan</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel Data</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onOpenNewDeal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Deal</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Interactive Stage Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter Tahapan Deal"
          className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto"
        >
          {(['Semua', ...DEAL_STAGES] as const).map((stage) => {
            const count =
              stage === 'Semua'
                ? deals.length
                : deals.filter((d) => d.stage === stage).length;
            return (
              <button
                key={stage}
                type="button"
                role="tab"
                aria-selected={stageFilter === stage}
                onClick={() => onChangeStageFilter(stage)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  stageFilter === stage
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {stage} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari deal, perusahaan, kontak..."
            aria-label="Cari peluang di pipeline"
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content: Board View vs Table View */}
      {viewMode === 'board' ? (
        <div
          className={`grid grid-cols-1 ${
            boardStages.length === 1
              ? 'md:grid-cols-1 max-w-2xl'
              : 'md:grid-cols-2 xl:grid-cols-5'
          } gap-4 items-start`}
        >
          {boardStages.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);
            const prob = Math.round((STAGE_PROBABILITY[stage] ?? 0) * 100);

            return (
              <div
                key={stage}
                data-testid={`pipeline-column-${stage}`}
                className="bg-white border border-slate-200 rounded-xl flex flex-col"
              >
                {/* Column Header */}
                <div className="p-4 border-b border-slate-200 bg-slate-50/60 rounded-t-xl">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-bold text-slate-900 truncate">
                      {stage}
                    </h2>
                    <span className="text-xs font-mono font-semibold text-slate-600 tabular-nums shrink-0">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono tabular-nums mt-1">
                    <span>{formatCompactIDR(stageTotal)}</span>
                    <span>Bobot {prob}%</span>
                  </div>
                </div>

                {/* Column Deal Items */}
                <div className="divide-y divide-slate-200">
                  {stageDeals.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-xs text-slate-400">
                        Tidak ada deal pada tahap ini
                      </p>
                    </div>
                  ) : (
                    stageDeals.map((deal) => {
                      const nextStage = getNextDealStage(deal.stage);
                      const prevStage = getPrevDealStage(deal.stage);

                      return (
                        <div
                          key={deal.id}
                          className="p-4 hover:bg-slate-50/70 transition-colors space-y-2.5"
                        >
                          <div>
                            <button
                              type="button"
                              onClick={() => onSelectCustomer(deal.customerId)}
                              className="text-xs font-semibold text-slate-900 hover:text-blue-700 text-left leading-snug block cursor-pointer"
                            >
                              {deal.title}
                            </button>
                            <p className="text-[11px] text-slate-500 mt-1">
                              {deal.company} · {deal.contactName}
                            </p>
                          </div>

                          <div className="flex items-baseline justify-between font-mono tabular-nums pt-1">
                            <span className="text-xs font-bold text-slate-900">
                              {formatIDR(deal.value)}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {deal.expectedCloseDate}
                            </span>
                          </div>

                          {/* Stage Progression Controls */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                            {prevStage ? (
                              <button
                                type="button"
                                onClick={() => onUpdateDealStage(deal.id, prevStage)}
                                aria-label={`Mundurkan ${deal.title} ke ${prevStage}`}
                                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              >
                                <ChevronLeft className="w-3 h-3" />
                                <span>Mundur</span>
                              </button>
                            ) : (
                              <span />
                            )}

                            {nextStage ? (
                              <button
                                type="button"
                                onClick={() => onUpdateDealStage(deal.id, nextStage)}
                                aria-label={`Majukan ${deal.title} ke ${nextStage}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                              >
                                <span>Ke {nextStage}</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            ) : deal.stage === 'Menang' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Kontrak Menang</span>
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Table View */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {filteredDeals.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-700">
                Tidak ada peluang yang cocok dengan filter pencarian.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onChangeStageFilter('Semua');
                }}
                className="mt-3 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
                    <th className="py-3 px-4">Nama Peluang / Deal</th>
                    <th className="py-3 px-4">Perusahaan & Kontak</th>
                    <th className="py-3 px-4">Tahapan Saat Ini</th>
                    <th className="py-3 px-4 text-right">Nilai Kontrak</th>
                    <th className="py-3 px-4 text-right">Target Tutup</th>
                    <th className="py-3 px-4 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {filteredDeals.map((deal) => {
                    const nextStage = getNextDealStage(deal.stage);
                    return (
                      <tr
                        key={deal.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          <button
                            type="button"
                            onClick={() => onSelectCustomer(deal.customerId)}
                            className="hover:text-blue-700 text-left cursor-pointer"
                          >
                            {deal.title}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="font-medium text-slate-800">{deal.company}</span>
                          <span className="mx-1.5 text-slate-400">·</span>
                          <span>{deal.contactName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            aria-label={`Ubah tahapan untuk ${deal.title}`}
                            value={deal.stage}
                            onChange={(e) =>
                              onUpdateDealStage(deal.id, e.target.value as DealStage)
                            }
                            className="text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                          >
                            {DEAL_STAGES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                          {formatIDR(deal.value)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500 tabular-nums whitespace-nowrap">
                          {deal.expectedCloseDate}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            {nextStage && (
                              <button
                                type="button"
                                onClick={() => onUpdateDealStage(deal.id, nextStage)}
                                className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              >
                                Majukan ({nextStage})
                              </button>
                            )}
                            {deal.stage !== 'Menang' && deal.stage !== 'Batal' && (
                              <button
                                type="button"
                                onClick={() => onUpdateDealStage(deal.id, 'Batal')}
                                aria-label={`Batalkan deal ${deal.title}`}
                                className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="Tandai Batal"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

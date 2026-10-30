import React, { useState } from 'react';
import {
  Search,
  Download,
  UserPlus,
  CheckCircle2,
  Clock,
  MinusCircle,
  ArrowUpDown,
} from 'lucide-react';
import {
  Customer,
  CustomerStatus,
  Deal,
  exportCustomersToCsv,
  filterCustomers,
  formatIDR,
} from '../utils/crmLogic';

interface CustomersTabProps {
  customers: Customer[];
  deals: Deal[];
  onSelectCustomer: (customerId: string) => void;
  onOpenNewCustomer: () => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({
  customers,
  deals,
  onSelectCustomer,
  onOpenNewCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | CustomerStatus>('Semua');
  const [sortBy, setSortBy] = useState<'value' | 'name' | 'recent'>('value');

  const filteredCustomers = filterCustomers(
    customers,
    deals,
    searchQuery,
    statusFilter,
    sortBy
  );

  const handleDownloadCsv = () => {
    const csvContent = exportCustomersToCsv(filteredCustomers);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'direktori-pelanggan-karsa-crm.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderStatusIndicator = (status: CustomerStatus) => {
    if (status === 'Aktif') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Aktif</span>
        </span>
      );
    }
    if (status === 'Prospek') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Prospek</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <MinusCircle className="w-3.5 h-3.5 shrink-0" />
        <span>Pasif</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Database Akun B2B · Riwayat Komunikasi & Nilai Kontrak
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Direktori Pelanggan
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Segmented Status Filter + Search + Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter Status Pelanggan"
          className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit"
        >
          {(['Semua', 'Aktif', 'Prospek', 'Pasif'] as const).map((st) => {
            const count =
              st === 'Semua'
                ? customers.length
                : customers.filter((c) => c.status === st).length;
            return (
              <button
                key={st}
                type="button"
                role="tab"
                aria-selected={statusFilter === st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, perusahaan, kota, email..."
              aria-label="Cari pelanggan"
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <label htmlFor="sort-customers" className="text-xs text-slate-500 whitespace-nowrap">
              Urutkan:
            </label>
            <select
              id="sort-customers"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'value' | 'name' | 'recent')}
              className="text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="value">Nilai Kontrak Tertinggi</option>
              <option value="recent">Kontak Terakhir</option>
              <option value="name">Nama Kontak (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-Density Customer Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-800">
              Tidak ada data pelanggan yang ditemukan
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Coba ubah kata kunci pencarian atau tambahkan kontak pelanggan baru.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              {(searchQuery || statusFilter !== 'Semua') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('Semua');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
              <button
                type="button"
                onClick={onOpenNewCustomer}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Tambah Pelanggan Pertama
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
                  <th className="py-3 px-4">Nama Kontak & Jabatan</th>
                  <th className="py-3 px-4">Perusahaan & Industri</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Kontak Langsung</th>
                  <th className="py-3 px-4 text-right">Total Nilai Deal</th>
                  <th className="py-3 px-4 text-right">Interaksi Terakhir</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    data-testid={`customer-row-${customer.id}`}
                    className="hover:bg-slate-50/90 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onSelectCustomer(customer.id)}
                        className="font-semibold text-slate-900 hover:text-blue-700 text-left block cursor-pointer"
                      >
                        {customer.name}
                      </button>
                      <span className="text-[11px] text-slate-500">
                        {customer.role} · {customer.location}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900">{customer.company}</p>
                      <p className="text-[11px] text-slate-500">{customer.industry}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderStatusIndicator(customer.status)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <p className="truncate max-w-[200px]">{customer.email}</p>
                      <p className="text-[11px] font-mono text-slate-500 tabular-nums">
                        {customer.phone}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                      <p className="font-semibold text-slate-900">
                        {formatIDR(customer.totalDealValue)}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {customer.dealCount} peluang
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500 tabular-nums whitespace-nowrap">
                      {customer.lastContactDate}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectCustomer(customer.id)}
                        aria-label={`Buka detail ${customer.name}`}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                      >
                        Detail & Catatan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, FileText, Calendar, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router';
import { useData } from '../context/DataContext';
import type { PatientStatus } from '../context/DataContext';

const STATUS_COLORS: Record<PatientStatus, string> = {
  Positive: 'bg-red-100 text-red-800',
  Negative: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
};

export function PatientRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PatientStatus | ''>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { patients, deletePatient } = useData();

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return patients.filter(p => {
      const name = `${p.firstName} ${p.lastName}`.toLowerCase();
      const matchesSearch = name.includes(q) || p.id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === '' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [patients, searchTerm, statusFilter]);

  const handleDelete = (id: string) => {
    deletePatient(id);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Records</h2>
          <p className="text-slate-500">Manage patient information and historical scans.</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={() => navigate('/patients/new')}>
          <Plus className="h-4 w-4" />
          Register Patient
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-4 bg-slate-50/50">
          <div className="max-w-md w-full">
            <Input
              placeholder="Search by Patient ID or Name..."
              icon={<Search className="h-4 w-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Calendar className="h-4 w-4 text-slate-400" />
            <select
              className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as PatientStatus | '')}
            >
              <option value="">All Status</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Patient ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Age / Gender</th>
                <th className="px-6 py-4 font-medium">Last Scan</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No patients found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((pt) => {
                  const dob = pt.dateOfBirth ? new Date(pt.dateOfBirth) : null;
                  const age = dob
                    ? Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                    : '—';
                  return (
                    <tr key={pt.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-6 py-4 font-medium text-slate-900">{pt.id}</td>
                      <td className="px-6 py-4 text-slate-700">{pt.firstName} {pt.lastName}</td>
                      <td className="px-6 py-4 text-slate-700">{age} / {pt.gender}</td>
                      <td className="px-6 py-4 text-slate-700">{pt.lastScanDate ?? '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[pt.status]}`}>
                          {pt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                            onClick={() => navigate(`/diagnosis/${pt.id}`)}
                          >
                            <FileText className="h-4 w-4 mr-1" /> Scan
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-slate-600 hover:text-slate-900"
                            onClick={() => navigate(`/diagnosis/${pt.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteId(pt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <p>Showing {filtered.length} of {patients.length} records</p>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Patient Record?</h3>
            <p className="text-sm text-slate-500 mb-6">
              This will permanently remove the patient record for <span className="font-medium text-slate-700">{deleteId}</span>. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

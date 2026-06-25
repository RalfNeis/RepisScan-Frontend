import React, { useState } from 'react';
import { Search, Plus, Eye, FileText, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router';

const mockPatients = [
  { id: 'PT-2024-001', name: 'Antonio Garcia', age: 45, gender: 'Male', lastScan: '2026-06-15', status: 'Positive' },
  { id: 'PT-2024-002', name: 'Carmen Bautista', age: 62, gender: 'Female', lastScan: '2026-06-12', status: 'Negative' },
  { id: 'PT-2024-003', name: 'Roberto Villanueva', age: 38, gender: 'Male', lastScan: '2026-06-10', status: 'Pending' },
  { id: 'PT-2024-004', name: 'Elena Cruz', age: 55, gender: 'Female', lastScan: '2026-06-08', status: 'Negative' },
  { id: 'PT-2024-005', name: 'Miguel Torres', age: 71, gender: 'Male', lastScan: '2026-06-05', status: 'Positive' },
];

export function PatientRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Filter by Date
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Patient ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Age / Gender</th>
                <th className="px-6 py-4 font-medium">Last Scan Date</th>
                <th className="px-6 py-4 font-medium">Recent Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockPatients.map((pt) => (
                <tr key={pt.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                  <td className="px-6 py-4 font-medium text-slate-900">{pt.id}</td>
                  <td className="px-6 py-4 text-slate-700">{pt.name}</td>
                  <td className="px-6 py-4 text-slate-700">{pt.age} / {pt.gender}</td>
                  <td className="px-6 py-4 text-slate-700">{pt.lastScan}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      pt.status === 'Positive' ? 'bg-red-100 text-red-800' : 
                      pt.status === 'Negative' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50" onClick={() => navigate('/diagnosis')}>
                        <FileText className="h-4 w-4 mr-1" /> Scan
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-600 hover:text-slate-900">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <p>Showing 1 to 5 of 124 records</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

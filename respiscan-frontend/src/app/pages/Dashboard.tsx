import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, FileText, Activity, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';

// Build a rolling 7-day scan activity chart from diagnosis records
function buildWeeklyData(records: ReturnType<typeof useData>['diagnosisRecords']) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayRecords = records.filter(r => r.date === dateStr);
    return {
      name: days[d.getDay()],
      scans: dayRecords.length,
      positive: dayRecords.filter(r => r.result === 'Positive').length,
    };
  });
}

export function Dashboard() {
  const { patients, diagnosisRecords } = useData();

  const totalPatients = patients.length;
  const totalScans = diagnosisRecords.length;
  const positiveDetections = diagnosisRecords.filter(r => r.result === 'Positive').length;
  const recentActivity = [...diagnosisRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const weeklyData = useMemo(() => buildWeeklyData(diagnosisRecords), [diagnosisRecords]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h2>
        <p className="text-slate-500">System summary and recent diagnostic activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Patients</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalPatients.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500">
              <span className="ml-0">Registered in the system</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">CXR Scans Processed</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalScans.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-teal-50 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500">
              <span>Total AI diagnoses run</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Positive Detections</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{positiveDetections.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600 font-medium">
                {totalScans > 0 ? ((positiveDetections / totalScans) * 100).toFixed(1) : 0}%
              </span>
              <span className="ml-2 text-slate-500">positivity rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Reviews</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {patients.filter(p => p.status === 'Pending').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500">
              <span>Awaiting diagnosis</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Scan Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="scans" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" name="Total Scans" />
                  <Area type="monotone" dataKey="positive" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorPositive)" name="Positive Detections" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No diagnoses yet.</p>
            ) : (
              <div className="space-y-6">
                {recentActivity.map((record, i) => (
                  <div key={record.id} className="flex gap-4">
                    <div className="relative mt-1">
                      {i < recentActivity.length - 1 && (
                        <div className="absolute top-3 bottom-0 left-1.5 w-0.5 bg-slate-200 -z-10" />
                      )}
                      <div className={`h-3 w-3 rounded-full ring-4 ring-white ${record.result === 'Positive' ? 'bg-red-500' : 'bg-teal-500'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {record.result === 'Positive' ? '⚠ Positive Detection' : '✓ Diagnosis Complete'}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{record.patientName} ({record.patientId})</p>
                      <p className="text-xs text-slate-400 mt-0.5">By {record.performedBy} · {record.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

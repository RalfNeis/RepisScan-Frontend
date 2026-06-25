import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Users, FileText, Activity, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Mon', scans: 12, positive: 3 },
  { name: 'Tue', scans: 19, positive: 5 },
  { name: 'Wed', scans: 15, positive: 2 },
  { name: 'Thu', scans: 22, positive: 7 },
  { name: 'Fri', scans: 28, positive: 8 },
  { name: 'Sat', scans: 14, positive: 4 },
  { name: 'Sun', scans: 8, positive: 1 },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h2>
        <p className="text-slate-500">System summary and recent diagnostic activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Patients</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">1,248</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span className="font-medium">+12%</span>
              <span className="ml-2 text-slate-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">CXR Scans Processed</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">3,842</p>
              </div>
              <div className="h-12 w-12 bg-teal-50 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span className="font-medium">+8%</span>
              <span className="ml-2 text-slate-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Positive Detections</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">426</p>
              </div>
              <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <span className="font-medium">+2%</span>
              <span className="ml-2 text-slate-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Reports Generated</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">2,105</p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span className="font-medium">+18%</span>
              <span className="ml-2 text-slate-500">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Scan Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs key="defs">
                    <linearGradient key="grad-scans" id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop key="scan-5" offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop key="scan-95" offset="95%" stopColor="#0D9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient key="grad-pos" id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                      <stop key="pos-5" offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop key="pos-95" offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    key="tooltip"
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area key="area-scans" type="monotone" dataKey="scans" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" name="Total Scans" />
                  <Area key="area-positive" type="monotone" dataKey="positive" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorPositive)" name="Positive Detections" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative mt-1">
                    <div className="absolute top-0 bottom-0 left-1.5 w-0.5 bg-slate-200 -z-10" />
                    <div className="h-3 w-3 rounded-full bg-teal-500 ring-4 ring-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Diagnosis Completed</p>
                    <p className="text-xs text-slate-500 mt-0.5">Patient ID: P-{2048 + i}</p>
                    <p className="text-xs text-slate-400 mt-1">{i * 15} minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

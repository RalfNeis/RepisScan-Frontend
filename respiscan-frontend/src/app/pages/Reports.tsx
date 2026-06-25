import React from 'react';
import { Download, FileText, Filter, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const barData = [
  { name: 'Jan', Scans: 400, Positive: 240 },
  { name: 'Feb', Scans: 300, Positive: 139 },
  { name: 'Mar', Scans: 200, Positive: 98 },
  { name: 'Apr', Scans: 278, Positive: 39 },
  { name: 'May', Scans: 189, Positive: 48 },
  { name: 'Jun', Scans: 239, Positive: 38 },
];

const pieData = [
  { name: 'Negative', value: 65, color: '#0ea5e9' },
  { name: 'Positive', value: 35, color: '#ef4444' },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h2>
          <p className="text-slate-500">System analytics and comprehensive diagnostic reporting.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" /> Last 6 Months
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Diagnosis Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip key="tooltip" cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend key="legend" iconType="circle" />
                  <Bar key="bar-scans" dataKey="Scans" fill="#0D9488" radius={[4, 4, 0, 0]} />
                  <Bar key="bar-positive" dataKey="Positive" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    key="pie"
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip key="tooltip" contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-4 space-y-3">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm text-slate-500">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 pb-4">
          <CardTitle>Generated System Reports</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </CardHeader>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Report Title</th>
                <th className="px-6 py-4 font-medium">Date Generated</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Generated By</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                { title: 'Monthly Clinical Summary', date: 'Jun 18, 2026', type: 'System', author: 'Dr. Santos' },
                { title: 'Patient PT-2024-001 Diagnostics', date: 'Jun 15, 2026', type: 'Clinical', author: 'Ana Reyes' },
                { title: 'Weekly Accuracy Metrics', date: 'Jun 14, 2026', type: 'Analytics', author: 'System Auto' },
              ].map((report, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    {report.title}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{report.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{report.author}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                      Download PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

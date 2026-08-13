import React, { useMemo } from 'react';
import { Download, FileText, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useData } from '../context/DataContext';

const PIE_COLORS = {
  Positive: '#ef4444',
  Negative: '#0ea5e9',
};

function getLast6MonthsBarData(records: ReturnType<typeof useData>['diagnosisRecords']) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = months[d.getMonth()];
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthRecords = records.filter(r => {
      const rd = new Date(r.date);
      return rd.getFullYear() === year && rd.getMonth() === month;
    });
    return {
      name: label,
      Scans: monthRecords.length,
      Positive: monthRecords.filter(r => r.result === 'Positive').length,
    };
  });
}

export function Reports() {
  const { diagnosisRecords, patients } = useData();

  const barData = useMemo(() => getLast6MonthsBarData(diagnosisRecords), [diagnosisRecords]);

  const positiveCount = diagnosisRecords.filter(r => r.result === 'Positive').length;
  const negativeCount = diagnosisRecords.filter(r => r.result === 'Negative').length;
  const total = positiveCount + negativeCount;

  const pieData = total > 0
    ? [
        { name: 'Negative', value: Math.round((negativeCount / total) * 100), count: negativeCount },
        { name: 'Positive', value: Math.round((positiveCount / total) * 100), count: positiveCount },
      ]
    : [
        { name: 'Negative', value: 0, count: 0 },
        { name: 'Positive', value: 0, count: 0 },
      ];

  // Build report list from recent diagnosis records
  const reportList = [...diagnosisRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h2>
          <p className="text-slate-500">System analytics and comprehensive diagnostic reporting.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans', value: diagnosisRecords.length, color: 'text-teal-600' },
          { label: 'Positive', value: positiveCount, color: 'text-red-600' },
          { label: 'Negative', value: negativeCount, color: 'text-sky-600' },
          { label: 'Positivity Rate', value: total > 0 ? `${((positiveCount / total) * 100).toFixed(1)}%` : '—', color: 'text-orange-600' },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Diagnosis Trends (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="Scans" fill="#0D9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Positive" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Detection Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {total === 0 ? (
              <p className="text-sm text-slate-400 py-16 text-center">No diagnosis data yet.</p>
            ) : (
              <>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [`${props.payload.count} cases (${value}%)`, name]}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full mt-2 space-y-3">
                  {pieData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[item.name as keyof typeof PIE_COLORS] }} />
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-sm text-slate-500">{item.count} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Diagnosis Record Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 pb-4">
          <CardTitle>Diagnosis Records</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </CardHeader>
        <div className="p-0">
          {reportList.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-12">No diagnosis records yet. Run a scan from the Diagnosis page.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Record ID</th>
                  <th className="px-6 py-4 font-medium">Patient</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Result</th>
                  <th className="px-6 py-4 font-medium">Confidence</th>
                  <th className="px-6 py-4 font-medium">Performed By</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportList.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors bg-white">
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      {record.id}
                    </td>
                    <td className="px-6 py-4 text-slate-700">{record.patientName} <span className="text-slate-400 text-xs">({record.patientId})</span></td>
                    <td className="px-6 py-4 text-slate-700">{record.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.result === 'Positive' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {record.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{record.confidence}%</td>
                    <td className="px-6 py-4 text-slate-700">{record.performedBy}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                        Download PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}

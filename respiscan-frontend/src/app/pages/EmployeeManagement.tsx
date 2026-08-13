import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useData } from '../context/DataContext';
import type { Employee } from '../context/DataContext';

type EmployeeFormData = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  jobTitle: string;
  department: string;
  status: 'Active' | 'Inactive';
};

const emptyForm: EmployeeFormData = {
  name: '',
  email: '',
  password: '',
  role: 'employee',
  jobTitle: '',
  department: '',
  status: 'Active',
};

function EmployeeModal({
  initial,
  onSave,
  onClose,
  isEdit,
}: {
  initial: EmployeeFormData;
  onSave: (data: EmployeeFormData) => void;
  onClose: () => void;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<EmployeeFormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  const set = (field: keyof EmployeeFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e: Partial<Record<keyof EmployeeFormData, string>> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!isEdit && !form.password.trim()) e.password = 'Required';
    if (!form.jobTitle.trim()) e.jobTitle = 'Required';
    if (!form.department.trim()) e.department = 'Required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  const Field = ({ label, field, type = 'text', required }: { label: string; field: keyof EmployeeFormData; type?: string; required?: boolean }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={form[field] as string}
        onChange={set(field)}
        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
      />
      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full Name" field="name" required />
          <Field label="Email Address" field="email" type="email" required />
          <Field label={isEdit ? 'New Password (leave blank to keep)' : 'Password'} field="password" type="password" required={!isEdit} />
          <Field label="Job Title" field="jobTitle" required />
          <Field label="Department" field="department" required />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Role *</label>
            <select
              value={form.role}
              onChange={set('role')}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="employee">Employee</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Status *</label>
            <select
              value={form.status}
              onChange={set('status')}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEdit ? 'Save Changes' : 'Add Employee'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'admin' | 'employee' | ''>('');
  const [modalState, setModalState] = useState<{ open: boolean; employee?: Employee }>({ open: false });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { employees, addEmployee, updateEmployee, deleteEmployee } = useData();

  const filtered = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSave = (data: EmployeeFormData) => {
    if (modalState.employee) {
      const updates: Partial<Employee> = {
        name: data.name,
        email: data.email,
        role: data.role,
        jobTitle: data.jobTitle,
        department: data.department,
        status: data.status,
      };
      if (data.password.trim()) updates.password = data.password;
      updateEmployee(modalState.employee.id, updates);
    } else {
      addEmployee(data);
    }
    setModalState({ open: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Management</h2>
          <p className="text-slate-500">Add, edit, and manage system user access.</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={() => setModalState({ open: true, employee: undefined })}>
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50">
          <div className="max-w-md w-full">
            <Input
              placeholder="Search by name, ID, or email..."
              icon={<Search className="h-4 w-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as 'admin' | 'employee' | '')}
            >
              <option value="">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Employee ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">No employees found.</td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="px-6 py-4 font-medium text-slate-900">{emp.id}</td>
                    <td className="px-6 py-4 text-slate-700">{emp.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{emp.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {emp.role === 'admin' ? 'Administrator' : 'Employee'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{emp.department}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-slate-400 hover:text-teal-600 transition-colors"
                          onClick={() => setModalState({ open: true, employee: emp })}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          onClick={() => setDeleteId(emp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <p>Showing {filtered.length} of {employees.length} employees</p>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {modalState.open && (
        <EmployeeModal
          isEdit={!!modalState.employee}
          initial={modalState.employee
            ? {
                name: modalState.employee.name,
                email: modalState.employee.email,
                password: '',
                role: modalState.employee.role,
                jobTitle: modalState.employee.jobTitle,
                department: modalState.employee.department,
                status: modalState.employee.status,
              }
            : emptyForm
          }
          onSave={handleSave}
          onClose={() => setModalState({ open: false })}
        />
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Remove Employee?</h3>
            <p className="text-sm text-slate-500 mb-6">
              This will permanently remove <span className="font-medium text-slate-700">{deleteId}</span> from the system.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                onClick={() => { deleteEmployee(deleteId); setDeleteId(null); }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

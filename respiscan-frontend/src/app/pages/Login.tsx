import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { HeartPulse, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth, type User } from '../context/AuthContext';
import { apiClient } from '../api/client';
import axios from 'axios';

type TabType = 'employee' | 'administrator';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('employee');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      // Map tab name to backend role value
      const role = activeTab === 'administrator' ? 'admin' : 'employee';
      const response = await apiClient.post('/auth/login/', { username, password, role });

      if (response.data.otp_required) {
        setError('Two-Factor Authentication is currently required but not yet supported in this UI.');
        return;
      }

      const userData: User = response.data;
      login(userData);
      navigate('/');

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const detail = err.response.data.detail || err.response.data.error || 'Invalid credentials. Please try again.';
        setError(detail);
      } else {
        setError('Network error. Please check your connection to the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const placeholder = activeTab === 'employee'
    ? 'Enter your employee email'
    : 'Enter your admin email';

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 rounded-full border-2 border-teal-400 bg-teal-50 flex items-center justify-center mb-4">
          <HeartPulse className="h-7 w-7 text-teal-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Repiscan</h1>
        <p className="mt-1 text-sm text-slate-500">
          AI-Powered <span className="font-semibold text-slate-600">Bacterial Pneumonia</span> Detection
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md px-8 pt-8 pb-9">
        <h2 className="text-center text-lg font-semibold text-slate-800 mb-5">
          Sign in to your account
        </h2>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('employee'); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === 'employee'
                ? 'bg-white shadow text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('administrator'); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === 'administrator'
                ? 'bg-white shadow text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Administrator
          </button>
        </div>

        <form onSubmit={handleLogin} noValidate className="space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Email / Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={placeholder}
                disabled={loading}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 accent-teal-600 border-slate-300 rounded cursor-pointer"
              />
              <span className="text-sm text-slate-700 select-none">Remember me</span>
            </label>
            <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-500 transition-colors">
              Forgot your password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-1 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

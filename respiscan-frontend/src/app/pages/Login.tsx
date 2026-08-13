import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { HeartPulse, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { getEmployeeByCredentials } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a small network delay
    setTimeout(() => {
      const employee = getEmployeeByCredentials(email, password);
      if (employee) {
        login({ id: employee.id, name: employee.name, role: employee.role, email: employee.email });
        navigate('/');
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-teal-600 p-3 shadow-lg shadow-teal-200">
            <HeartPulse className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          RespiScan
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          AI-Powered Bacterial Pneumonia Detection System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-center text-xl text-slate-800">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleLogin} noValidate>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                placeholder="Enter your email"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-4 w-4" />}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full text-base" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="mt-4 border border-slate-100 rounded-lg p-3 bg-slate-50 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-600 mb-1">Demo credentials:</p>
                <p><span className="font-medium">Admin:</span> admin@repiscan.com / admin123</p>
                <p><span className="font-medium">Employee:</span> employee@repiscan.com / employee123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

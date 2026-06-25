import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { HeartPulse, Lock, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<'admin' | 'employee'>('employee');
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role, email || `${role}@repiscan.com`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-teal-100 p-3">
            <HeartPulse className="h-10 w-10 text-teal-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Repiscan
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          AI-Powered Bacterial Pneumonia Detection
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
              <button
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${role === 'employee' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                onClick={() => setRole('employee')}
              >
                Employee
              </button>
              <button
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${role === 'admin' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                onClick={() => setRole('admin')}
              >
                Administrator
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                placeholder={`Enter your ${role} email`}
              />
              <Input
                label="Password"
                type="password"
                required
                icon={<Lock className="h-4 w-4" />}
                placeholder="••••••••"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full text-base">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

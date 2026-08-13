import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { HeartPulse, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth, type User } from '../context/AuthContext';
import { apiClient } from '../api/client';
import axios from 'axios';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      // Send login request to the Django backend
      const response = await apiClient.post('/auth/login/', { username, password });
      
      // Check if TOTP is required (2FA)
      if (response.data.otp_required) {
        setError('Two-Factor Authentication is currently required but not yet supported in this UI.');
        return;
      }

      // Backend returns user data directly (not wrapped in {user: ...})
      const userData: User = response.data;
      login(userData);
      navigate('/');
      
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // Handle specific API error responses
        const detail = err.response.data.detail || err.response.data.error || 'Invalid credentials or server error.';
        setError(detail);
      } else {
        setError('Network error. Please check your connection to the server.');
      }
    } finally {
      setLoading(false);
    }
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
          Clinical Portal Login
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
                label="Username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                placeholder="Enter your username"
                disabled={loading}
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
                  disabled={loading}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(v => !v)}
                  disabled={loading}
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
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, LogIn, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth(); // Global auth context

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'login' | 'verify' | 'forgot-email' | 'reset-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      navigate(user.role === 'client' ? '/client-dashboard' : '/expert-dashboard');
    }
  }, [user, navigate]);

  // Step 1: Login Check
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data } = await apiClient.post('/api/auth/login', { email, password });

      // If success, backend should prompt for verification
      if (data.requiresVerification) {
        setStep('verify');
        setMessage('Enter the code sent to your email.');
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Login Code
  const handleVerifyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data } = await apiClient.post('/api/auth/verify-login', { email, code: verificationCode });

      // Login successful
      login(data); // Update context
      navigate(data.role === 'client' ? '/client-dashboard' : '/expert-dashboard');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Forgot Password - Send Code
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await apiClient.post('/api/auth/forgot-password', { email });
      setStep('reset-password');
      setMessage('Verification code sent! Check your email.');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await apiClient.post('/api/auth/reset-password', {
        email,
        code: verificationCode,
        newPassword
      });
      alert('Password reset successful! Please login.');
      setStep('login');
      setPassword('');
      setVerificationCode('');
      setMessage('Password reset successful. Please login.');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-text-primary flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none overflow-hidden -z-10">
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <div className="glass-card p-8 shadow-2xl relative overflow-hidden">
            <h2 className="text-3xl font-bold mb-2">
              {step === 'login' && 'Welcome Back'}
              {step === 'verify' && 'Verify Login'}
              {step === 'forgot-email' && 'Reset Password'}
              {step === 'reset-password' && 'New Password'}
            </h2>
            <p className="text-text-secondary mb-8">
              {step === 'login' && 'Sign in to your account to continue.'}
              {step === 'verify' && 'We sent a 6-digit code to your email.'}
              {step === 'forgot-email' && 'Enter your email to receive a reset code.'}
              {step === 'reset-password' && 'Enter security code and new password.'}
            </p>

            {message && (
              <div className={`p-4 rounded-lg mb-6 text-sm ${message.includes('success') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {message}
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* LOGIN FORM */}
              {step === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary px-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-medium text-text-secondary">Password</label>
                      <button
                        type="button"
                        onClick={() => setStep('forgot-email')}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 group disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        Sign In <LogIn size={18} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {/* VERIFY CODE FORM (Login) */}
              {step === 'verify' && (
                <motion.form
                  key="verify"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyLogin}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary px-1">Verification Code</label>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20 tracking-widest text-lg"
                        placeholder="123456"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Login'}
                  </button>
                  <button type="button" onClick={() => setStep('login')} className="w-full text-center text-sm text-text-secondary hover:text-white mt-4">Cancel</button>
                </motion.form>
              )}

              {/* FORGOT PASSWORD FORM (Enter Email) */}
              {step === 'forgot-email' && (
                <motion.form
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleForgotPassword}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary px-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-white placeholder:text-white/20"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Code'}
                  </button>
                  <button type="button" onClick={() => setStep('login')} className="w-full text-center text-sm text-text-secondary hover:text-white mt-4">Back to Login</button>
                </motion.form>
              )}

              {/* RESET PASSWORD FORM (Code + New Password) */}
              {step === 'reset-password' && (
                <motion.form
                  key="reset"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleResetPassword}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary px-1">Verification Code</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 text-white tracking-widest"
                      placeholder="123456"
                      maxLength={6}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary px-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl py-3.5 px-4 outline-none focus:border-primary/50 text-white"
                      placeholder="Min. 6 characters"
                      required
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Set New Password'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {step === 'login' && (
              <p className="text-center text-text-secondary text-sm mt-8 py-2 border-t border-white/5">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:text-primary-hover transition-colors">Sign up</Link>
              </p>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LoginPage;

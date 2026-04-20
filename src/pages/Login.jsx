import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

/**
 * Login page — email/password + Google OAuth.
 */
export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = useCallback(async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const { success, error } = await login(form.email, form.password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      toast.error(error || 'Login failed');
    }
  }, [form, login, navigate]);



  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8">
          <span className="font-mono text-2xl text-accent">DevLog_</span>
          <p className="text-sm text-text-secondary mt-1">Sign in to your journal</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            id="login-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            id="login-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={errors.password}
            autoComplete="current-password"
          />

          <Button
            id="login-submit"
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="mt-1 w-full"
          >
            Sign in
          </Button>
        </form>



        <p className="text-xs text-text-secondary text-center mt-6">
          No account?{' '}
          <Link to="/register" className="text-accent hover:text-accent-hover transition-colors">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

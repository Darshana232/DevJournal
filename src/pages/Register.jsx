import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())              e.name     = 'Name is required';
    if (!form.email)                    e.email    = 'Email is required';
    if (form.password.length < 6)       e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm  = 'Passwords do not match';
    return e;
  };

  const handleSubmit = useCallback(async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    const { success, error } = await register(form.email, form.password, form.name);
    setLoading(false);
    if (success) {
      toast.success('Account created!');
      navigate('/dashboard');
    } else {
      toast.error(error || 'Registration failed');
    }
  }, [form, register, navigate]);



  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
    error: errors[key],
  });

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8">
          <span className="font-mono text-2xl text-accent">DevLog_</span>
          <p className="text-sm text-text-secondary mt-1">Create your journal</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input id="reg-name"     label="Display Name" type="text"     placeholder="Jane Doe"          {...field('name')}    autoComplete="name" />
          <Input id="reg-email"    label="Email"        type="email"    placeholder="you@example.com"   {...field('email')}   autoComplete="email" />
          <Input id="reg-password" label="Password"     type="password" placeholder="min 6 characters"  {...field('password')} autoComplete="new-password" />
          <Input id="reg-confirm"  label="Confirm"      type="password" placeholder="repeat password"   {...field('confirm')}  autoComplete="new-password" />

          <Button id="register-submit" type="submit" variant="primary" size="lg" loading={loading} className="mt-1 w-full">
            Create account
          </Button>
        </form>



        <p className="text-xs text-text-secondary text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../lib/cn';

const inputClass =
  'w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#FDFBF8] text-sm text-[#2B2622] hairline-border border-[#E7DCD1] focus:outline-none focus:ring-2 focus:ring-[#E2673F] placeholder:text-[#8E847A]';

function FormField({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E847A]" />
      <input className={inputClass} {...props} />
    </div>
  );
}

export function AuthModal() {
  const { authModal, closeAuthModal, login, register } = useAuth();
  const { addToast } = useToast();

  const [mode, setMode] = useState(authModal.mode);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset local form state whenever the modal opens or switches mode
  useEffect(() => {
    if (authModal.isOpen) {
      setMode(authModal.mode);
      setForm({ name: '', email: '', password: '' });
      setErrors([]);
      setShowPassword(false);
    }
  }, [authModal.isOpen, authModal.mode]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        await register(form);
        addToast(`Welcome, ${form.name.split(' ')[0]}! Your pantry will now sync across devices.`, 'success');
      } else {
        await login({ email: form.email, password: form.password });
        addToast('Welcome back!', 'success');
      }
      closeAuthModal();
    } catch (err) {
      const message = err?.message || 'Something went wrong. Please try again.';
      setErrors(err?.errors?.length ? err.errors : [message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRegister = mode === 'register';

  return (
    <Modal
      isOpen={authModal.isOpen}
      onClose={closeAuthModal}
      title={isRegister ? 'Create your account' : 'Welcome back'}
      subtitle={
        isRegister
          ? 'Save your pantry and favorite recipes across every device.'
          : 'Sign in to pick up right where you left off.'
      }
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <FormField
            icon={User}
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange('name')}
            autoComplete="name"
            required
          />
        )}

        <FormField
          icon={Mail}
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange('email')}
          autoComplete="email"
          required
        />

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E847A]" />
          <input
            className={cn(inputClass, 'pr-11')}
            type={showPassword ? 'text' : 'password'}
            placeholder={isRegister ? 'Password (min. 8 characters)' : 'Password'}
            value={form.password}
            onChange={handleChange('password')}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            minLength={8}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E847A] hover:text-[#2B2622]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {errors.length > 0 && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 space-y-1">
            {errors.map((msg, i) => (
              <p key={i} className="text-xs text-rose-700">
                {msg}
              </p>
            ))}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full justify-center"
          disabled={isSubmitting}
          icon={isRegister ? UserPlus : LogIn}
        >
          {isSubmitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
        </Button>

        <p className="text-center text-sm text-[#6B6259]">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setMode(isRegister ? 'login' : 'register')}
            className="text-[#E2673F] font-medium hover:underline"
          >
            {isRegister ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </form>
    </Modal>
  );
}

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Field';
import { PASSWORD_MIN_LENGTH } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage, getFieldErrors } from '@/lib/apiError';

import { AuthShell } from './AuthShell';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ userName: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field) {
    return (event) => setForm((previous) => ({ ...previous, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFieldErrors({});
    setError('');
    setIsSubmitting(true);

    try {
      await register({
        email: form.email.trim(),
        userName: form.userName.trim(),
        password: form.password,
      });
      toast.success('Account created!');
      navigate('/', { replace: true });
    } catch (submitError) {
      // ConflictException returns per-field messages for email/userName.
      const errors = getFieldErrors(submitError);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
      } else {
        setError(getErrorMessage(submitError, 'Could not create the account'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create an account"
      subtitle="Sign up and start building"
      error={error}
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Username"
          value={form.userName}
          onChange={update('userName')}
          error={fieldErrors.userName}
          autoComplete="username"
          autoFocus
          required
        />

        <TextInput
          label="Email"
          type="email"
          value={form.email}
          onChange={update('email')}
          error={fieldErrors.email}
          autoComplete="email"
          required
        />

        <TextInput
          label="Password"
          type="password"
          value={form.password}
          onChange={update('password')}
          error={fieldErrors.password}
          hint={`At least ${PASSWORD_MIN_LENGTH} characters`}
          minLength={PASSWORD_MIN_LENGTH}
          autoComplete="new-password"
          required
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}

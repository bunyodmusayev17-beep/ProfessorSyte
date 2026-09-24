import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Field';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/apiError';

import { AuthShell } from './AuthShell';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [emailOrUserName, setEmailOrUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(emailOrUserName.trim(), password);
      toast.success('Welcome back!');
      // Send the user back to whatever the route guard interrupted.
      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Incorrect username or password'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Sign in to pick up where you left off"
      error={error}
      footer={
        <>
          Don&#39;t have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Email or username"
          value={emailOrUserName}
          onChange={(event) => setEmailOrUserName(event.target.value)}
          autoComplete="username"
          autoFocus
          required
        />

        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}

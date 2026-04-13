import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || 'Password reset successfully!');
        setTimeout(() => navigate('/sign-in'), 2500);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-md mx-auto flex-col gap-6'>
        <div>
          <h1 className='text-2xl font-bold'>Set a new password</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Choose a strong password for your account.
          </p>
        </div>

        {success ? (
          <>
            <Alert color='success'>{success}</Alert>
            <p className='text-sm text-gray-500 text-center'>Redirecting to sign in…</p>
          </>
        ) : (
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='New password' />
              <TextInput
                type='password'
                placeholder='At least 6 characters'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label value='Confirm password' />
              <TextInput
                type='password'
                placeholder='Repeat password'
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <Button gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Resetting...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
            {error && <Alert color='failure'>{error}</Alert>}
          </form>
        )}

        <div className='text-sm text-center'>
          <Link to='/sign-in' className='text-indigo-500 hover:underline'>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email address');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || 'Check your inbox for the reset link.');
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
          <h1 className='text-2xl font-bold'>Forgot your password?</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {success ? (
          <Alert color='success'>{success}</Alert>
        ) : (
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Email address' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
              />
            </div>
            <Button gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Sending...</span>
                </>
              ) : (
                'Send Reset Link'
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

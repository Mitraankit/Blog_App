import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useTimedError } from '../hooks/useTimedError';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useTimedError();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setErrorMessage('Please fill all the fields');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return setErrorMessage(data.message || 'Sign in failed');
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-3 py-1 bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-700 rounded-lg text-white'>
              Verso
            </span>
          </Link>
          <p className='text-sm mt-5 text-gray-500 dark:text-gray-400'>
            Welcome back. Sign in to read, write, and connect with ideas that matter.
          </p>
        </div>

        {/* right */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput type='email' placeholder='name@company.com' id='email' onChange={handleChange} />
            </div>
            <div>
              <Label value='Your password' />
              <div className='relative'>
                <TextInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder='**********'
                  id='password'
                  onChange={handleChange}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                >
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
            </div>
            <Button gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
              {loading ? <><Spinner size='sm' /><span className='pl-3'>Loading...</span></> : 'Sign In'}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
          </div>
          <div className='text-sm mt-2'>
            <Link to='/forgot-password' className='text-indigo-500 hover:underline'>Forgot your password?</Link>
          </div>
          {errorMessage && <Alert className='mt-5' color='failure'>{errorMessage}</Alert>}
        </div>
      </div>
    </div>
  );
}

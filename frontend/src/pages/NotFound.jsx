import { Link } from 'react-router-dom';
import { HiOutlineEmojiSad } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[70vh] px-4 text-center gap-4'>
      <HiOutlineEmojiSad className='text-indigo-300 dark:text-indigo-500' size={100} />
      <h1 className='text-8xl font-bold text-indigo-500'>404</h1>
      <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200'>Page not found</h2>
      <p className='text-gray-500 text-sm max-w-sm'>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to='/'
        className='mt-2 px-6 py-2 rounded-full bg-indigo-500 text-white text-sm font-medium hover:opacity-90 transition-opacity'
      >
        Back to home
      </Link>
    </div>
  );
}

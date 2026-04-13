import { useState } from 'react';
import { Link } from 'react-router-dom';
const IconGithub = () => <svg viewBox='0 0 24 24' width='20' height='20' fill='currentColor'><path d='M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z'/></svg>;
const IconTwitter = () => <svg viewBox='0 0 24 24' width='20' height='20' fill='currentColor'><path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/></svg>;
const IconInstagram = () => <svg viewBox='0 0 24 24' width='20' height='20' fill='currentColor'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z'/></svg>;
const IconLinkedin = () => <svg viewBox='0 0 24 24' width='20' height='20' fill='currentColor'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>;

export default function FooterCom() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMsg(data.message);
    setEmail('');
  };

  return (
    <footer className='border-t-4 border-indigo-500 bg-white dark:bg-gray-900 pt-10 pb-6 px-6' style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}>
      <div className='max-w-6xl mx-auto'>

        {/* Top row */}
        <div className='grid grid-cols-1 sm:grid-cols-4 gap-10 mb-10'>

          {/* Brand + Newsletter */}
          <div className='sm:col-span-2 flex flex-col gap-3'>
            <Link to='/' className='self-start whitespace-nowrap text-xl font-semibold dark:text-white' aria-label='Verso home'>
              <span className='px-3 py-1 bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-700 rounded-lg text-white'>
                Verso
              </span>
            </Link>
            <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
              A space for thoughts, stories, and ideas — written with curiosity and shared with the world.
            </p>
            <form onSubmit={handleSubscribe} className='flex flex-col gap-2 mt-2'>
              <p className='text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-400'>Newsletter</p>
              <div className='flex gap-2'>
                <input
                  type='email'
                  placeholder='your@email.com'
                  aria-label='Email address for newsletter'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='flex-1 text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:border-indigo-500 text-gray-800 dark:text-gray-200'
                />
                <button
                  type='submit'
                  className='text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-700 text-white font-medium hover:opacity-90 transition-opacity whitespace-nowrap'
                >
                  Subscribe
                </button>
              </div>
              <p className='text-xs text-indigo-600 dark:text-indigo-400 min-h-[1rem]'>{msg}</p>
            </form>
          </div>

          {/* Explore + Links side by side on mobile */}
          <div className='grid grid-cols-2 sm:contents gap-6'>

            {/* Explore */}
            <div>
              <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3'>
                Explore
              </h3>
              <ul className='flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400'>
                <li><Link to='/' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>Home</Link></li>
                <li><Link to='/about' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>About</Link></li>
                <li><Link to='/projects' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>Projects</Link></li>
                <li><Link to='/gallery' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>Gallery</Link></li>
              </ul>
            </div>

            {/* Links */}
            <div>
              <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3'>
                Links
              </h3>
              <ul className='flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400'>
                <li>
                  <a href='https://github.com/Mitraankit' target='_blank' rel='noopener noreferrer' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                    GitHub
                  </a>
                </li>
                <li><Link to='/search' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>All Posts</Link></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Legal */}
        <div className='flex flex-wrap gap-x-6 gap-y-1 mb-6 text-sm text-gray-600 dark:text-gray-400'>
          <a href='#' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>Privacy Policy</a>
          <a href='#' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>Terms &amp; Conditions</a>
        </div>

        {/* Divider + bottom row */}
        <div className='border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            &copy; {new Date().getFullYear()}{' '}
            <span className='font-medium text-gray-800 dark:text-gray-200'>Verso</span>. All rights reserved.
          </p>
          <div className='flex gap-5 text-gray-500 dark:text-gray-400'>
            <a href='https://github.com/Mitraankit' target='_blank' rel='noopener noreferrer' aria-label='GitHub' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
              <IconGithub />
            </a>
            <a href='#' aria-label='Twitter' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
              <IconTwitter />
            </a>
            <a href='https://www.instagram.com/ank._.1t/' target='_blank' rel='noopener noreferrer' aria-label='Instagram' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
              <IconInstagram />
            </a>
            <a href='https://www.linkedin.com/in/ankit-kumar-b1583723a/' target='_blank' rel='noopener noreferrer' aria-label='LinkedIn' className='hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
              <IconLinkedin />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

import { HiPencilAlt, HiSearch, HiMoon, HiSun, HiMenu, HiX } from 'react-icons/hi';
import { cloudinaryUrl } from '../utils/cloudinary';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (currentUser?.theme) dispatch(setTheme(currentUser.theme));
  }, [currentUser, dispatch]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const s = urlParams.get('searchTerm');
    if (s) setSearchTerm(s);
  }, [location.search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleThemeToggle = async () => {
    dispatch(toggleTheme());
    const newTheme = theme === 'light' ? 'dark' : 'light';
    if (currentUser) {
      await fetch('/api/user/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
      });
    }
  };

  const handleSignout = async () => {
    setDropdownOpen(false);
    try {
      const res = await fetch('/api/user/signout', { method: 'POST' });
      if (res.ok) dispatch(signoutSuccess());
    } catch (error) {
      if (import.meta.env.DEV) console.error(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors hover:text-indigo-500 ${
        path === to ? 'text-indigo-500' : 'text-gray-600 dark:text-gray-300'
      }`}
    >
      {label}
    </Link>
  );

  const iconBtn = 'flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors';

  return (
    <nav className='border-b-2 px-3 sm:px-6 py-3 sticky top-0 z-50 bg-white dark:bg-gray-900 flex flex-wrap items-center'>

      {/* Logo */}
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-3 py-1 bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-700 rounded-lg text-white'>
          Verso
        </span>
      </Link>

      {/* Desktop search */}
      <form onSubmit={handleSubmit} className='ml-8 hidden lg:block'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='h-10 w-80 pl-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500'
          />
          <button type='submit' className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
            <HiSearch size={16} />
          </button>
        </div>
      </form>

      {/* Right side */}
      <div className='flex items-center gap-2 sm:gap-3 ml-auto flex-nowrap'>

        {/* Mobile search */}
        <button onClick={() => navigate('/search')} aria-label='Search' className={`lg:hidden ${iconBtn}`}>
          <HiSearch size={18} className='text-gray-600 dark:text-gray-300' />
        </button>

        {/* Desktop nav links */}
        <div className='hidden md:flex items-center gap-6 mr-2'>
          {navLink('/', 'Home')}
          {navLink('/about', 'About')}
          {navLink('/projects', 'Projects')}
          {navLink('/gallery', 'Gallery')}
          {navLink('/search', 'All Posts')}
        </div>

        {/* New Post — admin */}
        {currentUser?.isAdmin && (
          <Link to='/create-post' title='New Post'>
            <button aria-label='New Post' className='flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-700 text-white hover:opacity-90 transition-opacity'>
              <HiPencilAlt size={18} />
            </button>
          </Link>
        )}

        {/* Theme toggle — desktop only */}
        <button
          onClick={handleThemeToggle}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className={`hidden md:flex ${iconBtn}`}
        >
          {theme === 'light' ? <HiMoon size={16} className='text-gray-600' /> : <HiSun size={16} className='text-yellow-400' />}
        </button>

        {/* Avatar dropdown or Sign In */}
        {currentUser ? (
          <div className='relative' ref={dropdownRef}>
            <button onClick={() => setDropdownOpen((o) => !o)} aria-label='User menu'>
              <img
                src={cloudinaryUrl(currentUser.profilePicture, { w: 80, h: 80 })}
                alt='user'
                className='w-10 h-10 rounded-full object-cover border-2 border-indigo-400 cursor-pointer flex-shrink-0'
              />
            </button>
            {dropdownOpen && (
              <div className='absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50'>
                <div className='px-4 py-2 border-b border-gray-100 dark:border-gray-700'>
                  <p className='text-sm font-medium text-gray-800 dark:text-gray-200 truncate'>@{currentUser.username}</p>
                  <p className='text-xs text-gray-500 truncate'>{currentUser.email}</p>
                </div>
                <Link
                  to='/dashboard?tab=profile'
                  onClick={() => setDropdownOpen(false)}
                  className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignout}
                  className='w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to='/sign-in'>
            <button className='flex items-center justify-center h-10 px-3 sm:px-4 rounded-full border-2 border-indigo-500 text-indigo-500 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors whitespace-nowrap'>
              Sign In
            </button>
          </Link>
        )}

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className={`md:hidden ${iconBtn}`}
        >
          {menuOpen ? <HiX size={18} className='text-red-400' /> : <HiMenu size={18} className='text-gray-600 dark:text-gray-300' />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-b border-gray-200 dark:border-gray-700 px-3 pt-2 pb-3 flex flex-col gap-1 shadow-lg'>
          {[['/', 'Home'], ['/about', 'About'], ['/projects', 'Projects'], ['/gallery', 'Gallery'], ['/search', 'All Posts']].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                path === to
                  ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {label}
            </Link>
          ))}
          {currentUser?.isAdmin && (
            <Link
              to='/create-post'
              onClick={() => setMenuOpen(false)}
              className='px-3 py-2 rounded-lg text-sm font-medium text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors'
            >
              + New Post
            </Link>
          )}
          <div className='border-t border-gray-200 dark:border-gray-700 mt-2 pt-2'>
            <button
              onClick={handleThemeToggle}
              className='w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            >
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              {theme === 'light' ? <HiMoon size={15} className='text-gray-500' /> : <HiSun size={15} className='text-yellow-400' />}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

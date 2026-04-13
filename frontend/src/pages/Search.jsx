import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { SkeletonCard } from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

const PAGE_SIZE = 9;

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className='flex items-center justify-center gap-1 mt-8 flex-wrap'>
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className='px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
      >
        ‹ Prev
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className='px-2 text-gray-400'>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              p === page
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className='px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
      >
        Next ›
      </button>
    </div>
  );
}

export default function Search() {
  const [sidebarData, setSidebarData] = useState({ searchTerm: '', sort: 'desc', category: '' });
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(sidebarData.searchTerm);

  useEffect(() => {
    fetch('/api/post/categories')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data); });
  }, []);

  // Sync URL → state on load
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setSidebarData({
      searchTerm: urlParams.get('searchTerm') || '',
      sort: urlParams.get('sort') || 'desc',
      category: urlParams.get('category') || '',
    });
    setPage(parseInt(urlParams.get('page')) || 1);
  }, [location.search]);

  const fetchPosts = useCallback(async (params) => {
    setLoading(true);
    const res = await fetch(`/api/post/getposts?${params}`);
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts);
      const total = data.filteredTotal ?? data.posts.length;
      setTotalResults(total);
      setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('searchTerm', debouncedSearch);
    if (sidebarData.sort) params.set('sort', sidebarData.sort);
    if (sidebarData.category) params.set('category', sidebarData.category);
    params.set('limit', PAGE_SIZE);
    params.set('startIndex', (page - 1) * PAGE_SIZE);
    fetchPosts(params.toString());
  }, [debouncedSearch, sidebarData.sort, sidebarData.category, page, fetchPosts]);

  const handleChange = (e) => {
    const updated = { ...sidebarData, [e.target.id]: e.target.value };
    setSidebarData(updated);
    setPage(1);
    const params = new URLSearchParams();
    if (updated.searchTerm) params.set('searchTerm', updated.searchTerm);
    params.set('sort', updated.sort);
    if (updated.category) params.set('category', updated.category);
    params.set('page', '1');
    navigate(`/search?${params.toString()}`, { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (sidebarData.searchTerm) params.set('searchTerm', sidebarData.searchTerm);
    params.set('sort', sidebarData.sort);
    if (sidebarData.category) params.set('category', sidebarData.category);
    params.set('page', '1');
    navigate(`/search?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const params = new URLSearchParams(location.search);
    params.set('page', String(newPage));
    navigate(`/search?${params.toString()}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      {/* Sidebar filters */}
      <div className='p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 md:w-64 flex-shrink-0'>
        <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-600 dark:text-gray-400'>Search</label>
            <TextInput
              placeholder='Type to search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-600 dark:text-gray-400'>Sort</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest first</option>
              <option value='asc'>Oldest first</option>
            </Select>
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-600 dark:text-gray-400'>Category</label>
            <Select onChange={handleChange} value={sidebarData.category} id='category'>
              <option value=''>All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToBlue'>
            Apply Filters
          </Button>
        </form>
      </div>

      {/* Results */}
      <div className='flex-1 p-6'>
        <h1 className='text-2xl font-semibold mb-6 pb-3 border-b border-gray-200 dark:border-gray-700'>
          {loading
            ? 'Searching...'
            : `${totalResults} result${totalResults !== 1 ? 's' : ''}${totalPages > 1 ? ` · page ${page} of ${totalPages}` : ''}`}
        </h1>

        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon='🔍'
            title='No posts found'
            description='Try a different search term or category.'
          />
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
              {posts.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}

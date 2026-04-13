import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { SkeletonCard } from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const prefetch = window.__prefetch_posts__;
      window.__prefetch_posts__ = null;
      const data = prefetch
        ? await prefetch
        : await fetch('/api/post/getposts?limit=6').then((r) => r.json());
      setPosts(data?.posts ?? []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className='flex flex-col gap-4 pt-14 pb-8 px-6 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to Verso</h1>
        <p className='text-gray-500 text-xs sm:text-sm max-w-xl'>
          A space for thoughts, stories, and ideas — written with curiosity, shared with the world.
        </p>
      </div>

      <div className='max-w-6xl mx-auto px-4 pb-12 flex flex-col gap-6'>
        <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon='📝'
            title='No posts yet'
            description='Check back soon — stories are on their way.'
            action={<Link to='/search' className='text-indigo-500 text-sm hover:underline'>Browse all posts</Link>}
          />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {posts.map((post, i) => <PostCard key={post._id} post={post} priority={i === 0} />)}
          </div>
        )}
      </div>
    </div>
  );
}

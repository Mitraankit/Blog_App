import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import PostCard from '../components/PostCard';

export default function Author() {
  const { username } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await fetch(`/api/user/username/${username}`);
        const data = await res.json();
        if (!res.ok) { setLoading(false); return; }
        setAuthor(data);
        document.title = `${data.username} | Verso`;
        const postsRes = await fetch(`/api/post/getposts?userId=${data._id}&limit=12`);
        const postsData = await postsRes.json();
        if (postsRes.ok) setPosts(postsData.posts);
      } catch (error) {
        if (import.meta.env.DEV) console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
    return () => { document.title = 'Verso'; };
  }, [username]);

  if (loading) return (
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  );

  if (!author) return (
    <div className='flex justify-center items-center min-h-screen'>
      <p className='text-gray-500'>Author not found.</p>
    </div>
  );

  return (
    <div className='max-w-5xl mx-auto px-6 py-12 min-h-screen'>

      {/* Profile card */}
      <div className='flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-12 p-6 rounded-2xl border border-gray-200 dark:border-gray-700'>
        <img
          src={author.profilePicture}
          alt={author.username}
          className='w-24 h-24 rounded-full object-cover border-4 border-indigo-400'
        />
        <div className='flex flex-col gap-2 text-center sm:text-left'>
          <h1 className='text-2xl font-bold'>@{author.username}</h1>
          {author.bio && <p className='text-gray-500 max-w-xl'>{author.bio}</p>}
          <p className='text-sm text-gray-400'>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
          </p>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <p className='text-center text-gray-500'>No posts yet.</p>
      ) : (
        <>
          <h2 className='text-xl font-semibold mb-6'>Posts by {author.username}</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        </>
      )}
    </div>
  );
}

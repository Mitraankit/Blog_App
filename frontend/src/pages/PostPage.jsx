import { Button, Tooltip } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiHeart, HiOutlineHeart, HiBookmark, HiOutlineBookmark, HiShare, HiExternalLink, HiLink } from 'react-icons/hi';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { SkeletonPost } from '../components/SkeletonCard';
import { useSEO } from '../hooks/useSEO';
import { cloudinaryUrl } from '../utils/cloudinary';

const REACTIONS = [
  { key: 'fire', emoji: '🔥', label: 'Fire' },
  { key: 'bulb', emoji: '💡', label: 'Insightful' },
  { key: 'clap', emoji: '👏', label: 'Clap' },
];

export default function PostPage() {
  const { postSlug } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reactions, setReactions] = useState({ fire: [], bulb: [], clap: [] });
  const [toc, setToc] = useState([]);
  const [readPercent, setReadPercent] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (res.ok) {
          const p = data.posts[0];
          setPost(p);
          setLikeCount(p.likes?.length || 0);
          setLiked(currentUser ? p.likes?.includes(currentUser._id) : false);
          setBookmarked(currentUser ? p.bookmarks?.includes(currentUser._id) : false);
          setReactions(p.reactions || { fire: [], bulb: [], clap: [] });
          fetch(`/api/post/view/${p._id}`, { method: 'PUT' });
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug, currentUser]);

  useEffect(() => {
    if (!contentRef.current) return;
    const headings = Array.from(contentRef.current.querySelectorAll('h1, h2, h3'));
    headings.forEach((h, i) => { if (!h.id) h.id = `heading-${i}`; });
    setToc(headings.map((h) => ({ id: h.id, text: h.innerText, level: parseInt(h.tagName[1]) })));
  }, [post]);

  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      setReadPercent(Math.min(100, Math.round((scrolled / el.offsetHeight) * 100)));
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [post]);

  useEffect(() => {
    if (!post) return;
    const fetchRelated = async () => {
      const res = await fetch(`/api/post/getposts?category=${post.category}&limit=4`);
      const data = await res.json();
      if (res.ok) setRelatedPosts(data.posts.filter((p) => p._id !== post._id).slice(0, 3));
    };
    fetchRelated();
  }, [post]);

  const handleLike = async () => {
    if (!currentUser) return;
    // Optimistic update
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    const res = await fetch(`/api/post/like/${post._id}`, { method: 'PUT' });
    if (!res.ok) {
      // Revert on failure
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  const handleBookmark = async () => {
    if (!currentUser) return;
    // Optimistic update
    setBookmarked((prev) => !prev);
    const res = await fetch(`/api/post/bookmark/${post._id}`, { method: 'PUT' });
    if (!res.ok) setBookmarked((prev) => !prev); // Revert on failure
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReact = async (type) => {
    if (!currentUser) return;
    const res = await fetch(`/api/post/react/${post._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    if (res.ok) setReactions(await res.json());
  };

  const readingTime = post
    ? Math.max(1, Math.ceil(post.content.replace(/<[^>]+>/g, '').split(/\s+/).length / 200))
    : 0;

  const plainDesc = post
    ? post.content.replace(/<[^>]+>/g, '').slice(0, 160).trim()
    : '';

  useSEO({
    title: post ? `${post.title} | Verso` : 'Verso',
    description: plainDesc,
    image: post?.image,
    url: window.location.href,
  });

  if (loading) return <SkeletonPost />;

  // Consistent reading width used by all sections
  const W = 'w-full max-w-3xl mx-auto';

  return (
    <main className='flex flex-col max-w-6xl mx-auto min-h-screen px-4 sm:px-6'>

      {/* Read progress bar */}
      <div className='fixed top-14 left-0 z-50 h-1 bg-gradient-to-r from-indigo-500 to-blue-700 transition-all duration-150'
        style={{ width: `${readPercent}%` }} />

      {/* Read % badge */}
      {readPercent > 0 && readPercent < 100 && (
        <div className='hidden sm:block fixed bottom-16 left-4 z-40 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow'>
          {readPercent}%
        </div>
      )}

      {/* Title */}
      <h1 className={`text-2xl sm:text-3xl lg:text-4xl mt-8 sm:mt-10 text-center font-serif leading-snug ${W}`}>
        {post?.title}
      </h1>

      {/* Category + Tags */}
      <div className={`flex items-center justify-center gap-2 mt-4 flex-wrap ${W}`}>
        <Link to={`/search?category=${post?.category}`}>
          <Button color='gray' pill size='xs'>{post?.category}</Button>
        </Link>
        {post?.tags?.map((tag) => (
          <Link key={tag} to={`/search?tag=${tag}`}>
            <span className='text-xs px-2 py-1 rounded-full border border-indigo-400 text-indigo-600 dark:text-indigo-400'>
              #{tag}
            </span>
          </Link>
        ))}
      </div>

      {/* Cover image — intentionally full width */}
      <img
        src={cloudinaryUrl(post?.image, { w: 1200, h: 500 })}
        alt={post?.title}
        className='mt-6 rounded-xl max-h-[400px] sm:max-h-[500px] w-full object-cover'
        loading='lazy'
      />

      {/* Meta bar */}
      <div className={`flex flex-wrap justify-between items-center py-3 border-b border-slate-300 dark:border-slate-600 text-xs gap-y-2 mt-2 ${W}`}>
        <div className='flex gap-2 items-center flex-wrap'>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className='text-gray-400'>·</span>
          <span className='italic'>{readingTime} min read</span>
          {post?.views > 0 && (
            <><span className='text-gray-400'>·</span>
            <span className='text-gray-400'>{post.views} views</span></>
          )}
        </div>
        <div className='flex items-center gap-3'>
          <Tooltip content={currentUser ? (liked ? 'Unlike' : 'Like') : 'Sign in to like'}>
            <button onClick={handleLike} className='flex items-center gap-1 hover:text-red-500 transition-colors'>
              {liked ? <HiHeart className='text-red-500' size={16} /> : <HiOutlineHeart size={16} />}
              <span>{likeCount}</span>
            </button>
          </Tooltip>
          <Tooltip content={currentUser ? (bookmarked ? 'Remove bookmark' : 'Bookmark') : 'Sign in to bookmark'}>
            <button onClick={handleBookmark} className='hover:text-indigo-500 transition-colors'>
              {bookmarked ? <HiBookmark className='text-indigo-500' size={14} /> : <HiOutlineBookmark size={14} />}
            </button>
          </Tooltip>
          <Tooltip content={copied ? 'Copied!' : 'Copy link'}>
            <button onClick={handleCopyLink} className='hover:text-indigo-500 transition-colors'>
              <HiLink size={16} />
            </button>
          </Tooltip>
          <Tooltip content='Share on Twitter'>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title || '')}`}
              target='_blank' rel='noopener noreferrer' className='hover:text-blue-400 transition-colors'>
              <HiShare size={14} />
            </a>
          </Tooltip>
          <Tooltip content='Share on LinkedIn'>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target='_blank' rel='noopener noreferrer' className='hover:text-blue-600 transition-colors'>
              <HiExternalLink size={14} />
            </a>
          </Tooltip>
        </div>
      </div>

      {/* TOC + Content */}
      <div className={`flex gap-10 mt-6 ${W} ${toc.length > 1 ? 'lg:max-w-5xl' : ''}`}>
        {toc.length > 1 && (
          <aside className='hidden lg:block w-52 flex-shrink-0'>
            <div className='sticky top-20 p-4 rounded-xl border border-gray-200 dark:border-gray-700'>
              <p className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3'>Contents</p>
              <ul className='flex flex-col gap-2'>
                {toc.map((item) => (
                  <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 10}px` }}>
                    <a href={`#${item.id}`}
                      className='text-xs text-gray-500 hover:text-indigo-500 transition-colors line-clamp-2'>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
        <div
          ref={contentRef}
          className='flex-1 min-w-0 post-content'
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />
      </div>

      {/* Reactions */}
      <div className={`flex flex-wrap items-center justify-center gap-4 sm:gap-6 my-8 p-4 rounded-xl border border-gray-200 dark:border-gray-700 ${W}`}>
        <p className='text-sm text-gray-500 font-medium'>Reactions</p>
        {REACTIONS.map(({ key, emoji, label }) => {
          const count = reactions[key]?.length || 0;
          const reacted = currentUser && reactions[key]?.includes(currentUser._id);
          return (
            <Tooltip key={key} content={currentUser ? label : 'Sign in to react'}>
              <button
                onClick={() => handleReact(key)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  reacted ? 'bg-indigo-50 dark:bg-indigo-900/30 scale-110' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className='text-2xl'>{emoji}</span>
                <span className='text-xs font-medium text-gray-600 dark:text-gray-400'>{count}</span>
              </button>
            </Tooltip>
          );
        })}
      </div>

      <div className={W}>
        <CommentSection postId={post._id} />
      </div>

      {relatedPosts.length > 0 && (
        <div className='flex flex-col items-center mb-8 mt-4 w-full'>
          <h2 className='text-xl font-semibold mb-4'>Related Articles</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full'>
            {relatedPosts.map((p) => <PostCard key={p._id} post={p} />)}
          </div>
        </div>
      )}
    </main>
  );
}

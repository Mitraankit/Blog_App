import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { cloudinaryUrl } from '../utils/cloudinary';

export default function PostCard({ post, priority = false }) {
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority && imgRef.current) {
      imgRef.current.setAttribute('fetchpriority', 'high');
    }
  }, [priority]);

  const readTime = Math.max(
    1,
    Math.ceil(post.content.replace(/<[^>]+>/g, '').split(/\s+/).length / 200)
  );

  return (
    <div className='group relative w-full border border-indigo-500 hover:border-2 rounded-lg overflow-hidden transition-all flex flex-col'>

      <Link to={`/post/${post.slug}`}>
        <img
          ref={imgRef}
          src={cloudinaryUrl(post.image, { w: 400, h: 260 })}
          alt='post cover'
          width='400'
          height='260'
          className='h-[260px] w-full object-cover transition-all duration-300 group-hover:h-[250px]'
          loading={priority ? 'eager' : 'lazy'}
        />
      </Link>

      <div className='p-3 flex flex-col flex-1 justify-between gap-2'>
        <div>
          <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
          <div className='flex items-center justify-between mt-1'>
            <span className='italic text-sm'>{post.category}</span>
            <span className='text-xs text-gray-400'>{readTime} min read</span>
          </div>
        </div>
        <Link
          to={`/post/${post.slug}`}
          className='mt-3 border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    image: PropTypes.string,
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    content: PropTypes.string.isRequired,
  }).isRequired,
  priority: PropTypes.bool,
};

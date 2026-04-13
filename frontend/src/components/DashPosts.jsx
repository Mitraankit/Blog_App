import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import EmptyState from './EmptyState';
import Pagination from './Pagination';
import { SkeletonTable } from './SkeletonCard';

const PAGE_SIZE = 9;

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    if (!currentUser.isAdmin) return;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/post/getposts?userId=${currentUser._id}&limit=${PAGE_SIZE}&startIndex=${(page - 1) * PAGE_SIZE}&status=all`
        );
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          setTotalPages(Math.max(1, Math.ceil((data.filteredTotal ?? data.posts.length) / PAGE_SIZE)));
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentUser._id, currentUser.isAdmin, page]);

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, { method: 'DELETE' });
      if (res.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error(error.message);
    }
  };

  if (loading) return <SkeletonTable rows={PAGE_SIZE} cols={6} />;

  return (
    <div className='w-full overflow-x-auto'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <div className='rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700'>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
              </Table.Head>
              {userPosts.map((post) => (
                <Table.Body key={post._id} className='divide-y'>
                  <Table.Row className='dark:border-gray-700'>
                    <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500 rounded' />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => { setShowModal(true); setPostIdToDelete(post._id); }}
                        className='font-medium text-red-500 hover:underline'
                      >
                        Delete
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className='text-indigo-500 hover:underline' to={`/update-post/${post._id}`}>Edit</Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </>
      ) : (
        <EmptyState
          icon='📝'
          title='No posts yet'
          description='Start writing your first post to see it here.'
          action={
            currentUser.isAdmin && (
              <Link to='/create-post'>
                <Button gradientDuoTone='purpleToBlue' size='sm'>Create Post</Button>
              </Link>
            )
          }
        />
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

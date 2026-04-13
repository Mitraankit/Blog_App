import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import EmptyState from './EmptyState';
import Pagination from './Pagination';
import { SkeletonTable } from './SkeletonCard';

const PAGE_SIZE = 9;

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    if (!currentUser.isAdmin) return;
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/comment/getcomments?limit=${PAGE_SIZE}&startIndex=${(page - 1) * PAGE_SIZE}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalPages(Math.max(1, Math.ceil(data.totalComments / PAGE_SIZE)));
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [currentUser._id, currentUser.isAdmin, page]);

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, { method: 'DELETE' });
      if (res.ok) setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete));
    } catch (error) {
      if (import.meta.env.DEV) console.error(error.message);
    }
  };

  if (loading) return <SkeletonTable rows={PAGE_SIZE} cols={6} />;

  return (
    <div className='w-full overflow-x-auto'>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <div className='rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700'>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Date updated</Table.HeadCell>
                <Table.HeadCell>Comment content</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
                <Table.HeadCell>Post ID</Table.HeadCell>
                <Table.HeadCell>User ID</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {comments.map((comment) => (
                <Table.Body className='divide-y' key={comment._id}>
                  <Table.Row className='dark:border-gray-700'>
                    <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell className='max-w-xs truncate'>{comment.content}</Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    <Table.Cell className='font-mono text-xs truncate max-w-[100px]'>{comment.postId}</Table.Cell>
                    <Table.Cell className='font-mono text-xs truncate max-w-[100px]'>{comment.userId}</Table.Cell>
                    <Table.Cell>
                      <button onClick={() => { setShowModal(true); setCommentIdToDelete(comment._id); }} className='font-medium text-red-500 hover:underline'>
                        Delete
                      </button>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </>
      ) : (
        <EmptyState icon='💬' title='No comments yet' description='Comments on posts will appear here.' />
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

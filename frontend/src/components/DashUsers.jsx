import { cloudinaryUrl } from '../utils/cloudinary';
import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle, HiCheck, HiX } from 'react-icons/hi';
import EmptyState from './EmptyState';
import Pagination from './Pagination';
import { SkeletonTable } from './SkeletonCard';

const PAGE_SIZE = 9;

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    if (!currentUser.isAdmin) return;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/getusers?limit=${PAGE_SIZE}&startIndex=${(page - 1) * PAGE_SIZE}`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalPages(Math.max(1, Math.ceil(data.totalUsers / PAGE_SIZE)));
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser._id, currentUser.isAdmin, page]);

  const handleToggleAdmin = async (userId) => {
    try {
      const res = await fetch(`/api/user/toggleadmin/${userId}`, { method: 'PUT' });
      const data = await res.json();
      if (res.ok) setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isAdmin: data.isAdmin } : u));
    } catch (error) {
      if (import.meta.env.DEV) console.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, { method: 'DELETE' });
      if (res.ok) { setUsers((prev) => prev.filter((u) => u._id !== userIdToDelete)); setShowModal(false); }
    } catch (error) {
      if (import.meta.env.DEV) console.error(error.message);
    }
  };

  if (loading) return <SkeletonTable rows={PAGE_SIZE} cols={7} />;

  return (
    <div className='w-full overflow-x-auto'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <div className='rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700'>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>User image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Promote</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {users.map((user) => (
                <Table.Body className='divide-y' key={user._id}>
                  <Table.Row className='dark:border-gray-700'>
                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      <img src={cloudinaryUrl(user.profilePicture, { w: 64, h: 64 })} alt={user.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      {user.isAdmin ? <HiCheck className='text-green-500' /> : <HiX className='text-red-500' />}
                    </Table.Cell>
                    <Table.Cell>
                      {user._id !== currentUser._id && (
                        <button onClick={() => handleToggleAdmin(user._id)} className={`font-medium hover:underline ${user.isAdmin ? 'text-orange-500' : 'text-indigo-500'}`}>
                          {user.isAdmin ? 'Demote' : 'Promote'}
                        </button>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <button onClick={() => { setShowModal(true); setUserIdToDelete(user._id); }} className='font-medium text-red-500 hover:underline'>
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
        <EmptyState icon='👥' title='No users yet' description='Users who sign up will appear here.' />
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

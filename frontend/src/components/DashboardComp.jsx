import { cloudinaryUrl } from '../utils/cloudinary';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SkeletonTable } from './SkeletonCard';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser?.isAdmin) return;

    const load = async () => {
      setLoading(true);
      try {
        const [usersRes, postsRes, commentsRes, monthlyRes] = await Promise.all([
          fetch('/api/user/getusers?limit=5'),
          fetch('/api/post/getposts?limit=5'),
          fetch('/api/comment/getcomments?limit=5'),
          fetch('/api/post/monthly'),
        ]);

        if (!usersRes.ok || !commentsRes.ok) {
          const err = await usersRes.json().catch(() => ({}));
          if (usersRes.status === 401) {
            setFetchError('Session expired — please sign out and sign in again.');
          } else {
            setFetchError(err.message || 'Failed to load dashboard data.');
          }
          return;
        }

        const [usersData, postsData, commentsData, monthlyData] = await Promise.all([
          usersRes.json(), postsRes.json(), commentsRes.json(), monthlyRes.json(),
        ]);

        setUsers(usersData.users);
        setTotalUsers(usersData.totalUsers);
        setLastMonthUsers(usersData.lastMonthUsers);
        setPosts(postsData.posts);
        setTotalPosts(postsData.totalPosts);
        setLastMonthPosts(postsData.lastMonthPosts);
        setComments(commentsData.comments);
        setTotalComments(commentsData.totalComments);
        setLastMonthComments(commentsData.lastMonthComments);
        if (monthlyRes.ok) setMonthlyData(monthlyData);
        setFetchError('');
      } catch (error) {
        setFetchError('Network error — could not reach the server.');
        if (import.meta.env.DEV) console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUser]);

  const statCards = [
    {
      label: 'Total Users',
      value: totalUsers,
      lastMonth: lastMonthUsers,
      icon: <HiOutlineUserGroup className='text-white text-3xl' />,
      color: 'bg-indigo-500',
    },
    {
      label: 'Total Comments',
      value: totalComments,
      lastMonth: lastMonthComments,
      icon: <HiAnnotation className='text-white text-3xl' />,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Posts',
      value: totalPosts,
      lastMonth: lastMonthPosts,
      icon: <HiDocumentText className='text-white text-3xl' />,
      color: 'bg-indigo-700',
    },
  ];

  return (
    <div className='w-full'>
      {fetchError && (
        <div className='mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm'>
          {fetchError}
        </div>
      )}

      {/* Stat cards — equal width grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
        {statCards.map(({ label, value, lastMonth, icon, color }) => (
          <div key={label} className='flex flex-col justify-between p-5 rounded-xl shadow-md dark:bg-gray-800 bg-white border border-gray-100 dark:border-gray-700'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1'>{label}</p>
                <p className='text-3xl font-bold text-gray-800 dark:text-white'>{value}</p>
              </div>
              <div className={`${color} p-3 rounded-xl shadow`}>
                {icon}
              </div>
            </div>
            <div className='flex items-center gap-1 mt-4 text-sm'>
              <HiArrowNarrowUp className='text-green-500' />
              <span className='text-green-500 font-medium'>{lastMonth}</span>
              <span className='text-gray-400 ml-1'>this month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      {monthlyData.length > 0 && (
        <div className='mb-6 p-5 rounded-xl shadow-md dark:bg-gray-800 bg-white border border-gray-100 dark:border-gray-700'>
          <h2 className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4'>Posts per month (last 6 months)</h2>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
              <XAxis dataKey='month' tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey='count' fill='#6366f1' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent tables — equal width grid */}
      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <SkeletonTable rows={5} cols={2} />
          <SkeletonTable rows={5} cols={2} />
          <SkeletonTable rows={5} cols={2} />
        </div>
      ) : (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>

        {/* Recent Users */}
        <div className='rounded-xl shadow-md dark:bg-gray-800 bg-white border border-gray-100 dark:border-gray-700 overflow-hidden'>
          <div className='flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700'>
            <h2 className='font-semibold text-sm'>Recent Users</h2>
            <Button outline gradientDuoTone='purpleToBlue' size='xs'>
              <Link to='/dashboard?tab=users'>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body key={user._id} className='divide-y'>
                <Table.Row className='dark:border-gray-700'>
                  <Table.Cell>
                    <img src={cloudinaryUrl(user.profilePicture, { w: 64, h: 64 })} alt='user' className='w-8 h-8 rounded-full object-cover' loading='lazy' />
                  </Table.Cell>
                  <Table.Cell className='text-xs truncate max-w-[100px]'>{user.username}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>

        {/* Recent Comments */}
        <div className='rounded-xl shadow-md dark:bg-gray-800 bg-white border border-gray-100 dark:border-gray-700 overflow-hidden'>
          <div className='flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700'>
            <h2 className='font-semibold text-sm'>Recent Comments</h2>
            <Button outline gradientDuoTone='purpleToBlue' size='xs'>
              <Link to='/dashboard?tab=comments'>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body key={comment._id} className='divide-y'>
                <Table.Row className='dark:border-gray-700'>
                  <Table.Cell className='text-xs'>
                    <p className='line-clamp-2'>{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell className='text-xs'>{comment.numberOfLikes}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>

        {/* Recent Posts */}
        <div className='rounded-xl shadow-md dark:bg-gray-800 bg-white border border-gray-100 dark:border-gray-700 overflow-hidden'>
          <div className='flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700'>
            <h2 className='font-semibold text-sm'>Recent Posts</h2>
            <Button outline gradientDuoTone='purpleToBlue' size='xs'>
              <Link to='/dashboard?tab=posts'>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
            </Table.Head>
            {posts.map((post) => (
              <Table.Body key={post._id} className='divide-y'>
                <Table.Row className='dark:border-gray-700'>
                  <Table.Cell>
                    <img src={cloudinaryUrl(post.image, { w: 80, h: 64 })} alt='post' className='w-10 h-8 rounded object-cover' loading='lazy' />
                  </Table.Cell>
                  <Table.Cell className='text-xs'>
                    <p className='line-clamp-2'>{post.title}</p>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </div>

      </div>
      )}
    </div>
  );
}

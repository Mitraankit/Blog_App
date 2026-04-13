import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashSidebar from '../components/DashSidebar';

const DashProfile     = lazy(() => import('../components/DashProfile'));
const DashPosts       = lazy(() => import('../components/DashPosts'));
const DashUsers       = lazy(() => import('../components/DashUsers'));
const DashComments    = lazy(() => import('../components/DashComments'));
const DashboardComp   = lazy(() => import('../components/DashboardComp'));

function TabLoader() {
  return (
    <div className='flex items-center justify-center py-20'>
      <div className='w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin' />
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get('tab');
    setTab(tabFromUrl || '');
  }, [location.search]);

  // Default tab: admins land on the dashboard overview, others on profile
  const effectiveTab = tab || (currentUser?.isAdmin ? 'dash' : 'profile');

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56 flex-shrink-0'>
        <DashSidebar />
      </div>
      <div className='flex-1 overflow-auto p-4'>
        <Suspense fallback={<TabLoader />}>
          {effectiveTab === 'profile'  && <DashProfile />}
          {effectiveTab === 'posts'    && <DashPosts />}
          {effectiveTab === 'users'    && <DashUsers />}
          {effectiveTab === 'comments' && <DashComments />}
          {effectiveTab === 'dash'     && <DashboardComp />}
        </Suspense>
      </div>
    </div>
  );
}

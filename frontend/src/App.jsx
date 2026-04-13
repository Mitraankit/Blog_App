import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';

const Home          = lazy(() => import('./pages/Home'));
const About         = lazy(() => import('./pages/About'));
const SignIn        = lazy(() => import('./pages/SignIn'));
const SignUp        = lazy(() => import('./pages/SignUp'));
const Search        = lazy(() => import('./pages/Search'));
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const CreatePost    = lazy(() => import('./pages/CreatePost'));
const UpdatePost    = lazy(() => import('./pages/UpdatePost'));
const PostPage      = lazy(() => import('./pages/PostPage'));
const Projects      = lazy(() => import('./pages/Projects'));
const Gallery       = lazy(() => import('./pages/Gallery'));
const Author        = lazy(() => import('./pages/Author'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword  = lazy(() => import('./pages/ResetPassword'));
const NotFound       = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin' />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <BackToTop />
        <Header />
        <main className='flex-1'>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route path='/search' element={<Search />} />
                <Route element={<PrivateRoute />}>
                  <Route path='/dashboard' element={<Dashboard />} />
                </Route>
                <Route element={<OnlyAdminPrivateRoute />}>
                  <Route path='/create-post' element={<CreatePost />} />
                  <Route path='/update-post/:postId' element={<UpdatePost />} />
                </Route>
                <Route path='/projects' element={<Projects />} />
                <Route path='/gallery' element={<Gallery />} />
                <Route path='/post/:postSlug' element={<PostPage />} />
                <Route path='/author/:username' element={<Author />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password/:token' element={<ResetPassword />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </ToastProvider>
    </BrowserRouter>
  );
}

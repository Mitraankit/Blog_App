import { useSelector } from 'react-redux';
import { lazy, Suspense } from 'react';
const AnimatedBackground = lazy(() => import('./AnimatedBackground'));

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className='relative bg-[#f8fafc] text-[#1e293b] dark:text-gray-200 dark:bg-[#0f172a] min-h-screen flex flex-col'>
        <Suspense fallback={null}>
          <AnimatedBackground />
        </Suspense>
        <div className='relative z-10 flex flex-col flex-1'>
          {children}
        </div>
      </div>
    </div>
  );
}

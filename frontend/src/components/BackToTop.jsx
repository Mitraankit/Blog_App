import { useEffect, useState } from 'react';
import { HiArrowUp } from 'react-icons/hi';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-700 text-white shadow-lg hover:scale-110 transition-transform'
      title='Back to top'
    >
      <HiArrowUp size={20} />
    </button>
  );
}

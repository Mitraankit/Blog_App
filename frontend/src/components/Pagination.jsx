import PropTypes from 'prop-types';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  const btn = 'px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 transition-colors';

  return (
    <div className='flex items-center justify-center gap-1 mt-6 flex-wrap'>
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`${btn} disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800`}
      >
        ‹ Prev
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e-${i}`} className='px-2 text-gray-400'>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btn} ${
              p === page
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${btn} disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800`}
      >
        Next ›
      </button>
    </div>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

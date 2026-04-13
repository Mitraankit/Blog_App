export function SkeletonCard() {
  return (
    <div className='animate-pulse rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
      <div className='h-48 bg-gray-200 dark:bg-gray-700' />
      <div className='p-4 flex flex-col gap-3'>
        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4' />
        <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2' />
        <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded mt-2' />
      </div>
    </div>
  );
}

export function SkeletonPost() {
  return (
    <div className='animate-pulse max-w-3xl mx-auto p-6 flex flex-col gap-6'>
      <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto' />
      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto' />
      <div className='h-64 bg-gray-200 dark:bg-gray-700 rounded-xl' />
      <div className='flex flex-col gap-3'>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`h-3 bg-gray-200 dark:bg-gray-700 rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 3 }) {
  return (
    <div className='animate-pulse w-full'>
      <div className='h-10 bg-gray-100 dark:bg-gray-700 rounded-t-xl mb-1' />
      {[...Array(rows)].map((_, i) => (
        <div key={i} className='flex gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700'>
          {[...Array(cols)].map((_, j) => (
            <div key={j} className='h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1' />
          ))}
        </div>
      ))}
    </div>
  );
}

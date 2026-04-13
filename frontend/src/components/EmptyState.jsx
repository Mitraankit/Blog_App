import PropTypes from 'prop-types';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className='flex flex-col items-center justify-center py-20 px-6 text-center'>
      <div className='text-6xl mb-4'>{icon}</div>
      <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2'>{title}</h3>
      <p className='text-sm text-gray-400 max-w-xs mb-6'>{description}</p>
      {action && action}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};

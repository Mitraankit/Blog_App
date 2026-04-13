import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong.' };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-4'>
          <span className='text-5xl'>⚠️</span>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Page failed to load
          </h2>
          <p className='text-sm text-gray-500 max-w-sm'>{this.state.message}</p>
          <div className='flex gap-3 mt-2'>
            <button
              onClick={this.handleReset}
              className='px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm hover:opacity-90 transition-opacity'
            >
              Try again
            </button>
            <Link
              to='/'
              onClick={this.handleReset}
              className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            >
              Go home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

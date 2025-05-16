import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

export default function NotFound() {
  const navigate = useNavigate();
  const MoveLeftIcon = getIcon('MoveLeft');

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="mx-auto w-24 h-24 mb-8 relative">
          <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-xl transform rotate-6"></div>
          <div className="absolute inset-0 bg-secondary/20 dark:bg-secondary/30 rounded-xl transform -rotate-6"></div>
          <div className="absolute inset-0 bg-white dark:bg-surface-800 rounded-xl flex items-center justify-center">
            <span className="text-4xl font-bold text-surface-800 dark:text-surface-100">404</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary mx-auto"
        >
          <MoveLeftIcon className="w-5 h-5 mr-2" />
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  // Declare icon components at the top of the component
  const AlertCircleIcon = getIcon('AlertCircle');
  const HomeIcon = getIcon('Home');
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400">
            <AlertCircleIcon size={48} />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-3">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8 text-base md:text-lg">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center justify-center btn btn-primary px-6 py-3 text-base md:text-lg"
        >
          <HomeIcon size={20} className="mr-2" />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const LoadingView = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <div className="absolute inset-0 w-12 h-12 bg-blue-500/20 rounded-full animate-ping mx-auto mb-4" />
        </div>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-white mb-2"
        >
          Generating Your Experience
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-chrome-400"
        >
          Creating scenes from your car configuration...
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 space-y-2"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-chrome-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>Loading car specifications</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-chrome-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75" />
            <span>Generating interactive scenes</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-chrome-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
            <span>Preparing playback experience</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

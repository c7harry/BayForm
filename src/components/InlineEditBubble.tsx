import React from 'react';
import { motion } from 'framer-motion';

interface InlineEditBubbleProps {
  isEditingInline: boolean;
  onToggleEdit: () => void;
}

const InlineEditBubble: React.FC<InlineEditBubbleProps> = ({
  isEditingInline,
  onToggleEdit
}) => {

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleEdit();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleEdit();
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 1.5 // Appear after 1.5 seconds
      }}
      className="fixed top-24 right-4 z-50 cursor-pointer"
      data-edit-bubble="true"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, 3, -3, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        {/* Main bubble */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
            isEditingInline 
              ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' 
              : 'bg-gradient-to-br from-blue-500 to-blue-600'
          }`}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Glowing effect */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.4, 0.1, 0.4]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute inset-0 rounded-full ${
              isEditingInline ? 'bg-yellow-300' : 'bg-blue-300'
            }`}
          />

          {/* Icon */}
          <motion.div
            animate={{
              rotate: isEditingInline ? [0, 360] : 0
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isEditingInline ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M5 13l4 4L19 7" 
                />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              )}
            </svg>
          </motion.div>

          {/* Pulse effect when editing */}
          {isEditingInline && (
            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute inset-0 bg-yellow-400 rounded-full"
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default InlineEditBubble;

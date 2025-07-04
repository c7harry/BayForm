import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  completed: boolean;
  color: string;
  count?: number; // Number of items in this section
  total?: number; // Expected total items for this section
}

interface VerticalProgressBarProps {
  steps: ProgressStep[];
  currentStep: string;
  onStepClick: (stepId: string) => void;
  showTooltip?: boolean;
  onTooltipDismiss?: () => void;
}

// Floating Progress Bubble Component
const FloatingProgressBubble: React.FC<{
  progress: number;
  onHover: () => void;
  onLeave: () => void;
  onClick?: () => void;
}> = ({ progress, onHover, onLeave, onClick }) => {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 2 // Appear after 2 seconds
      }}
      className="fixed top-24 right-2 z-50 cursor-pointer"
      data-progress-bubble="true"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        {/* Main bubble */}
        <motion.div
          whileHover={{ scale: 1.1, rotateY: 360 }}
          className="w-16 h-16 bg-orange-500 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden"
          style={{
            transformStyle: 'preserve-3d'
          }}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Glowing effect */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-orange-400/50 rounded-full"
          />
          
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="3"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              strokeDasharray={`${2 * Math.PI * 28}`}
            />
          </svg>
          
          {/* Progress text */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10 text-white font-bold text-sm"
          >
            {Math.round(progress)}%
          </motion.div>
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/70 rounded-full"
              animate={{
                x: [0, Math.cos(i * 60 * Math.PI / 180) * 30],
                y: [0, Math.sin(i * 60 * Math.PI / 180) * 30],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Progress Node Component with CSS 3D
const ProgressNode: React.FC<{
  completed: boolean;
  active: boolean;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ completed, active, color, icon, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer group"
      whileHover={{ 
        scale: 1.15, 
        rotateY: 180,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1, ease: "easeInOut" }
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Main Node */}
      <motion.div
        className={`
          w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs relative
          ${completed 
            ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-400/50' 
            : active 
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/50' 
              : 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-400/50'
          }
        `}
        initial={false}
        animate={{
          scale: active ? [1, 1.1, 1] : completed ? 1.02 : 1,
          boxShadow: active 
            ? ['0 0 20px rgba(249, 115, 22, 0.5)', '0 0 30px rgba(249, 115, 22, 0.8)', '0 0 20px rgba(249, 115, 22, 0.5)']
            : completed
              ? ['0 0 15px rgba(34, 197, 94, 0.5)', '0 0 25px rgba(34, 197, 94, 0.7)', '0 0 15px rgba(34, 197, 94, 0.5)']
              : '0 0 0px rgba(0, 0, 0, 0)',
          backgroundColor: completed 
            ? '#10b981'
            : active 
              ? '#f97316'
              : '#9ca3af'
        }}
        transition={{
          scale: { 
            duration: active ? 2 : 0.6, 
            repeat: active ? Infinity : 0, 
            ease: "easeInOut" 
          },
          boxShadow: { 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          },
          backgroundColor: { 
            duration: 0.6, 
            ease: "easeInOut" 
          }
        }}
        style={{
          transform: 'translateZ(10px)'
        }}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: completed || active ? 1 : 0.8,
            scale: active ? [1, 1.2, 1] : 1
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            scale: { duration: 2, repeat: active ? Infinity : 0 }
          }}
        >
          {completed ? '✓' : icon}
        </motion.div>
        
        {/* Floating particles for active state */}
        {active && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-orange-400 rounded-full"
                animate={{
                  x: [0, Math.cos(i * 90 * Math.PI / 180) * 20],
                  y: [0, Math.sin(i * 90 * Math.PI / 180) * 20],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Glowing ring for active step */}
      {active && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-orange-400"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.2, 0.8],
            rotate: [0, 360]
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            transform: 'translateZ(5px)'
          }}
        />
      )}

      {/* Success burst effect */}
      {completed && (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2, 0], opacity: [0, 0.6, 0] }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
        >
          <div className="w-full h-full rounded-full bg-green-400/30" />
        </motion.div>
      )}
    </motion.div>
  );
};

// Enhanced Progress Line Component
const ProgressLine: React.FC<{
  completed: boolean;
  isNext: boolean;
  gradient?: string;
}> = ({ completed, isNext, gradient }) => {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className={`w-0.5 h-8 rounded-full relative overflow-hidden ${
          completed ? 'bg-green-200' : 'bg-gray-200'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className={`absolute inset-0 rounded-full ${
            completed 
              ? `bg-gradient-to-b ${gradient || 'from-green-400 to-green-600'}` 
              : isNext 
                ? 'bg-gradient-to-b from-orange-400 to-orange-600'
                : 'bg-gray-300'
          }`}
          initial={{ height: '0%', y: '100%' }}
          animate={{ 
            height: completed ? '100%' : isNext ? '50%' : '0%',
            y: completed ? '0%' : isNext ? '50%' : '100%'
          }}
          transition={{ 
            duration: 0.8, 
            ease: "easeInOut",
            delay: completed ? 0.2 : 0
          }}
        />
        
        {/* Animated progress dots */}
        {(completed || isNext) && (
          <motion.div
            className={`absolute w-1 h-1 rounded-full ${
              completed ? 'bg-green-300' : 'bg-orange-300'
            }`}
            initial={{ y: '0%', opacity: 0 }}
            animate={{
              y: ['0%', '100%'],
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

// Enhanced Progress Scene Component with CSS 3D
const ProgressScene: React.FC<{
  steps: ProgressStep[];
  currentStep: string;
  onStepClick: (stepId: string) => void;
  getStepGradient: (stepId: string) => string;
}> = ({ steps, currentStep, onStepClick, getStepGradient }) => {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="relative h-full flex flex-col justify-center items-center py-2 space-y-1">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.completed; // Only mark as completed if actually completed
        const isNext = index === currentIndex + 1;
        
        return (
          <React.Fragment key={step.id}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.6,
                ease: "easeOut"
              }}
              className="flex items-center justify-center"
            >
              <ProgressNode
                completed={isCompleted}
                active={isActive}
                color={step.color}
                icon={step.icon}
                onClick={() => onStepClick(step.id)}
              />
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{
                  delay: index * 0.1 + 0.3,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <ProgressLine
                  completed={step.completed}
                  isNext={isNext}
                  gradient={getStepGradient(step.id)}
                />
              </motion.div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const VerticalProgressBar: React.FC<VerticalProgressBarProps> = ({
  steps,
  currentStep,
  onStepClick,
  showTooltip = false,
  onTooltipDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  
  // Refs to track timeouts for cleanup
  const bubbleLeaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const progressBarLeaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Helper function to get the appropriate gradient for each step
  const getStepGradient = (stepId: string) => {
    const gradientMap: { [key: string]: string } = {
      'personal': 'from-orange-400 to-pink-500',
      'skills': 'from-emerald-400 to-teal-500', 
      'experience': 'from-blue-400 to-indigo-500',
      'education': 'from-purple-400 to-violet-500',
      'projects': 'from-rose-400 to-pink-500',
      'additional': 'from-amber-400 to-orange-500'
    };
    return gradientMap[stepId] || 'from-gray-400 to-gray-500';
  };

  // Helper function to get the appropriate text color for each step
  const getStepTextColor = (stepId: string) => {
    const colorMap: { [key: string]: string } = {
      'personal': 'text-orange-700',
      'skills': 'text-emerald-700', 
      'experience': 'text-blue-700',
      'education': 'text-purple-700',
      'projects': 'text-rose-700',
      'additional': 'text-amber-700'
    };
    return colorMap[stepId] || 'text-gray-700';
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  // Calculate progress based on completed sections
  const completedSections = steps.filter(step => step.completed).length;
  const totalSections = steps.length;
  const progressPercentage = (completedSections / totalSections) * 100;
  
  // Enhanced progress calculation including partial completion
  const enhancedProgress = steps.reduce((acc, step, index) => {
    if (step.completed) return acc + (100 / totalSections);
    if (index === currentIndex && step.count && step.count > 0) {
      // Give partial credit for current section with some content
      return acc + (50 / totalSections); 
    }
    return acc;
  }, 0);

  const handleBubbleClick = () => {
    // Toggle the progress bar on mobile/click
    setShowProgressBar(prev => !prev);
    
    // Clear any pending timeouts
    if (bubbleLeaveTimeout.current) {
      clearTimeout(bubbleLeaveTimeout.current);
      bubbleLeaveTimeout.current = null;
    }
    if (progressBarLeaveTimeout.current) {
      clearTimeout(progressBarLeaveTimeout.current);
      progressBarLeaveTimeout.current = null;
    }
  };

  const handleBubbleHover = () => {
    // Only show on hover, don't persist after click
    if (bubbleLeaveTimeout.current) {
      clearTimeout(bubbleLeaveTimeout.current);
      bubbleLeaveTimeout.current = null;
    }
    if (progressBarLeaveTimeout.current) {
      clearTimeout(progressBarLeaveTimeout.current);
      progressBarLeaveTimeout.current = null;
    }
    setShowProgressBar(true);
  };

  const handleBubbleLeave = () => {
    // Clear any existing timeout
    if (bubbleLeaveTimeout.current) {
      clearTimeout(bubbleLeaveTimeout.current);
    }
    
    // Set a timeout to close the progress bar
    bubbleLeaveTimeout.current = setTimeout(() => {
      setShowProgressBar(false);
      bubbleLeaveTimeout.current = null;
    }, 200);
  };

  const handleProgressBarEnter = () => {
    // Only keep open if we're actually hovering over the progress bar
    if (bubbleLeaveTimeout.current) {
      clearTimeout(bubbleLeaveTimeout.current);
      bubbleLeaveTimeout.current = null;
    }
    if (progressBarLeaveTimeout.current) {
      clearTimeout(progressBarLeaveTimeout.current);
      progressBarLeaveTimeout.current = null;
    }
  };

  const handleProgressBarLeave = () => {
    // Immediately close when leaving progress bar
    if (progressBarLeaveTimeout.current) {
      clearTimeout(progressBarLeaveTimeout.current);
    }
    
    progressBarLeaveTimeout.current = setTimeout(() => {
      setShowProgressBar(false);
      progressBarLeaveTimeout.current = null;
    }, 100);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if click is outside the progress bar area - immediately close
      if (showProgressBar && !target.closest('[data-progress-menu]') && !target.closest('[data-progress-bubble]')) {
        setShowProgressBar(false);
        // Clear any pending timeouts
        if (bubbleLeaveTimeout.current) {
          clearTimeout(bubbleLeaveTimeout.current);
          bubbleLeaveTimeout.current = null;
        }
        if (progressBarLeaveTimeout.current) {
          clearTimeout(progressBarLeaveTimeout.current);
          progressBarLeaveTimeout.current = null;
        }
      }
    };

    // Also handle mouse movement to close when mouse is far from both bubble and progress bar
    const handleMouseMove = (event: MouseEvent) => {
      if (!showProgressBar) return;
      
      const bubble = document.querySelector('[data-progress-bubble]');
      const progressBar = document.querySelector('[data-progress-menu]');
      
      if (bubble && progressBar) {
        const bubbleRect = bubble.getBoundingClientRect();
        const progressBarRect = progressBar.getBoundingClientRect();
        
        const isNearBubble = (
          event.clientX >= bubbleRect.left - 20 &&
          event.clientX <= bubbleRect.right + 20 &&
          event.clientY >= bubbleRect.top - 20 &&
          event.clientY <= bubbleRect.bottom + 20
        );
        
        const isNearProgressBar = (
          event.clientX >= progressBarRect.left - 20 &&
          event.clientX <= progressBarRect.right + 20 &&
          event.clientY >= progressBarRect.top - 20 &&
          event.clientY <= progressBarRect.bottom + 20
        );
        
        if (!isNearBubble && !isNearProgressBar) {
          setShowProgressBar(false);
          if (bubbleLeaveTimeout.current) {
            clearTimeout(bubbleLeaveTimeout.current);
            bubbleLeaveTimeout.current = null;
          }
          if (progressBarLeaveTimeout.current) {
            clearTimeout(progressBarLeaveTimeout.current);
            progressBarLeaveTimeout.current = null;
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousemove', handleMouseMove);
      if (bubbleLeaveTimeout.current) {
        clearTimeout(bubbleLeaveTimeout.current);
      }
      if (progressBarLeaveTimeout.current) {
        clearTimeout(progressBarLeaveTimeout.current);
      }
    };
  }, [showProgressBar]);

  return (
    <>
      {/* Floating Progress Bubble */}
      <AnimatePresence>
        {isVisible && (
          <FloatingProgressBubble
            progress={enhancedProgress}
            onHover={handleBubbleHover}
            onLeave={handleBubbleLeave}
            onClick={handleBubbleClick}
          />
        )}
      </AnimatePresence>

      {/* Tooltip Guide */}
      <ProgressTooltip 
        show={showTooltip} 
        onDismiss={onTooltipDismiss}
      />

      {/* Main Progress Bar */}
      <AnimatePresence>
        {showProgressBar && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="fixed top-40 right-4 z-40 bg-white/95 backdrop-blur-xl rounded-xl border border-gray-300 shadow-2xl p-4 w-52"
            data-progress-menu="true"
            onMouseLeave={handleProgressBarLeave}
            onMouseEnter={handleProgressBarEnter}
          >
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-4 text-center"
          >
            <h3 className="text-xs font-bold text-gray-800 mb-1">Resume Progress</h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${enhancedProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                  className="h-full bg-orange-500 rounded-full"
                />
              </div>
              <span className="text-xs font-semibold text-gray-600 min-w-[3rem]">
                {Math.round(enhancedProgress)}%
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {completedSections} of {totalSections} sections completed
            </div>
          </motion.div>

          {/* Enhanced 3D-style Visual Progress Display */}
          <motion.div 
            className="relative h-56 mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50/50 to-orange-100/20 border border-white/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2
            }}
            style={{ 
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-orange-200/10 to-orange-100/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(249,115,22,0.1)_70%)]" />
            
            <ProgressScene
              steps={steps}
              currentStep={currentStep}
              onStepClick={onStepClick}
              getStepGradient={getStepGradient}
            />

            {/* Floating background elements */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-orange-300/30 rounded-full"
                animate={{
                  x: [Math.random() * 200, Math.random() * 200],
                  y: [Math.random() * 300, Math.random() * 300],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.5, 1.2, 0.5]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%'
                }}
              />
            ))}
          </motion.div>

          {/* Step Labels */}
          <div className="space-y-1">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.completed; // Only mark as completed if actually completed
              const isClickable = true; // All steps are clickable for navigation

              return (
                <motion.button
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    delay: 0.8 + index * 0.1,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  onClick={() => {
                    onStepClick(step.id);
                    // Auto-close menu after navigation
                    setTimeout(() => setShowProgressBar(false), 500);
                  }}
                  onMouseEnter={() => {
                    setHoveredStep(step.id);
                    // Don't interfere with main hover logic, just prevent immediate closing
                    if (bubbleLeaveTimeout.current) {
                      clearTimeout(bubbleLeaveTimeout.current);
                      bubbleLeaveTimeout.current = null;
                    }
                    if (progressBarLeaveTimeout.current) {
                      clearTimeout(progressBarLeaveTimeout.current);
                      progressBarLeaveTimeout.current = null;
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredStep(null);
                    // Don't set any new timeouts here, let the main progress bar handle it
                  }}
                  disabled={!isClickable}
                  className={`
                    w-full p-3 rounded-xl text-left transition-all duration-500 ease-out group
                    ${isActive 
                      ? `bg-gradient-to-r ${getStepGradient(step.id)}/30 border-2 border-orange-400/70 shadow-lg transform scale-[1.02]` 
                      : isCompleted 
                        ? `bg-gradient-to-r ${getStepGradient(step.id)}/15 border border-gray-300/50 hover:bg-gradient-to-r hover:${getStepGradient(step.id)}/25 hover:border-gray-400/70` 
                        : 'bg-gray-50/70 border border-gray-200/50 hover:bg-gray-100/80 hover:border-gray-300/70'
                    }
                    ${hoveredStep === step.id ? 'transform scale-105 shadow-xl border-orange-400/80 bg-gradient-to-r bg-orange-50/30' : ''}
                    ${!isClickable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  whileHover={isClickable ? { 
                    scale: 1.03, 
                    y: -2,
                    transition: { duration: 0.3, ease: "easeOut" }
                  } : {}}
                  whileTap={isClickable ? { 
                    scale: 0.98,
                    transition: { duration: 0.1, ease: "easeInOut" }
                  } : {}}
                  style={{
                    transformOrigin: "center",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {/* Status Indicator */}
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? [1, 1.15, 1] : 1,
                        rotate: isActive ? [0, 360] : 0,
                        backgroundColor: isCompleted 
                          ? '#10b981' 
                          : isActive 
                            ? '#f97316' 
                            : '#9ca3af'
                      }}
                      transition={{
                        scale: { 
                          duration: isActive ? 3 : 0.5, 
                          repeat: isActive ? Infinity : 0, 
                          ease: "easeInOut" 
                        },
                        rotate: { 
                          duration: isActive ? 3 : 0.5, 
                          repeat: isActive ? Infinity : 0, 
                          ease: "easeInOut" 
                        },
                        backgroundColor: { 
                          duration: 0.5, 
                          ease: "easeInOut" 
                        }
                      }}
                      className={`
                        w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ease-out
                        ${isCompleted 
                          ? `bg-gradient-to-r ${getStepGradient(step.id)} text-white shadow-md` 
                          : isActive 
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                            : 'bg-gray-300 text-gray-600'
                        }
                      `}
                    >
                      <motion.span
                        initial={false}
                        animate={{
                          opacity: 1,
                          scale: isActive ? [1, 1.2, 1] : 1
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut"
                        }}
                      >
                        {isCompleted ? '✓' : index + 1}
                      </motion.span>
                    </motion.div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <motion.span 
                          className="text-sm"
                          initial={false}
                          animate={{
                            scale: isActive ? [1, 1.1, 1] : 1,
                            rotate: isActive ? [0, 5, -5, 0] : 0
                          }}
                          transition={{
                            duration: isActive ? 2 : 0.3,
                            repeat: isActive ? Infinity : 0,
                            ease: "easeInOut"
                          }}
                        >
                          {step.icon}
                        </motion.span>
                        <motion.span 
                          className={`
                            font-semibold text-xs truncate
                            ${isActive ? 'text-orange-800' : isCompleted ? getStepTextColor(step.id) : 'text-gray-600'}
                          `}
                          initial={false}
                          animate={{
                            color: isActive 
                              ? '#000000FF' 
                              : isCompleted 
                                ? step.color 
                                : '#4b5563'
                          }}
                          transition={{
                            duration: 0.4,
                            ease: "easeInOut"
                          }}
                        >
                          {step.label}
                        </motion.span>
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <AnimatePresence>
                      {hoveredStep === step.id && (
                        <motion.div
                          initial={{ opacity: 0, x: -10, scale: 0.8 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0, 
                            scale: 1,
                            rotate: [0, 10, -10, 0]
                          }}
                          exit={{ opacity: 0, x: -10, scale: 0.8 }}
                          transition={{ 
                            duration: 0.3, 
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            rotate: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                          className="text-orange-500 font-bold text-sm"
                        >
                          →
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-3 pt-2 border-t border-white/20 text-center"
          >
            <p className="text-xs text-gray-500">
              Click to navigate
            </p>
          </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip Component to guide users */}
      <ProgressTooltip
        show={showTooltip}
        onDismiss={onTooltipDismiss}
      />
    </>
  );
};

// Tooltip Component to guide users
const ProgressTooltip: React.FC<{
  show: boolean;
  onDismiss?: () => void;
}> = ({ show, onDismiss }) => {
  const [hasSeenTooltip, setHasSeenTooltip] = useState(false);

  // Check if user has already seen the tooltip
  useEffect(() => {
    const seen = localStorage.getItem('resume-progress-tooltip-seen');
    if (seen === 'true') {
      setHasSeenTooltip(true);
    }
  }, []);

  // Mark tooltip as seen when it's dismissed or auto-hidden
  useEffect(() => {
    if (show && !hasSeenTooltip) {
      // Auto-hide tooltip after 8 seconds
      const timer = setTimeout(() => {
        localStorage.setItem('resume-progress-tooltip-seen', 'true');
        setHasSeenTooltip(true);
        if (onDismiss) {
          onDismiss();
        }
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [show, hasSeenTooltip, onDismiss]);

  const handleDismiss = () => {
    localStorage.setItem('resume-progress-tooltip-seen', 'true');
    setHasSeenTooltip(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Don't show if user has already seen it
  if (!show || hasSeenTooltip) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className="fixed top-32 right-24 z-50 max-w-xs"
      >
        {/* Arrow pointing to the bubble */}
        <motion.div
          animate={{
            x: [0, -5, 0],
            rotate: [0, 15, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -right-3 top-4 w-0 h-0 border-l-8 border-l-indigo-600 border-t-4 border-t-transparent border-b-4 border-b-transparent"
        />
        
        <motion.div 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl shadow-2xl border border-white/20"
          animate={{
            boxShadow: [
              "0 25px 50px -12px rgba(99, 102, 241, 0.4)",
              "0 25px 50px -12px rgba(99, 102, 241, 0.6)",
              "0 25px 50px -12px rgba(99, 102, 241, 0.4)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-2xl"
            >
              🎯
            </motion.div>
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">Quick Navigation</h3>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Click the progress bubble to see your completion status and jump between sections instantly!
              </p>
            </div>
            {onDismiss && (
              <motion.button
                onClick={handleDismiss}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-white/70 hover:text-white text-lg leading-none p-1"
              >
                ×
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerticalProgressBar;

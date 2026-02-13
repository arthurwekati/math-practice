import { useEffect, useRef } from 'react';

export function useTimeTracking(isActive: boolean) {
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isActive) {
      // Start tracking
      startTimeRef.current = Date.now();
      
      // Handle visibility change
      const handleVisibilityChange = () => {
        if (document.hidden) {
          // Tab hidden - save accumulated time
          if (startTimeRef.current) {
            accumulatedTimeRef.current += (Date.now() - startTimeRef.current) / 1000;
            startTimeRef.current = null;
          }
        } else {
          // Tab visible - resume tracking
          startTimeRef.current = Date.now();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Periodic checkpoint every 10 seconds
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current && !document.hidden) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          accumulatedTimeRef.current += elapsed;
          startTimeRef.current = Date.now();
        }
      }, 10000);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        // Save final time
        if (startTimeRef.current && !document.hidden) {
          accumulatedTimeRef.current += (Date.now() - startTimeRef.current) / 1000;
        }
      };
    } else {
      // Not active - save accumulated time
      if (startTimeRef.current) {
        accumulatedTimeRef.current += (Date.now() - startTimeRef.current) / 1000;
        startTimeRef.current = null;
      }
    }
  }, [isActive]);

  const getElapsedTime = (): number => {
    let total = accumulatedTimeRef.current;
    if (startTimeRef.current && !document.hidden) {
      total += (Date.now() - startTimeRef.current) / 1000;
    }
    return total;
  };

  const reset = () => {
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
  };

  return { getElapsedTime, reset };
}

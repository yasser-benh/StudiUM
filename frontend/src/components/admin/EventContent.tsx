// components/EventContent.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLOR_PALETTE = {
  primaryDark: "#4D2D91",
  lightText: "#F8F9FA",
  primary: "#6F42C1",
  accent: "#20C997",
};

const EVENT_TYPE_COLORS: Record<string, string> = {
    meeting: COLOR_PALETTE.primary,
    conference: COLOR_PALETTE.accent,
    workshop: "#FF9F43",
    other: "#6C757D"
  };

type EventContentProps = {
  event: any;
  timeText?: string;
};

export const EventContent = ({ event, timeText }: EventContentProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenu principal */}
      <motion.div 
        className="flex flex-col px-4 py-1 z-10 relative  "
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="font-medium text-sm truncate " style={{ color: COLOR_PALETTE.lightText }}>
          {event.title}
        </div>
        {timeText && (
          <div className="text-xs opacity-80" style={{ color: COLOR_PALETTE.lightText }}>
            {timeText}
          </div>
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
          className="absolute left-0 top-full mt-1 w-full min-w-[250px] p-3 rounded-lg shadow-xl z-20"
          style={{ 
            backgroundColor: EVENT_TYPE_COLORS[event.extendedProps.eventType] || COLOR_PALETTE.primaryDark
          }}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">{event.title}</h3>
            
            {event.extendedProps.description && (
              <p className="text-xs opacity-90">{event.extendedProps.description}</p>
            )}
        
            <div className="flex justify-between text-xs">
              <div>
                <span className="font-medium">Début:</span>
                <div>{new Date(event.start).toLocaleDateString()}</div>
                <div>{new Date(event.start).toLocaleTimeString()}</div>
              </div>
              {event.end && (
                <div>
                  <span className="font-medium">Fin:</span>
                  <div>{new Date(event.end).toLocaleDateString()}</div>
                  <div>{new Date(event.end).toLocaleTimeString()}</div>
                </div>
              )}
            </div>
        
            {event.extendedProps.location && (
              <div className="pt-2 text-xs">
                <span className="font-medium">Lieu:</span>
                <div>{event.extendedProps.location}</div>
              </div>
            )}
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
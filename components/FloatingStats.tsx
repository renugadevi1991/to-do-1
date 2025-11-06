'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { User } from '@/utils/api';

interface FloatingStatsProps {
  totalTodos: number;
  activeTodos: number;
  completedTodos: number;
  selectedUser: User | null;
}

const FloatingStats: React.FC<FloatingStatsProps> = ({ 
  totalTodos, 
  activeTodos, 
  completedTodos, 
  selectedUser 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [overallStats, setOverallStats] = useState({
    total: totalTodos,
    active: activeTodos,
    completed: completedTodos
  });
  const statsRef = useRef<HTMLDivElement>(null);

  // Update overall stats every minute
  useEffect(() => {
    const updateStats = () => {
      setOverallStats({
        total: totalTodos,
        active: activeTodos,
        completed: completedTodos
      });
      setLastUpdated(new Date());
    };

    // Initial update
    updateStats();

    // Set up interval to update every minute (60000ms)
    const interval = setInterval(updateStats, 60000);

    return () => clearInterval(interval);
  }, [totalTodos, activeTodos, completedTodos]);

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return;
    
    setIsDragging(true);
    const rect = statsRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const maxX = window.innerWidth - 220;
      const maxY = window.innerHeight - 150;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Show button when stats are hidden
  const ShowStatsButton = () => {
    if (isVisible) return null;

    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        title="Show Overall Stats"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    );
  };

  if (!isVisible) return <ShowStatsButton />;

  return (
    <>
      <div
        ref={statsRef}
        className={`fixed z-50 transition-all duration-200 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isMinimized ? 'cursor-default' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          bottom: 'auto',
          right: 'auto'
        }}
      >
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl shadow-lg text-white min-w-[220px] overflow-hidden">
          {/* Header with controls */}
          <div 
            className={`flex items-center justify-between p-3 ${
              !isMinimized ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
            onMouseDown={!isMinimized ? handleMouseDown : undefined}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">Overall Stats</h3>
            </div>
            <div className="flex items-center gap-1">
              {/* Auto-refresh indicator */}
              <div className="flex items-center gap-1 mr-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/80">Live</span>
              </div>
              
              {/* Minimize/Expand Button */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white p-1 rounded transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMinimized ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                  )}
                </svg>
              </button>
              
              {/* Hide Button */}
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/80 hover:text-white p-1 rounded transition-colors"
                title="Hide Stats"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content - only show when not minimized */}
          {!isMinimized && (
            <div className="px-4 pb-4">
              {/* Current user context indicator */}
              {/* {selectedUser && (
                <div className="text-xs text-center mb-3 bg-white/20 rounded px-2 py-1 flex items-center justify-center gap-1">
                  <span>Viewing:</span>
                  <span className="font-medium">{selectedUser.name}</span>
                </div>
              )} */}
              
              {/* Overall stats title */}
              <div className="text-xs text-center mb-2 text-white/90 font-medium">
                Team Tasks
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-white/20 rounded-lg px-3 py-2">
                  <span className="text-xs font-medium flex items-center gap-1">
                    Total:
                  </span>
                  <span className="text-sm font-bold bg-white/30 px-2 py-1 rounded">
                    {overallStats.total}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/20 rounded-lg px-3 py-2">
                  <span className="text-xs font-medium flex items-center gap-1">
                    Active:
                  </span>
                  <span className="text-sm font-bold bg-orange-400/80 px-2 py-1 rounded">
                    {overallStats.active}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/20 rounded-lg px-3 py-2">
                  <span className="text-xs font-medium flex items-center gap-1">
                    Done:
                  </span>
                  <span className="text-sm font-bold bg-green-400/80 px-2 py-1 rounded">
                    {overallStats.completed}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="bg-white/20 rounded-lg px-3 py-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{overallStats.total > 0 ? Math.round((overallStats.completed / overallStats.total) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: overallStats.total > 0 
                          ? `${(overallStats.completed / overallStats.total) * 100}%` 
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Last updated timestamp */}
              <div className="text-xs text-center mt-3 text-white/70 flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Updated: {formatTime(lastUpdated)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <ShowStatsButton />
    </>
  );
};

export default FloatingStats;
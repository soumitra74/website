'use client'

import React from 'react'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating Glass Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-400/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-40 h-40 bg-blue-400/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 right-10 w-28 h-28 bg-purple-400/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '3s' }}></div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Ambient Theme Specific Elements */}
      <div className="ambient:block hidden">
        <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-white/5 rounded-lg rotate-45 animate-float"></div>
        <div className="absolute top-2/3 right-1/3 w-16 h-16 bg-emerald-400/10 rounded-lg -rotate-12 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-2/3 w-24 h-24 bg-blue-400/8 rounded-lg rotate-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-purple-400/12 rounded-lg -rotate-45 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
    </div>
  )
}

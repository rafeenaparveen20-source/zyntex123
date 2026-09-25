import React, { useState, useRef } from 'react';
import { Sparkles, Sliders, Columns } from 'lucide-react';

export const BeforeAfterSection: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section id="story" className="py-20 md:py-28 px-4 md:px-8 lg:px-14">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-5 mb-8 md:mb-12">
          <div>
            <div className="text-xs uppercase tracking-[3px] font-bold text-[#8b6b4d] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8b6b4d]" />
              <span>The transformation</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-semibold text-[#173c2d] tracking-tight leading-tight">
              See the difference
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="max-w-[420px] text-[#5c6159] text-base leading-relaxed">
              You don't need a costly complete renovation. You just need the right curated details.
            </p>
            {/* View Mode Toggle */}
            <div className="inline-flex bg-white/80 p-1 rounded-full border border-[#ddd8cc] shadow-xs">
              <button
                onClick={() => setViewMode('slider')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-[#173c2d] text-white'
                    : 'text-[#5c6159] hover:text-[#173c2d]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Interactive Slider</span>
              </button>
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'side-by-side'
                    ? 'bg-[#173c2d] text-white'
                    : 'text-[#5c6159] hover:text-[#173c2d]'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Side by Side</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Comparison Slider Mode */}
        {viewMode === 'slider' ? (
          <div className="relative">
            <div
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              onTouchMove={handleTouchMove}
              className="relative h-[420px] sm:h-[520px] md:h-[580px] w-full rounded-[30px] overflow-hidden select-none cursor-ew-resize shadow-[0_20px_50px_rgba(23,60,45,0.12)] border border-[#ddd8cc]"
            >
              {/* After Image (Background) */}
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=85"
                alt="Zyntex After room transformation"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute right-6 bottom-6 bg-[#173c2d]/90 backdrop-blur-md text-white font-bold text-xs tracking-wider uppercase px-4 py-2 rounded-full shadow-lg">
                AFTER: Cozy & Styled ✦
              </div>

              {/* Before Image (Clipped Overlay) */}
              <div
                style={{ width: `${sliderPosition}%` }}
                className="absolute inset-y-0 left-0 overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=85"
                  alt="Room before transformation"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none"
                  style={{
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                  }}
                />
                <div className="absolute left-6 bottom-6 bg-white/90 backdrop-blur-md text-[#173c2d] font-bold text-xs tracking-wider uppercase px-4 py-2 rounded-full shadow-lg border border-[#ddd8cc]">
                  BEFORE: Flat & Unfinished
                </div>
              </div>

              {/* Draggable Divider Line & Knob */}
              <div
                style={{ left: `${sliderPosition}%` }}
                className="absolute inset-y-0 -translate-x-1/2 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-20 pointer-events-none"
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#173c2d] shadow-xl flex items-center justify-center border-2 border-[#173c2d] font-bold text-xs">
                  ⇄
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-[#696e67] mt-3.5">
              Drag or swipe the divider across to reveal the makeover transformation
            </p>
          </div>
        ) : (
          /* Side by Side Mode (As in user's prompt) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="relative rounded-[26px] overflow-hidden bg-[#ded8ca] shadow-[0_10px_30px_rgba(23,60,45,0.06)] border border-[#ddd8cc] h-[380px] sm:h-[470px]">
              <img
                src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85"
                alt="Room before makeover"
                className="w-full h-full object-cover block"
              />
              <div className="absolute left-5 bottom-5 bg-[#fffdf3]/90 backdrop-blur-md px-4 py-2.5 rounded-full font-bold text-xs tracking-widest text-[#173c2d] shadow-md border border-white/60">
                BEFORE
              </div>
            </div>

            <div className="relative rounded-[26px] overflow-hidden bg-[#ded8ca] shadow-[0_10px_30px_rgba(23,60,45,0.06)] border border-[#ddd8cc] h-[380px] sm:h-[470px]">
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85"
                alt="Room after Zyntex makeover"
                className="w-full h-full object-cover block"
              />
              <div className="absolute left-5 bottom-5 bg-[#173c2d] text-white px-4 py-2.5 rounded-full font-bold text-xs tracking-widest shadow-md">
                AFTER ✦
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

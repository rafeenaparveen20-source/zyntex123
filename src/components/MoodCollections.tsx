import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { MOOD_COLLECTIONS } from '../data/mockData';

interface MoodCollectionsProps {
  selectedMood: string | null;
  onSelectMood: (moodId: string) => void;
}

export const MoodCollections: React.FC<MoodCollectionsProps> = ({
  selectedMood,
  onSelectMood,
}) => {
  return (
    <section id="mood" className="py-20 md:py-28 px-4 md:px-8 lg:px-14">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-5 mb-10 md:mb-14">
          <div>
            <div className="text-xs uppercase tracking-[3px] font-bold text-[#8b6b4d] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8b6b4d]" />
              <span>Find your vibe</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-semibold text-[#173c2d] tracking-tight leading-tight">
              Shop by mood
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="max-w-[420px] text-[#5c6159] text-base leading-relaxed">
              Turn Pinterest inspiration into an inviting sanctuary you genuinely look forward to coming home to.
            </p>
            {selectedMood && (
              <button
                onClick={() => onSelectMood('all')}
                className="text-xs font-bold text-[#173c2d] bg-white border border-[#173c2d] px-3.5 py-1.5 rounded-full hover:bg-[#173c2d] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                Clear Mood Filter ✕
              </button>
            )}
          </div>
        </div>

        {/* Masonry / Grid Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOOD_COLLECTIONS.map((mood, idx) => {
            const isSelected = selectedMood === mood.id;
            const isTaller = idx === 0 || idx === 3;

            return (
              <article
                key={mood.id}
                onClick={() => onSelectMood(mood.id)}
                className={`group relative rounded-[26px] overflow-hidden bg-[#ded8ca] cursor-pointer shadow-sm hover:shadow-[0_20px_40px_rgba(23,60,45,0.14)] transition-all duration-300 border ${
                  isSelected ? 'ring-3 ring-[#173c2d] border-[#173c2d]' : 'border-black/5'
                } ${isTaller ? 'row-span-1 min-h-[360px] md:min-h-[420px]' : 'min-h-[320px] md:min-h-[380px]'}`}
              >
                {/* Image */}
                <img
                  src={mood.image}
                  alt={mood.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent pointer-events-none group-hover:from-black/50 transition-colors" />

                {/* Floating pill badge */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[#173c2d] tracking-wide shadow-xs opacity-90 group-hover:opacity-100 transition-opacity">
                  {isSelected ? 'Active Filter' : 'Explore Mood'}
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute inset-x-4 bottom-4 p-4 md:p-5 rounded-2xl bg-[#fffdf8]/90 backdrop-blur-md border border-white/80 shadow-md transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <b className="block font-playfair text-xl md:text-2xl font-semibold text-[#173c2d]">
                        {mood.title}
                      </b>
                      <span className="text-xs text-[#5c6159] mt-0.5 block font-medium">
                        {mood.subtitle}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#173c2d] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

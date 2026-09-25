import React from 'react';

export const QuoteSection: React.FC = () => {
  return (
    <section className="py-12 md:py-20 px-4 md:px-8 lg:px-14">
      <div className="max-w-[1240px] mx-auto bg-[#e1e8dc] rounded-[36px] py-16 md:py-20 px-6 sm:px-12 md:px-20 text-center shadow-[0_15px_40px_rgba(23,60,45,0.06)] border border-[#cbd8c4] relative overflow-hidden">
        {/* Subtle decorative leaf watermarks */}
        <span className="absolute -left-4 -top-8 text-8xl text-[#173c2d]/5 select-none font-serif">“</span>
        <span className="absolute -right-4 -bottom-12 text-8xl text-[#173c2d]/5 select-none font-serif">”</span>

        <blockquote className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-snug font-medium text-[#173c2d] max-w-[860px] mx-auto mb-6">
          “A beautiful room isn't about having more. It's about choosing what feels like you.”
        </blockquote>
        <cite className="font-caveat text-2xl md:text-3xl text-[#8b6b4d] font-semibold not-italic block">
          — The Zyntex mood
        </cite>
      </div>
    </section>
  );
};

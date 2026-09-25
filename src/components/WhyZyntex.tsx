import React from 'react';
import { Sparkles } from 'lucide-react';
import { BENEFITS } from '../data/mockData';

export const WhyZyntex: React.FC = () => {
  return (
    <section className="py-20 md:py-28 px-4 md:px-8 lg:px-14">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-5 mb-10 md:mb-12">
          <div>
            <div className="text-xs uppercase tracking-[3px] font-bold text-[#8b6b4d] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8b6b4d]" />
              <span>Why Zyntex</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-semibold text-[#173c2d] tracking-tight leading-tight">
              Beautiful by design.
            </h2>
          </div>
          <p className="max-w-[420px] text-[#5c6159] text-base leading-relaxed">
            Thoughtfully engineered aesthetics designed to elevate your everyday routines without overwhelming your budget.
          </p>
        </div>

        {/* 5-Column Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {BENEFITS.map((item, index) => (
            <div
              key={index}
              className="p-7 md:p-6 bg-[#eee9df]/90 hover:bg-[#e6e0d4] rounded-[22px] text-center border border-[#ddd8cc]/60 shadow-[0_2px_10px_rgba(23,60,45,0.02)] transition-all duration-200 hover:-translate-y-1"
            >
              <div className="text-3xl text-[#173c2d] mb-3 select-none flex justify-center">
                {item.symbol}
              </div>
              <b className="block text-base font-semibold text-[#173c2d] mb-2">
                {item.title}
              </b>
              <span className="text-xs md:text-[13px] text-[#696e67] leading-relaxed block">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

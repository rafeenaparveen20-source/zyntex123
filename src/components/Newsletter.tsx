import React, { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';

interface NewsletterProps {
  onSubscribe: (email: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    onSubscribe(email);
    setSubmitted(true);
  };

  return (
    <section className="py-12 md:py-20 px-4 md:px-8 lg:px-14">
      <div className="max-w-[1240px] mx-auto bg-[#fffaf0] border border-[#ddd8cc] rounded-[32px] p-8 sm:p-12 md:p-14 flex flex-col lg:flex-row justify-between lg:items-center gap-8 shadow-[0_12px_35px_rgba(23,60,45,0.04)]">
        <div>
          <div className="text-xs uppercase tracking-[3px] font-bold text-[#8b6b4d] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#8b6b4d]" />
            <span>Stay inspired</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-semibold text-[#173c2d] tracking-tight mb-2">
            Little ideas. Big mood.
          </h2>
          <p className="text-[#5c6159] text-sm sm:text-base leading-relaxed max-w-[480px]">
            Get room makeover guides, curated styling drops, and an exclusive 10% welcome gift on your first order.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-3 bg-[#dfe7d8] text-[#173c2d] px-6 py-4 rounded-full font-medium text-sm">
            <Check className="w-5 h-5 text-[#173c2d]" />
            <span>Welcome to Zyntex! Check your inbox for code <b>ZYNTEX10</b></span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white border border-[#ddd8cc] rounded-full p-1.5 w-full max-w-[500px] shadow-xs focus-within:border-[#173c2d] transition-colors"
          >
            <div className="pl-4 text-[#8a9b82]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-none outline-hidden px-3.5 py-2.5 text-xs sm:text-sm text-[#20251f] placeholder:text-[#888880]"
            />
            <button
              type="submit"
              className="bg-[#173c2d] hover:bg-[#235440] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs tracking-wider uppercase whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              JOIN ZYNTEX
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate = '2026-12-12T10:00:00+06:00' }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // English to Bengali digit converter helper
  const toBanglaNumber = (num) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, (w) => banglaDigits[+w]);
  };

  const padZero = (n) => String(n).padStart(2, '0');

  if (timeLeft.isOver) {
    return (
      <div className="inline-block bg-emerald-900/90 border border-gold-500/50 text-gold-300 px-6 py-3 rounded-2xl shadow-lg">
        <span className="text-lg font-bold">আলহামদুলিল্লাহ! মিলনমেলার শুভ ক্ষণ উপস্থিত।</span>
      </div>
    );
  }

  const timeUnits = [
    { label: 'দিন', value: toBanglaNumber(timeLeft.days) },
    { label: 'ঘণ্টা', value: toBanglaNumber(padZero(timeLeft.hours)) },
    { label: 'মিনিট', value: toBanglaNumber(padZero(timeLeft.minutes)) },
    { label: 'সেকেন্ড', value: toBanglaNumber(padZero(timeLeft.seconds)) },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-6">
      {timeUnits.map((unit, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center bg-gradient-to-b from-emerald-900 to-emerald-950 text-white border-2 border-gold-500/60 rounded-2xl shadow-xl w-20 sm:w-24 h-20 sm:h-24 p-2 relative overflow-hidden group hover:border-gold-400 transition-colors"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-75"></div>
          <span className="text-2xl sm:text-3xl font-extrabold text-gold-400 tracking-wide font-mono">
            {unit.value}
          </span>
          <span className="text-xs sm:text-sm font-medium text-emerald-100 mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

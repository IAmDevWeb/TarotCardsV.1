'use client';

import React, { useState } from 'react';
import { Sparkles, RefreshCw, Eye, Compass } from 'lucide-react';
import { TAROT_CARDS, TarotCard } from './data';

export default function App() {
  const [selectedCards, setSelectedCards] = useState<{ card: TarotCard; isReversed: boolean }[]>([]);
  const [isChoosing, setIsChoosing] = useState(false);
  const [question, setQuestion] = useState("");
  const [revealed, setRevealed] = useState(false);

  const startReading = () => {
    if (!question.trim()) {
      alert("กรุณากรอกคำถามหรือเรื่องที่คุณต้องการดูดวงก่อนครับ");
      return;
    }

    setIsChoosing(true);
    setRevealed(false);
    setSelectedCards([]);

    // สุ่มไพ่ 3 ใบ (อดีต, ปัจจุบัน, อนาคต)
    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
      const chosen = shuffled.slice(0, 3).map(card => ({
        card,
        isReversed: Math.random() < 0.3 // โอกาสกลับหัว 30%
      }));
      setSelectedCards(chosen);
      setIsChoosing(false);
      setRevealed(true);
    }, 1200);
  };

  const resetReading = () => {
    setQuestion("");
    setSelectedCards([]);
    setRevealed(false);
  };

  const positions = ["อดีต / รากฐานปัญหา", "ปัจจุบัน / สถานการณ์ตอนนี้", "อนาคต / แนวโน้มผลลัพธ์"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white p-3 md:p-8 flex flex-col items-center justify-between font-sans">
      {/* ส่วนหัว */}
      <header className="w-full max-w-4xl text-center py-4 md:py-6">
        <div className="flex items-center justify-center gap-1 md:gap-2 mb-2">
          <Sparkles className="text-yellow-400 animate-pulse w-5 h-5 md:w-8 md:h-8" />
          <h1 className="text-xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent leading-tight">
            ดูดวงไพ่ทาโรต์มงคล
          </h1>
          <Sparkles className="text-yellow-400 animate-pulse w-5 h-5 md:w-8 md:h-8" />
        </div>
        <p className="text-xs md:text-base text-slate-300 leading-relaxed px-1">
          เปิดประตูสู่อนาคต ค้นหาคำตอบจากไพ่ยิปซี 3 ใบ (อดีต ปัจจุบัน อนาคต)
        </p>
      </header>

      {/* ส่วนกรอกคำถามและปุ่มควบคุม */}
      <main className="w-full max-w-2xl flex flex-col items-center gap-4 md:gap-6 my-2 md:my-4 px-0">
        {!revealed && (
          <div className="w-full bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl border border-white/25 flex flex-col gap-3 md:gap-4">
            <label className="text-xs md:text-sm font-medium text-amber-200 flex items-center gap-2">
              <Compass size={16} className="flex-shrink-0" /> ตั้งจิตอธิษฐาน แล้วพิมพ์คำถามของคุณ:
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="เช่น ความรัก? การงาน?"
              maxLength={60}
              className="w-full bg-slate-900/60 border border-purple-400/40 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-sm md:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
            <button
              onClick={startReading}
              disabled={isChoosing}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 active:scale-95 text-slate-950 font-bold py-2.5 md:py-3.5 px-4 md:px-6 rounded-lg md:rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 text-sm md:text-base"
            >
              {isChoosing ? (
                <>
                  <RefreshCw className="animate-spin flex-shrink-0" size={18} /> กำลังสับไพ่...
                </>
              ) : (
                <>
                  <Eye size={18} className="flex-shrink-0" /> ทำนายดวงชะตา
                </>
              )}
            </button>
          </div>
        )}

        {/* แสดงผลไพ่ 3 ใบ */}
        {selectedCards.length > 0 && (
          <div className="w-full flex flex-col gap-3 md:gap-6 animate-fadeIn">
            <div className="text-center bg-purple-900/40 border border-purple-500/30 p-3 md:p-4 rounded-lg md:rounded-xl">
              <p className="text-xs text-amber-300 uppercase tracking-wider font-semibold">คำถามของคุณ</p>
              <h2 className="text-sm md:text-lg font-bold text-white mt-1 line-clamp-2">&quot;{question}&quot;</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 w-full">
              {selectedCards.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col items-center shadow-xl transform transition-all hover:-translate-y-0.5 md:hover:-translate-y-1"
                >
                  <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full mb-2 md:mb-3 text-center line-clamp-1">
                    {positions[idx]}
                  </span>

                  {/* ภาพการ์ด */}
                  <div className={`w-20 h-28 md:w-28 md:h-40 bg-gradient-to-b from-purple-800 to-indigo-900 rounded-lg md:rounded-xl border-2 border-amber-400 flex items-center justify-center shadow-inner mb-2 md:mb-4 transition-transform duration-500 ${item.isReversed ? 'rotate-180' : ''}`}>
                    <img src={item.card.image} alt={item.card.name} className="w-full h-full object-cover rounded-lg md:rounded-xl" />
                  </div>

                  <h3 className="text-xs md:text-lg font-bold text-amber-200 text-center line-clamp-2">
                    {item.card.name} {item.isReversed ? "(กลับ)" : ""}
                  </h3>
                  <p className="text-xs text-slate-400 text-center mb-2 line-clamp-1">{item.card.thaiName}</p>

                  <div className="bg-white/5 rounded-lg md:rounded-xl p-2 md:p-3 w-full text-xs text-slate-300 space-y-1.5 max-h-40 overflow-y-auto">
                    <p className="line-clamp-3"><strong className="text-amber-300">ความหมาย:</strong> {item.isReversed ? item.card.reversedMeaning : item.card.meaning}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-2 md:mt-4 w-full">
              <button
                onClick={resetReading}
                className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 border border-amber-500/40 font-medium py-2 md:py-2.5 px-4 md:px-6 rounded-lg md:rounded-xl flex items-center gap-2 transition-all shadow-md text-sm md:text-base"
              >
                <RefreshCw size={16} className="flex-shrink-0" /> ทำนายใหม่
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ส่วนท้าย */}
      <footer className="w-full text-center py-4 md:py-6 text-xs text-slate-500 border-t border-slate-800 mt-6 md:mt-8 px-2">
        <p className="line-clamp-2">© 2026 ดูดวงไพ่ทาโรต์มงคล • เพื่อแนวทางและสร้างกำลังใจ</p>
      </footer>
    </div>
  );
}
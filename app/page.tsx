'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, RefreshCw, Eye, Compass, AlertCircle, X } from 'lucide-react';
import { TAROT_CARDS, TarotCard } from './data';

export default function App() {
  const [selectedCards, setSelectedCards] = useState<{ card: TarotCard; isReversed: boolean }[]>([]);
  const [isChoosing, setIsChoosing] = useState(false);
  const [question, setQuestion] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState("");
  const [selectedCardDetail, setSelectedCardDetail] = useState<{ card: TarotCard; isReversed: boolean } | null>(null);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);

  const startReading = () => {
    if (!question.trim()) {
      setError("กรุณากรอกคำถามหรือเรื่องที่คุณต้องการดูดวงก่อนครับ");
      return;
    }

    setError("");
    setIsChoosing(true);
    setRevealed(false);
    setSelectedCards([]);

    setTimeout(() => {
      const shuffled = [...TAROT_CARDS];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const chosen = shuffled.slice(0, 3).map(card => ({
        card,
        isReversed: Math.random() < 0.3
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
    setError("");
    setSelectedCardDetail(null);
    setFlippedCardId(null);
  };

  const handleCardClick = (card: TarotCard, isReversed: boolean, cardId: number) => {
    setFlippedCardId(cardId);
    setTimeout(() => {
      setSelectedCardDetail({ card, isReversed });
    }, 300);
  };

  const closeDetail = () => {
    setSelectedCardDetail(null);
    setFlippedCardId(null);
  };

  const positions = ["อดีต / รากฐานปัญหา", "ปัจจุบัน / สถานการณ์ตอนนี้", "อนาคต / แนวโน้มผลลัพธ์"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white p-3 md:p-8 flex flex-col items-center justify-between font-sans">
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

      <main className="w-full max-w-2xl flex flex-col items-center gap-4 md:gap-6 my-2 md:my-4 px-0">
        {!revealed && (
          <div className="w-full bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl border border-white/25 flex flex-col gap-3 md:gap-4">
            <label className="text-xs md:text-sm font-medium text-amber-200 flex items-center gap-2">
              <Compass size={16} className="flex-shrink-0" /> ตั้งจิตอธิษฐาน แล้วพิมพ์คำถามของคุณ:
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (error) setError("");
              }}
              placeholder="เช่น ความรัก? การงาน?"
              maxLength={60}
              className="w-full bg-slate-900/60 border border-purple-400/40 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-sm md:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
            {error && (
              <p className="text-xs md:text-sm text-red-400 flex items-center gap-1.5">
                <AlertCircle size={14} className="flex-shrink-0" /> {error}
              </p>
            )}
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

                  <div
                    onClick={() => handleCardClick(item.card, item.isReversed, idx)}
                    className={`w-20 h-28 md:w-28 md:h-40 bg-gradient-to-b from-purple-800 to-indigo-900 rounded-lg md:rounded-xl border-2 border-amber-400 flex items-center justify-center shadow-inner mb-2 md:mb-4 transition-transform duration-500 cursor-pointer hover:scale-105 active:scale-95 ${item.isReversed ? 'rotate-180' : ''} ${flippedCardId === idx ? 'flip-animation' : ''
                      }`}
                    style={flippedCardId === idx ? { animation: 'cardFlip 0.6s ease-in-out' } : {}}
                  >
                    <Image
                      src={item.card.image}
                      alt={item.card.name}
                      width={112}
                      height={160}
                      unoptimized
                      className="w-full h-full object-cover rounded-lg md:rounded-xl"
                    />
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

      {/* Card Detail Modal */}
      {selectedCardDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 border border-amber-500/40 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl md:text-4xl font-bold text-amber-300 mb-1">
                  {selectedCardDetail.card.name}
                </h2>
                <p className="text-sm md:text-base text-purple-300">{selectedCardDetail.card.thaiName}</p>
                {selectedCardDetail.isReversed && (
                  <p className="text-xs md:text-sm text-red-400 font-semibold mt-2 flex items-center gap-1">
                    🔄 กลับด้าน (Reversed)
                  </p>
                )}
              </div>
              <button
                onClick={closeDetail}
                className="text-slate-400 hover:text-white transition-colors flex-shrink-0 p-1"
              >
                <X size={28} />
              </button>
            </div>

            {/* Card Image */}
            <div className="flex justify-center mb-6">
              <div
                className={`w-32 h-48 md:w-40 md:h-56 bg-gradient-to-b from-purple-800 to-indigo-900 rounded-lg md:rounded-xl border-2 border-amber-400 flex items-center justify-center shadow-lg ${selectedCardDetail.isReversed ? 'rotate-180' : ''
                  }`}
              >
                <Image
                  src={selectedCardDetail.card.image}
                  alt={selectedCardDetail.card.name}
                  width={160}
                  height={224}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg md:rounded-xl"
                />
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4 md:space-y-6">
              {/* Description */}
              <div className="bg-white/5 border border-purple-500/20 rounded-lg md:rounded-xl p-4 md:p-5">
                <h3 className="text-sm md:text-base font-bold text-amber-300 mb-2">📖 คำอธิบายไพ่</h3>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                  {selectedCardDetail.card.description}
                </p>
              </div>

              {/* Meaning */}
              <div className="bg-white/5 border border-amber-500/20 rounded-lg md:rounded-xl p-4 md:p-5">
                <h3 className="text-sm md:text-base font-bold text-yellow-300 mb-2">✨ ความหมาย</h3>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                  {selectedCardDetail.isReversed
                    ? selectedCardDetail.card.reversedMeaning
                    : selectedCardDetail.card.meaning}
                </p>
              </div>

              {/* Reversed Meaning (if not reversed) */}
              {!selectedCardDetail.isReversed && (
                <div className="bg-white/5 border border-red-500/20 rounded-lg md:rounded-xl p-4 md:p-5">
                  <h3 className="text-sm md:text-base font-bold text-red-300 mb-2">🔄 ความหมายเมื่อกลับด้าน</h3>
                  <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                    {selectedCardDetail.card.reversedMeaning}
                  </p>
                </div>
              )}

              {/* Card Info */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4">
                  <p className="text-xs text-slate-400 mb-1">ประเภท</p>
                  <p className="text-sm md:text-base font-semibold text-amber-300 capitalize">
                    {selectedCardDetail.card.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana'}
                  </p>
                </div>
                {selectedCardDetail.card.suit && (
                  <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4">
                    <p className="text-xs text-slate-400 mb-1">ชุด</p>
                    <p className="text-sm md:text-base font-semibold text-purple-300 capitalize">
                      {selectedCardDetail.card.suit}
                    </p>
                  </div>
                )}
                {selectedCardDetail.card.number !== undefined && (
                  <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4">
                    <p className="text-xs text-slate-400 mb-1">เลขที่</p>
                    <p className="text-sm md:text-base font-semibold text-yellow-300">
                      {selectedCardDetail.card.number}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={closeDetail}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 active:scale-95 text-slate-950 font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl shadow-lg transition-all transform hover:scale-[1.02] text-sm md:text-base"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full text-center py-4 md:py-6 text-xs text-slate-500 border-t border-slate-800 mt-6 md:mt-8 px-2">
        <p className="line-clamp-2">© 2026 ดูดวงไพ่ทาโรต์มงคล • เพื่อแนวทางและสร้างกำลังใจ</p>
      </footer>
    </div>
  );
}

/**
 * @file index.ts
 * @description ไฟล์ศูนย์รวมการจัดการและส่งออกข้อมูลไพ่ทาโรต์ทั้งหมดในระบบ
 * ทำหน้าที่รวบรวมข้อมูลจากชุดไพ่หลัก (Major Arcana) และชุดไพ่รองทั้ง 4 ธาตุ (Minor Arcana)
 * เพื่อใช้สำหรับแสดงผล ค้นหา และประมวลผลคำทำนายในแอปพลิเคชัน
 */

import { MAJOR_ARCANA } from './majorArcana';
import { WANDS_CARDS } from './wands';
import { CUPS_CARDS } from './cups';
import { SWORDS_CARDS } from './swords';
import { PENTACLES_CARDS } from './pentacles';
import type { TarotCard } from './types';

/**
 * อาเรย์หลักที่รวบรวมข้อมูลไพ่ทาโรต์ทั้งหมด 78 ใบในสำรับ
 * ประกอบด้วยไพ่ชุดใหญ่ 22 ใบ และไพ่ชุดย่อย 56 ใบจากทุกธาตุ
 */
export const TAROT_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...WANDS_CARDS,
  ...CUPS_CARDS,
  ...SWORDS_CARDS,
  ...PENTACLES_CARDS
];

/**
 * ส่งออก Type และ Interface พื้นฐานที่เกี่ยวข้องกับโครงสร้างข้อมูลของไพ่ทาโรต์
 * เพื่อให้โมดูลหรือคอมโพเนนต์อื่น ๆ สามารถอ้างอิงประเภทข้อมูลได้อย่างถูกต้องตามหลัก Type Safety
 */
export type { TarotCard };

/**
 * ค้นหาข้อมูลไพ่ทาโรต์ตาม ID
 * @param id - รหัสประจำตัวของไพ่ (เช่น 0-77)
 * @returns ข้อมูลไพ่ทาโรต์ที่ตรงกับ ID หรือ undefined หากไม่พบ
 */
export const getCardById = (id: number): TarotCard | undefined => {
  return TAROT_CARDS.find((card) => card.id === id);
};

/**
 * ค้นหาข้อมูลไพ่ทาโรต์ตามชุดธาตุ (Suit) หรือชุดใหญ่ (Major Arcana)
 * @param suit - ชื่อธาตุที่ต้องการค้นหา (wands, cups, swords, pentacles) หรือ undefined สำหรับ Major Arcana
 * @returns รายการไพ่ทาโรต์ทั้งหมดที่อยู่ในหมวดหมู่ที่กำหนด
 */
export const getCardsBySuit = (suit?: 'wands' | 'cups' | 'swords' | 'pentacles'): TarotCard[] => {
  if (!suit) {
    return TAROT_CARDS.filter((card) => card.arcana === 'major');
  }
  return TAROT_CARDS.filter((card) => card.suit === suit);
};

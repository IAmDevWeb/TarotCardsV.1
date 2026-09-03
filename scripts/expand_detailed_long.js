const fs = require('fs')
const path = require('path')

const schemaPath = path.join(__dirname, '..', '.agents', 'skills', 'tarot-skill', 'tarot_cards.schema.json')
const outMd = path.join(__dirname, '..', '.agents', 'skills', 'tarot-skill', 'DETAILED.md')

if (!fs.existsSync(schemaPath)) {
  console.error('Schema not found:', schemaPath)
  process.exit(1)
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'))

function pickAdvice(text, role, orientation) {
  const t = String(text || '').toLowerCase()
  if (t.includes('เริ่ม') || t.includes('โอกาส') || t.includes('ไอเดีย')) return 'เริ่มด้วยการทดลองขนาดเล็กและตั้งเกณฑ์วัดผลชัดเจน'
  if (t.includes('ความเสี่ยง') || t.includes('เสี่ยง')) return 'ตั้งงบประมาณความเสี่ยงและเตรียมแผนสำรอง'
  if (t.includes('ความสำเร็จ') || t.includes('ผล')) return 'รักษาความต่อเนื่องและแบ่งงานเป็นขั้นตอน'
  if (t.includes('ความไม่แน่นอน') || t.includes('ไม่ชัด')) return 'เก็บข้อมูลเพิ่มและรอจังหวะก่อนตัดสินใจ'
  if (t.includes('ขาด') || t.includes('หมดแรง') || t.includes('เหนื่อย')) return 'หาแหล่งสนับสนุน และพิจารณาลดภาระลงชั่วคราว'
  if (t.includes('การเปลี่ยน') || t.includes('เปลี่ยนผ่าน')) return 'ยอมรับการเปลี่ยนแปลงและวางแผนปรับตัวอย่างเป็นระบบ'
  return 'ประเมินสถานการณ์และปรึกษาผู้เกี่ยวข้องก่อนลงมือ'
}

function sentenceize(base, role, orientation) {
  const s1 = `การ์ดนี้สะท้อน ${base}.`
  const s2 = `ในบริบทของ${role} นั่นอาจหมายถึง ${base} และอาจส่งผลให้เกิดผลลัพธ์ที่ชัดเจนหรือเปลี่ยนแปลงในมุมมองการทำงาน/ความสัมพันธ์/การเงิน.`
  const advice = pickAdvice(base, role, orientation)
  const s3 = `คำแนะนำ: ${advice}.`
  return `${s1} ${s2} ${s3}`
}

let out = '# DETAILED Tarot Meanings — Expanded (Upright / Reversed)\n\n'
out += 'ไฟล์นี้สร้างโดยสคริปต์เพื่อขยายคำอธิบายเป็นย่อหน้าสั้น ๆ (3 ประโยคโดยประมาณ) สำหรับแต่ละหมวด: งาน / ความรัก / การเงิน\n\n';

(schema.cards || []).forEach(card => {
  out += `### ${card.name}\n`
  // Upright
  out += `- Upright:\n`
  for (const roleKey of ['work','love','finance']) {
    const base = (card.upright && card.upright[roleKey]) || ''
    const roleLabel = roleKey === 'work' ? 'งาน' : roleKey === 'love' ? 'ความรัก' : 'การเงิน'
    const text = sentenceize(base, roleLabel, 'upright')
    out += `  - ${roleLabel}: ${text}\n`
  }
  // Reversed
  out += `- Reversed:\n`
  for (const roleKey of ['work','love','finance']) {
    const base = (card.reversed && card.reversed[roleKey]) || ''
    const roleLabel = roleKey === 'work' ? 'งาน' : roleKey === 'love' ? 'ความรัก' : 'การเงิน'
    const s1 = `การ์ดนี้เมื่อกลับด้านอาจสะท้อน ${base}.`
    const advice = pickAdvice(base, roleLabel, 'reversed')
    const s2 = `คำแนะนำ: ${advice}.`
    out += `  - ${roleLabel}: ${s1} ${s2}\n`
  }
  out += '\n'
})

fs.writeFileSync(outMd, out, 'utf8')
console.log('Wrote expanded DETAILED.md with', (schema.cards || []).length, 'cards')

process.exit(0)

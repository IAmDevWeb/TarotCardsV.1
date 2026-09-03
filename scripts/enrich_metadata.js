const fs = require('fs')
const path = require('path')

const schemaPath = path.join(__dirname, '..', '.agents', 'skills', 'tarot-skill', 'tarot_cards.schema.json')

if (!fs.existsSync(schemaPath)) {
  console.error('Schema file not found:', schemaPath)
  process.exit(1)
}

const raw = fs.readFileSync(schemaPath, 'utf8')
const schema = JSON.parse(raw)

function slugParts(slug) {
  return String(slug || '').split(/[-_\s]+/).filter(Boolean)
}

function nameParts(name) {
  return String(name || '').split(/\s+/).map(s => s.replace(/[,:.]/g, '')).filter(Boolean)
}

function ensureArray(a) { return Array.isArray(a) ? a : [] }

schema.cards = ensureArray(schema.cards).map(card => {
  // ensure tags include arcana and suit
  card.tags = ensureArray(card.tags)
  if (card.arcana && !card.tags.includes(card.arcana)) card.tags.push(card.arcana)
  if (card.suit && !card.tags.includes(card.suit)) card.tags.push(card.suit)

  // image alt text (English + Thai)
  const enAlt = `${card.name} tarot card`
  const thAlt = `${card.name} ไพ่ทาโรต์`
  card.imageAlt_en = card.imageAlt_en || enAlt
  card.imageAlt_th = card.imageAlt_th || thAlt

  // keywords: slug parts, name parts, arcana, suit, generic tags
  const kws = new Set(ensureArray(card.keywords))
  slugParts(card.slug).forEach(p => kws.add(p))
  nameParts(card.name).forEach(p => kws.add(p.toLowerCase()))
  if (card.arcana) kws.add(card.arcana.toLowerCase())
  if (card.suit) kws.add(card.suit.toLowerCase())
  kws.add('tarot')
  kws.add('ไพ่')
  // include upright/reversed labels
  kws.add('upright')
  kws.add('reversed')

  card.keywords = Array.from(kws)

  return card
})

fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + '\n', 'utf8')
console.log('Enriched metadata for', schema.cards.length, 'cards')

process.exit(0)

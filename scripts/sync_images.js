const fs = require('fs')
const path = require('path')

const publicDir = path.join(__dirname, '..', 'public', 'Cards-png')
const schemaPath = path.join(__dirname, '..', '.agents', 'skills', 'tarot-skill', 'tarot_cards.schema.json')

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

if (!fs.existsSync(publicDir)) {
  console.error('Public image directory not found:', publicDir)
  process.exit(1)
}

if (!fs.existsSync(schemaPath)) {
  console.error('Schema file not found:', schemaPath)
  process.exit(1)
}

const files = fs.readdirSync(publicDir)
const fileMap = {}

// helper for suit files like Cups01 -> ace-of-cups
const ranks = ['ace','two','three','four','five','six','seven','eight','nine','ten','page','knight','queen','king']

files.forEach(f => {
  const base = path.basename(f)
  const noExt = base.replace(/\.[^.]+$/, '')
  const lower = noExt.toLowerCase()
  const rawNoExt = noExt

  // raw key (lowercase)
  fileMap[lower] = base

  // strip leading numbers but keep original casing for CamelCase splitting
  const stripLeadingRaw = rawNoExt.replace(/^\d+-/, '')
  const stripLeadingLower = stripLeadingRaw.toLowerCase()
  fileMap[stripLeadingLower] = base

  // try splitting CamelCase (use raw) to words then slugify -> produces hyphens
  const camelSplit = stripLeadingRaw.replace(/([a-z])([A-Z])/g, '$1 $2')
  fileMap[slugify(camelSplit)] = base
  fileMap[slugify(stripLeadingRaw.replace(/[-_]/g, ' '))] = base

  // handle suits like Cups01, Pentacles02, Wands14, Swords03
  const suitMatch = noExt.match(/^(cups|pentacles|swords|wands)(\d+)$/i)
  if (suitMatch) {
    const suit = suitMatch[1].toLowerCase()
    const num = parseInt(suitMatch[2], 10)
    if (num >= 1 && num <= ranks.length) {
      const rank = ranks[num - 1]
      const candidate = `${rank}-of-${suit}`
      fileMap[candidate] = base
    }
  }
})

const schemaRaw = fs.readFileSync(schemaPath, 'utf8')
let schema
try {
  schema = JSON.parse(schemaRaw)
} catch (err) {
  console.error('Failed to parse schema json:', err.message)
  process.exit(1)
}

let updated = 0
const missing = []

schema.cards = (schema.cards || []).map(card => {
  const candidates = []
  if (card.slug) candidates.push(card.slug.toLowerCase())
  if (card.name) candidates.push(slugify(card.name))
  if (card.id) candidates.push(slugify(card.id))
  // try also without leading "the-" for safety
  if (card.slug && card.slug.startsWith('the-')) candidates.push(card.slug.replace(/^the-/, ''))

  let found = null
  for (const c of candidates) {
    if (!c) continue
    if (fileMap[c]) { found = fileMap[c]; break }
  }

  if (found) {
    const newPath = '/Cards-png/' + found
    if (card.imagePath !== newPath) {
      card.imagePath = newPath
      updated++
    }
  } else {
    missing.push({ id: card.id, name: card.name, expected: card.slug })
  }

  return card
})

fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + '\n', 'utf8')

console.log(`Sync complete: updated=${updated} missing=${missing.length}`)
if (missing.length > 0) {
  console.log('Missing images for:')
  missing.slice(0, 50).forEach(m => console.log('- ' + (m.id || m.expected) + ' (' + m.name + ')'))
}

process.exit(0)

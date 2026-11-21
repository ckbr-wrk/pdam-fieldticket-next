const fs = require('fs');

const seed = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/scratch/pdam-fieldticket-next/src/lib/seed-data.ts', 'utf8');

// extract INITIAL_TICKETS from seed
const match = seed.match(/export const INITIAL_TICKETS: Ticket\[\] = (\[[\s\S]*?\]);\s*$/);
if (!match) {
  console.error('Could not find INITIAL_TICKETS');
  process.exit(1);
}

const tickets = JSON.parse(match[1]);
console.log('Read', tickets.length, 'tickets from seed-data.ts');

const sqlValues = tickets.map(t => {
  const desc = t.deskripsi.replace(/'/g, "''");
  const nama = t.nama_pelanggan.replace(/'/g, "''");
  const pipe = t.ukuran_pipa ? "'" + t.ukuran_pipa.replace(/'/g, "''") + "'" : 'NULL';
  const assigned = t.assigned_to ? "'" + t.assigned_to + "'" : 'NULL';
  return `  (uuid_generate_v4(), '${t.nomor_tiket}', '${t.pelapor_id}', '${t.pelanggan_id}', '${nama}', '${t.no_hp}', ${pipe}, '${t.kategori_id}', '${t.wilayah_id}', '${desc}', ${t.lat}, ${t.lng}, ${t.akurasi_gps}, '${t.prioritas}', '${t.status}', ${assigned}, '${t.created_at}', '${t.updated_at}')`;
}).join(',\n');

let schema = fs.readFileSync('C:/Users/MSI/.gemini/antigravity/scratch/pdam-fieldticket-next/supabase/schema.sql', 'utf8');

const insertPrefix = 'INSERT INTO tickets (id, nomor_tiket, pelapor_id, pelanggan_id, nama_pelanggan, no_hp, ukuran_pipa, kategori_id, wilayah_id, deskripsi, lat, lng, akurasi_gps, prioritas, status, assigned_to, created_at, updated_at) VALUES\n';

if (schema.includes('INSERT INTO tickets')) {
  schema = schema.replace(/INSERT INTO tickets \([^\)]+\) VALUES[\s\S]*?ON CONFLICT \(nomor_tiket\) DO UPDATE SET/i, insertPrefix + sqlValues + '\nON CONFLICT (nomor_tiket) DO UPDATE SET');
}

fs.writeFileSync('C:/Users/MSI/.gemini/antigravity/scratch/pdam-fieldticket-next/supabase/schema.sql', schema, 'utf8');
console.log('Updated supabase/schema.sql with', tickets.length, 'real tickets!');

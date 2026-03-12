const { Pool } = require('pg');

const pool = new Pool({
  connectionString: `postgresql://${process.env.NEON_USER}:${process.env.NEON_PASS}@${process.env.NEON_HOST}/neondb?sslmode=require`
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { query, params } = req.body;

  try {
    const result = await pool.query(query, params);
    res.status(200).json({ rows: result.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
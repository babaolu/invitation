import express from 'express';
import crypto from 'crypto';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

async function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.replace('Bearer ', '');
  const { data: userData, error } = await supabase.auth.getUser(token);
  if (error || !userData?.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

function generateSlug(name) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);
  const suffix = crypto.randomBytes(4).toString('hex').slice(0, 5);
  return `${base || 'guest'}-${suffix}`;
}

// GET /api/admin/guests — full guest list for the admin dashboard table
router.get('/api/admin/guests', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('guests')
    .select('id, slug, full_name, table_number')
    .order('table_number', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ guests: data });
});

// POST /api/admin/guests — create a new guest
router.post('/api/admin/guests', requireAdmin, async (req, res) => {
  const { full_name, table_number } = req.body;
  if (!full_name || !table_number) {
    return res.status(400).json({ error: 'full_name and table_number are required' });
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    const slug = generateSlug(full_name);
    const { data, error } = await supabase
      .from('guests')
      .insert({ slug, full_name, table_number: Number(table_number) })
      .select()
      .single();

    if (!error) return res.status(201).json({ guest: data });
    if (!error.message.includes('duplicate') && !error.message.includes('unique')) {
      return res.status(500).json({ error: error.message });
    }
    // else: slug collision, loop retries with a new slug
  }
  res.status(500).json({ error: 'Failed to generate a unique slug after retries' });
});

// PATCH /api/admin/guests/:id — reassign a guest's table number.
// Their slug (and therefore their PDF/QR link) never changes.
router.patch('/api/admin/guests/:id', requireAdmin, async (req, res) => {
  const { table_number } = req.body;
  if (!table_number) return res.status(400).json({ error: 'table_number is required' });

  const { data, error } = await supabase
    .from('guests')
    .update({ table_number: Number(table_number) })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ guest: data });
});

// DELETE /api/admin/guests/:id — remove a guest
router.delete('/api/admin/guests/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;

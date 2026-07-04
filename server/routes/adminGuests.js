import express from 'express';
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

// GET /api/admin/guests — full guest list for the admin dashboard table
router.get('/api/admin/guests', requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('guests')
    .select('id, slug, full_name, table_number')
    .order('table_number', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ guests: data });
});

// PATCH /api/admin/guests/:id — reassign a guest's table number.
// Their slug (and therefore their PDF/QR link) never changes.
router.patch('/api/admin/guests/:id', requireAdmin, async (req, res) => {
  const { table_number } = req.body;
  if (!table_number) return res.status(400).json({ error: 'table_number is required' });

  const { data, error } = await supabase
    .from('guests')
    .update({ table_number })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ guest: data });
});

export default router;

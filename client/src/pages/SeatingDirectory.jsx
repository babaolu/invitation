import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, API_BASE } from '../lib/supabaseClient';

export default function SeatingDirectory() {
  const [directory, setDirectory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadDirectory() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/admin'); return; }

    const res = await fetch(`${API_BASE}/api/admin/seating-directory`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();
    setDirectory(data.directory || []);
    setLoading(false);
  }

  useEffect(() => { loadDirectory(); }, []);

  async function downloadPdf() {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`${API_BASE}/api/admin/seating-directory/pdf`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seating-directory.pdf';
    a.click();
  }

  return (
    <div className="dir-wrap">
      <div className="dir-header">
        <h1>Seating Directory</h1>
        <div className="dir-nav">
          <Link to="/admin/guests">Guest Management</Link>
          <button onClick={loadDirectory}>🔀 Regenerate</button>
          <button onClick={downloadPdf} className="download">⬇ Download PDF</button>
        </div>
      </div>

      {loading ? (
        <p>Shuffling…</p>
      ) : (
        <div className="dir-grid">
          {directory.map((t) => (
            <div className="table-block" key={t.tableNumber}>
              <div className="table-title">Table {t.tableNumber}</div>
              {t.guests.map((name, i) => (
                <div className="guest-item" key={i}>{name}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .dir-wrap { padding: 32px; font-family: 'Quicksand', sans-serif; background: #f5f4ec; min-height: 100vh; }
        .dir-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .dir-header h1 { font-family: 'Cormorant Garamond', serif; font-weight: 300; color: #2e3a40; }
        .dir-nav { display: flex; gap: 12px; align-items: center; }
        .dir-nav a { color: #7a9aaa; text-decoration: none; font-size: 14px; }
        .dir-nav button { padding: 8px 16px; border: none; border-radius: 20px; background: #eaf2f6; color: #2e3a40; cursor: pointer; font-size: 13px; }
        .dir-nav button.download { background: #7a9aaa; color: #fff; }
        .dir-grid { columns: 3; column-gap: 16px; }
        .table-block {
          break-inside: avoid; background: #fff; border: 1px solid #ddeaf0; border-radius: 8px;
          padding: 14px 16px; margin-bottom: 16px;
        }
        .table-title {
          font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #2e3a40;
          border-bottom: 1px solid #eaf2f6; padding-bottom: 6px; margin-bottom: 8px;
        }
        .guest-item { font-size: 12px; color: #4a6070; padding: 2px 0; }
      `}</style>
    </div>
  );
}

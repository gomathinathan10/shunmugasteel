import { useEffect, useState } from 'react'
import { getNewsletterSubscribers } from '../services/adminApi'
import Spinner from '../components/ui/Spinner'

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  titleWrap: { display: 'flex', alignItems: 'baseline', gap: 8 },
  title: { fontSize: 24, fontWeight: 700, color: '#0F172A', margin: 0 },
  count: { fontSize: 15, fontWeight: 400, color: '#94A3B8' },
  searchInput: {
    border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 14px',
    fontSize: 13, width: 260, outline: 'none', color: '#0F172A', background: '#fff',
  },
  card: { background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  spinner: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 192 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  thead: { background: '#F8FAFC' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9' },
  tdNum: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#CBD5E1', fontSize: 12 },
  tdEmail: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontWeight: 500, color: '#0F172A' },
  tdDate: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 12 },
  tdStatus: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9' },
  activeBadge: { display: 'inline-block', background: '#DCFCE7', color: '#16A34A', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 },
  inactiveBadge: { display: 'inline-block', background: '#F1F5F9', color: '#94A3B8', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 },
  emptyWrap: { padding: '56px 16px', textAlign: 'center' },
  emptyIcon: { fontSize: 32, marginBottom: 10 },
  emptyText: { color: '#94A3B8', fontSize: 14 },
  emptyNote: { color: '#CBD5E1', fontSize: 12, marginTop: 4 },
  exportBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: '#F97316', color: '#fff', fontSize: 13, fontWeight: 600,
  },
}

export default function Subscribers() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    getNewsletterSubscribers()
      .then((r) => setRows(Array.isArray(r.data) ? r.data : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = search
    ? rows.filter((r) => r.email?.toLowerCase().includes(search.toLowerCase()))
    : rows

  function exportCSV() {
    const header = 'Email,Status,Subscribed At'
    const lines  = filtered.map((r) => `${r.email},${r.status},${new Date(r.subscribed_at).toLocaleString('en-IN')}`)
    const blob   = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
    const url    = URL.createObjectURL(blob)
    const a      = document.createElement('a')
    a.href       = url
    a.download   = `subscribers_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={S.page}>
      <div style={S.topRow}>
        <div style={S.titleWrap}>
          <h2 style={S.title}>Newsletter Subscribers</h2>
          <span style={S.count}>({filtered.length})</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            style={S.searchInput}
            placeholder="Search email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#F97316'}
            onBlur={(e)  => e.target.style.borderColor = '#E2E8F0'}
          />
          {filtered.length > 0 && (
            <button style={S.exportBtn} onClick={exportCSV}
              onMouseOver={(e) => e.currentTarget.style.background = '#EA580C'}
              onMouseOut={(e)  => e.currentTarget.style.background = '#F97316'}
            >
              ↓ Export CSV
            </button>
          )}
        </div>
      </div>

      <div style={S.card}>
        {loading ? (
          <div style={S.spinner}><Spinner /></div>
        ) : (
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                {['#', 'Email', 'Status', 'Subscribed At'].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id}
                  style={{ background: '#fff' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FFF7ED'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <td style={S.tdNum}>{i + 1}</td>
                  <td style={S.tdEmail}>{row.email}</td>
                  <td style={S.tdStatus}>
                    <span style={row.status === 'active' ? S.activeBadge : S.inactiveBadge}>
                      {row.status}
                    </span>
                  </td>
                  <td style={S.tdDate}>{new Date(row.subscribed_at).toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={4} style={S.emptyWrap}>
                    <div style={S.emptyIcon}>📧</div>
                    <div style={S.emptyText}>No subscribers yet</div>
                    <div style={S.emptyNote}>Emails will appear here when visitors subscribe from the website</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

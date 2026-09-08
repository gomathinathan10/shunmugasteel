import { useEffect, useState } from 'react'
import { getEnquiries, updateEnquiry } from '../services/adminApi'
import Spinner from '../components/ui/Spinner'

const STATUS_STYLE = {
  new:     { background: '#FEF3C7', color: '#D97706' },
  read:    { background: '#EFF6FF', color: '#3B82F6' },
  replied: { background: '#DCFCE7', color: '#16A34A' },
}

const S = {
  page:      { display: 'flex', flexDirection: 'column', gap: 20 },
  topRow:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  title:     { fontSize: 24, fontWeight: 700, color: '#0F172A', margin: 0 },
  count:     { fontSize: 15, fontWeight: 400, color: '#94A3B8' },
  searchInput: { border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 14px', fontSize: 13, width: 260, outline: 'none', color: '#0F172A', background: '#fff' },
  filterBtn: (active) => ({
    padding: '6px 14px', borderRadius: 20, border: '1px solid #E2E8F0', cursor: 'pointer', fontSize: 12, fontWeight: 600,
    background: active ? '#0F172A' : '#fff', color: active ? '#fff' : '#64748B', transition: 'all 0.15s',
  }),
  card:      { background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  spinner:   { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 192 },
  table:     { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  thead:     { background: '#F8FAFC' },
  th:        { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9' },
  td:        { padding: '12px 16px', borderBottom: '1px solid #F1F5F9', verticalAlign: 'top' },
  badge:     (status) => ({ ...STATUS_STYLE[status], display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }),
  expandRow: { background: '#FAFAFA', borderBottom: '1px solid #F1F5F9' },
  expandCell:{ padding: '16px 20px', colSpan: 6 },
  label:     { fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 },
  msgBox:    { background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 16 },
  replyBox:  { background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 16 },
  textarea:  { width: '100%', border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 14px', fontSize: 13, resize: 'vertical', minHeight: 80, outline: 'none', boxSizing: 'border-box' },
  replyBtn:  { padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#F97316', color: '#fff', fontSize: 13, fontWeight: 600 },
  readBtn:   { padding: '6px 14px', borderRadius: 8, border: '1px solid #E2E8F0', cursor: 'pointer', background: '#fff', color: '#64748B', fontSize: 12, fontWeight: 500 },
}

export default function Enquiries() {
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [replyText, setReplyText] = useState({})
  const [saving, setSaving]     = useState(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    getEnquiries()
      .then((r) => setRows(Array.isArray(r.data) ? r.data : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }

  async function markRead(id) {
    setSaving(id)
    try {
      await updateEnquiry(id, { action: 'read' })
      setRows((prev) => prev.map((r) => r.id === id ? { ...r, status: 'read' } : r))
    } finally {
      setSaving(null)
    }
  }

  async function sendReply(id) {
    const reply = (replyText[id] || '').trim()
    if (!reply) return
    setSaving(id)
    try {
      await updateEnquiry(id, { action: 'reply', reply })
      setRows((prev) => prev.map((r) => r.id === id ? { ...r, status: 'replied', admin_reply: reply } : r))
      setReplyText((prev) => ({ ...prev, [id]: '' }))
    } finally {
      setSaving(null)
    }
  }

  function toggleExpand(id, status) {
    if (expanded === id) { setExpanded(null); return }
    setExpanded(id)
    if (status === 'new') markRead(id)
  }

  const filtered = rows.filter((r) => {
    const matchSearch = !search || [r.name, r.email, r.subject, r.message].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
    const matchFilter = filter === 'all' || r.status === filter
    return matchSearch && matchFilter
  })

  const counts = { all: rows.length, new: rows.filter((r) => r.status === 'new').length, read: rows.filter((r) => r.status === 'read').length, replied: rows.filter((r) => r.status === 'replied').length }

  return (
    <div style={S.page}>
      <div style={S.topRow}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <h2 style={S.title}>Contact Enquiries</h2>
          <span style={{ fontSize: 15, fontWeight: 400, color: '#94A3B8' }}>({filtered.length})</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {['all', 'new', 'read', 'replied'].map((f) => (
            <button key={f} style={S.filterBtn(filter === f)} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
          <input
            style={S.searchInput}
            placeholder="Search name, email, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#F97316'}
            onBlur={(e)  => e.target.style.borderColor = '#E2E8F0'}
          />
        </div>
      </div>

      <div style={S.card}>
        {loading ? (
          <div style={S.spinner}><Spinner /></div>
        ) : (
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                {['#', 'Name', 'Email', 'Subject', 'Status', 'Received'].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '56px 16px', textAlign: 'center', color: '#94A3B8' }}>
                    No enquiries found
                  </td>
                </tr>
              )}
              {filtered.map((row, i) => [
                <tr
                  key={row.id}
                  style={{ background: expanded === row.id ? '#FFF7ED' : '#fff', cursor: 'pointer', fontWeight: row.status === 'new' ? 600 : 400 }}
                  onMouseEnter={(e) => { if (expanded !== row.id) e.currentTarget.style.background = '#F8FAFC' }}
                  onMouseLeave={(e) => { if (expanded !== row.id) e.currentTarget.style.background = '#fff' }}
                  onClick={() => toggleExpand(row.id, row.status)}
                >
                  <td style={{ ...S.td, color: '#CBD5E1', fontSize: 12 }}>{i + 1}</td>
                  <td style={{ ...S.td, color: '#0F172A' }}>{row.name}</td>
                  <td style={{ ...S.td, color: '#64748B', fontSize: 13 }}>{row.email}</td>
                  <td style={{ ...S.td, color: '#64748B', fontSize: 13 }}>{row.subject || '—'}</td>
                  <td style={S.td}><span style={S.badge(row.status)}>{row.status}</span></td>
                  <td style={{ ...S.td, color: '#94A3B8', fontSize: 12 }}>{new Date(row.created_at).toLocaleString('en-IN')}</td>
                </tr>,

                expanded === row.id && (
                  <tr key={`${row.id}-expand`} style={S.expandRow}>
                    <td colSpan={6} style={S.expandCell}>
                      <div style={{ maxWidth: 720 }}>

                        {/* Phone */}
                        {row.phone && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={S.label}>Phone</div>
                            <div style={{ fontSize: 13, color: '#334155' }}>{row.phone}</div>
                          </div>
                        )}

                        {/* Message */}
                        <div style={S.label}>Message</div>
                        <div style={S.msgBox}>{row.message}</div>

                        {/* Existing note */}
                        {row.admin_reply && (
                          <>
                            <div style={S.label}>Internal Note  <span style={{ color: '#94A3B8', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— saved {new Date(row.replied_at).toLocaleString('en-IN')}</span></div>
                            <div style={S.replyBox}>{row.admin_reply}</div>
                          </>
                        )}

                        {/* Notes textarea */}
                        <div style={S.label}>{row.admin_reply ? 'Update Note' : 'Internal Note'}</div>
                        <textarea
                          style={S.textarea}
                          placeholder="Add an internal note (not visible to customer)..."
                          value={replyText[row.id] || ''}
                          onChange={(e) => setReplyText((prev) => ({ ...prev, [row.id]: e.target.value }))}
                          onFocus={(e) => e.target.style.borderColor = '#F97316'}
                          onBlur={(e)  => e.target.style.borderColor = '#E2E8F0'}
                        />
                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                          <button
                            style={{ ...S.replyBtn, opacity: saving === row.id ? 0.6 : 1 }}
                            disabled={saving === row.id}
                            onClick={(e) => { e.stopPropagation(); sendReply(row.id) }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#EA580C'}
                            onMouseOut={(e)  => e.currentTarget.style.background = '#F97316'}
                          >
                            {saving === row.id ? 'Saving…' : 'Save Note'}
                          </button>
                          {row.status === 'new' && (
                            <button
                              style={S.readBtn}
                              onClick={(e) => { e.stopPropagation(); markRead(row.id) }}
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ),
              ])}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

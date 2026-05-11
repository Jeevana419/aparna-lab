import { useState, useEffect } from 'react'
import { getTests, createTest, updateTest, deleteTest } from '../services/api'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import { toast } from '../components/Toast'

const emptyForm = { name: '', description: '', price: '' }

export default function AdminTests() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')

  const load = () => getTests().then(r => setTests(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (t) => { setEditing(t); setForm({ name: t.name, description: t.description || '', price: t.price }); setModalOpen(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) { toast('Name and price are required', 'error'); return }
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) { toast('Price must be a positive number', 'error'); return }
    setSubmitting(true)
    try {
      const data = { name: form.name.trim(), description: form.description.trim(), price: parseFloat(form.price) }
      if (editing) {
        await updateTest(editing.id, data)
        toast('Test updated successfully')
      } else {
        await createTest(data)
        toast('Test added successfully')
      }
      setModalOpen(false)
      load()
    } catch {
      toast('Operation failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await deleteTest(id)
      toast('Test deleted')
      load()
    } catch {
      toast('Delete failed', 'error')
    }
  }

  const filtered = tests.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-800 mb-1">Manage Tests</h1>
          <p className="text-slate-500">{tests.length} tests available</p>
        </div>
        <button onClick={openAdd} className="btn-primary">+ Add Test</button>
      </div>

      <div className="relative mb-6 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input className="input pl-9" placeholder="Search tests..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Test Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-slate-400">No tests found.</td></tr>
            ) : (
              filtered.map((t, i) => (
                <tr key={t.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                  <td className="px-6 py-4 font-medium text-slate-800">{t.name}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm max-w-xs">
                    <span className="line-clamp-1">{t.description || '—'}</span>
                  </td>
                  <td className="px-6 py-4 text-teal-700 font-semibold">₹{t.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(t)} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(t.id, t.name)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Test' : 'Add New Test'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Test Name *</label>
            <input className="input" placeholder="e.g. Complete Blood Count" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Brief description of the test..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Price (₹) *</label>
            <input type="number" step="0.01" min="0" className="input" placeholder="0.00"
              value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
              {submitting ? 'Saving...' : editing ? 'Update Test' : 'Add Test'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { getMedicines, createMedicine, updateMedicine, deleteMedicine } from '../services/api'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import { toast } from '../components/Toast'

const emptyForm = { name: '', description: '', price: '', stock: '' }

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')

  const load = () => getMedicines().then(r => setMedicines(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (m) => {
    setEditing(m)
    setForm({ name: m.name, description: m.description || '', price: m.price, stock: m.stock })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price || form.stock === '') { toast('All required fields must be filled', 'error'); return }
    setSubmitting(true)
    try {
      const data = { name: form.name.trim(), description: form.description.trim(), price: parseFloat(form.price), stock: parseInt(form.stock) }
      if (editing) {
        await updateMedicine(editing.id, data)
        toast('Medicine updated successfully')
      } else {
        await createMedicine(data)
        toast('Medicine added successfully')
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
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await deleteMedicine(id)
      toast('Medicine deleted')
      load()
    } catch {
      toast('Delete failed', 'error')
    }
  }

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-slate-800 mb-1">Manage Medicines</h1>
          <p className="text-slate-500">{medicines.length} medicines in catalog</p>
        </div>
        <button onClick={openAdd} className="btn-primary">+ Add Medicine</button>
      </div>

      <div className="relative mb-6 max-w-md">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input className="input pl-9" placeholder="Search medicines..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Price</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-slate-400">No medicines found.</td></tr>
            ) : (
              filtered.map((m, i) => (
                <tr key={m.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                  <td className="px-6 py-4 font-medium text-slate-800">{m.name}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm max-w-xs">
                    <span className="line-clamp-1">{m.description || '—'}</span>
                  </td>
                  <td className="px-6 py-4 text-blue-700 font-semibold">₹{m.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${m.stock > 10 ? 'text-emerald-600' : m.stock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                      {m.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(m)} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(m.id, m.name)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Medicine' : 'Add New Medicine'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Medicine Name *</label>
            <input className="input" placeholder="e.g. Paracetamol 500mg" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Brief description..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₹) *</label>
              <input type="number" step="0.01" min="0" className="input" placeholder="0.00"
                value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="label">Stock *</label>
              <input type="number" min="0" className="input" placeholder="0"
                value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
              {submitting ? 'Saving...' : editing ? 'Update' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

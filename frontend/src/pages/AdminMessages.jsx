import { useState, useEffect } from 'react'
import { getMessages, replyToMessage, deleteMessage } from '../services/api'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import { toast } from '../components/Toast'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [replyModal, setReplyModal] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = () => getMessages().then(r => setMessages(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openReply = (msg) => { setReplyModal(msg); setReplyText(msg.reply || '') }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) { toast('Reply cannot be empty', 'error'); return }
    setSubmitting(true)
    try {
      await replyToMessage(replyModal.id, replyText)
      toast('Reply sent successfully')
      setReplyModal(null)
      load()
    } catch {
      toast('Failed to send reply', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return
    try {
      await deleteMessage(id)
      toast('Message deleted')
      load()
    } catch {
      toast('Delete failed', 'error')
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-800 mb-1">Messages</h1>
        <p className="text-slate-500">{messages.length} messages from users</p>
      </div>

      {messages.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">💬</div>
          <p>No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`card hover:shadow-md transition-all ${!msg.reply ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-emerald-400'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-slate-800">{msg.sender_name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${msg.reply ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {msg.reply ? '✅ Replied' : '⏳ Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-teal-600 font-medium mb-3">📞 {msg.contact}</p>
                  <div className="bg-slate-50 rounded-xl p-4 mb-3">
                    <p className="text-slate-700 text-sm leading-relaxed">{msg.message}</p>
                  </div>
                  {msg.reply && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                      <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">Your Reply</p>
                      <p className="text-emerald-800 text-sm leading-relaxed">{msg.reply}</p>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    {msg.created_at ? new Date(msg.created_at).toLocaleString('en-IN') : ''}
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => openReply(msg)} className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors whitespace-nowrap">
                    {msg.reply ? '✏️ Edit Reply' : '💬 Reply'}
                  </button>
                  <button onClick={() => handleDelete(msg.id)} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!replyModal} onClose={() => setReplyModal(null)} title="Reply to Message">
        {replyModal && (
          <div>
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">From: {replyModal.sender_name} ({replyModal.contact})</p>
              <p className="text-slate-700 text-sm">{replyModal.message}</p>
            </div>
            <form onSubmit={handleReply} className="space-y-4">
              <div>
                <label className="label">Your Reply</label>
                <textarea
                  className="input resize-none"
                  rows={5}
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="button" className="btn-secondary flex-1" onClick={() => setReplyModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}

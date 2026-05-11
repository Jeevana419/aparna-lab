import { useState, useEffect } from 'react'

let toastFn = null

export function useToast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastFn = (msg, type = 'success') => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, msg, type }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
    }
    return () => { toastFn = null }
  }, [])

  return { toasts }
}

export function toast(msg, type = 'success') {
  if (toastFn) toastFn(msg, type)
}

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up max-w-xs ${
            t.type === 'success' ? 'bg-emerald-600 text-white' :
            t.type === 'error' ? 'bg-red-600 text-white' :
            'bg-slate-800 text-white'
          }`}
        >
          {t.type === 'success' ? '✅ ' : t.type === 'error' ? '❌ ' : 'ℹ️ '}{t.msg}
        </div>
      ))}
    </div>
  )
}

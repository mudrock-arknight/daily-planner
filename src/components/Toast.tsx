import { useState, useEffect, useCallback } from 'react'

type ToastType = 'success' | 'error'

interface Toast {
  id: number
  message: string
  type: ToastType
}

let toastId = 0
let addToastFn: ((message: string, type: ToastType) => void) | null = null

export function showToast(message: string, type: ToastType = 'success') {
  if (addToastFn) {
    addToastFn(message, type)
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  useEffect(() => {
    addToastFn = addToast
    return () => {
      addToastFn = null
    }
  }, [addToast])

  return (
    <div className="fixed bottom-24 left-0 right-0 flex flex-col items-center gap-2 z-[100] pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            px-6 py-3 rounded-card shadow-card text-white font-medium text-base
            animate-toast-slide-in pointer-events-auto
            ${toast.type === 'success' ? 'bg-success' : 'bg-danger'}
          `}
        >
          <span className="mr-2">{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      ))}
    </div>
  )
}

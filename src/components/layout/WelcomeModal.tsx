import { useState, useEffect } from 'react'
import { Sparkles, Users, Bell, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useUi } from '@/context/UiContext'

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const { openLeadForm } = useUi()

  useEffect(() => {
    const hasSeen = localStorage.getItem('customerflow_welcome_seen')
    if (!hasSeen) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = (addCustomer = false) => {
    localStorage.setItem('customerflow_welcome_seen', 'true')
    setIsOpen(false)
    if (addCustomer) {
      openLeadForm()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-up">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        
        {/* Animated Background Header */}
        <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-6 flex items-start justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Sparkles className="size-3.5 text-yellow-300" />
            Step {step} of 3
          </div>
          <button onClick={() => handleClose(false)} className="text-white/70 hover:text-white transition-colors text-sm font-medium">
            Skip
          </button>
        </div>

        <div className="px-8 pb-8 pt-0 text-center">
          {/* Icon floating over the header */}
          <div className="-mt-12 mb-4 inline-flex size-24 items-center justify-center rounded-full bg-white shadow-xl">
            {step === 1 && <Sparkles className="size-10 text-indigo-600 animate-pulse" />}
            {step === 2 && <Users className="size-10 text-indigo-600" />}
            {step === 3 && <Bell className="size-10 text-indigo-600" />}
          </div>

          {/* Step 1 Content */}
          {step === 1 && (
            <div className="animate-fade-up space-y-3">
              <h2 className="text-2xl font-bold text-slate-900">Welcome to CustomerFlow!</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                This is your digital notebook. It is designed to be incredibly simple so you can focus on what matters most: <strong>growing your business.</strong>
              </p>
            </div>
          )}

          {/* Step 2 Content */}
          {step === 2 && (
            <div className="animate-fade-up space-y-3">
              <h2 className="text-2xl font-bold text-slate-900">Keep track of everyone</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                Add your customers, write down their details, and keep all your notes in one safe place. No more lost sticky notes or forgotten numbers.
              </p>
            </div>
          )}

          {/* Step 3 Content */}
          {step === 3 && (
            <div className="animate-fade-up space-y-3">
              <h2 className="text-2xl font-bold text-slate-900">Never forget a call</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                Set simple reminders to follow up with people. Watch your dashboard fill up as you turn your contacts into paying customers!
              </p>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
              ))}
            </div>

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} variant="primary" className="rounded-full px-6">
                Next <ArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button onClick={() => handleClose(true)} variant="primary" className="rounded-full px-6 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200">
                <CheckCircle2 className="mr-2 size-4" /> Add my first customer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

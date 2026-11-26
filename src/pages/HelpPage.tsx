import { BookOpen, HelpCircle, Phone, MessageSquare } from 'lucide-react'

export function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-up py-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">How can we help you?</h1>
        <p className="mt-2 text-slate-500">Search our guides or contact support.</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md">
          <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <BookOpen className="size-6" />
          </div>
          <h2 className="mt-4 font-semibold text-slate-900">Getting Started</h2>
          <p className="mt-1 text-sm text-slate-500">Learn the basics of adding customers and tracking them.</p>
        </div>
        
        <div className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md">
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <HelpCircle className="size-6" />
          </div>
          <h2 className="mt-4 font-semibold text-slate-900">Reminders</h2>
          <p className="mt-1 text-sm text-slate-500">How to never forget to call a customer again.</p>
        </div>

        <div className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-md">
          <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Phone className="size-6" />
          </div>
          <h2 className="mt-4 font-semibold text-slate-900">Call Support</h2>
          <p className="mt-1 text-sm text-slate-500">Speak directly with our team for urgent issues.</p>
        </div>

        <div className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-purple-300 hover:shadow-md">
          <div className="flex size-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <MessageSquare className="size-6" />
          </div>
          <h2 className="mt-4 font-semibold text-slate-900">Live Chat</h2>
          <p className="mt-1 text-sm text-slate-500">Chat with us on Telegram or WhatsApp.</p>
        </div>
      </div>
    </div>
  )
}

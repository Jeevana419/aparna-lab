import { Link } from 'react-router-dom'

export default function Home() {
  const features = [
    { icon: '🧪', title: 'Lab Tests', desc: 'Book diagnostic tests from the comfort of your home. Results delivered promptly.', link: '/tests', color: 'from-teal-50 to-cyan-50 border-teal-100' },
    { icon: '💊', title: 'Medicines', desc: 'Request prescription and OTC medicines. Wide range available at affordable prices.', link: '/medicines', color: 'from-blue-50 to-indigo-50 border-blue-100' },
    { icon: '📋', title: 'My Requests', desc: 'Track the status of all your bookings and medicine requests in one place.', link: '/my-requests', color: 'from-purple-50 to-violet-50 border-purple-100' },
    { icon: '💬', title: 'Contact Us', desc: 'Have a question? Reach out to our team directly through our contact form.', link: '/contact', color: 'from-amber-50 to-orange-50 border-amber-100' },
  ]

  const stats = [
    { value: '43+', label: 'Tests Available' },
    { value: '24/7', label: 'Service Available' },
    { value: '100%', label: 'Accuracy' },
    { value: 'Same Day', label: 'Results' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Open & Accepting Bookings
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold leading-tight mb-3">
              Aparna Laboratory
            </h1>
            <p className="text-teal-200 text-base font-semibold mb-1 uppercase tracking-widest">Clinical Reference Diagnostic Centre</p>
            <p className="text-teal-100 text-sm mb-1">📍 Vinukonda Road, Kurichedu, Prakasam Dist.</p>
            <p className="text-teal-100 text-sm mb-6">📞 90147 86264 &nbsp;|&nbsp; 90007 61921</p>
            <p className="text-lg text-teal-100 mb-8 leading-relaxed max-w-xl">
              All types of stool, urine, blood tests and X-rays available. Book diagnostic tests online and we'll contact you to confirm. 24 Hrs Service Available.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/tests" className="bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl active:scale-95">
                Book a Lab Test →
              </Link>
              <Link to="/medicines" className="bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-all border border-white/30">
                Browse Medicines
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-teal-200">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-slate-800 mb-3">Our Services</h2>
          <p className="text-slate-500 text-lg">Everything you need for your health management</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <Link
              key={f.title}
              to={f.link}
              className={`group bg-gradient-to-br ${f.color} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              <div className="mt-4 text-teal-600 text-sm font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
                Learn more <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-slate-400 text-lg">Simple, fast, and reliable</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse & Select', desc: 'Browse our catalog of lab tests and medicines. Find exactly what you need.' },
              { step: '02', title: 'Submit Request', desc: 'Fill out a simple form with your details. No account needed.' },
              { step: '03', title: 'Get Confirmation', desc: 'Track your request status. Our team reviews and approves promptly.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-2xl text-2xl font-mono font-bold mb-4">{s.step}</div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-teal-50 border border-teal-100 rounded-3xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-semibold text-slate-800 mb-1">Location</h3>
            <p className="text-slate-500 text-sm">Vinukonda Road, Kurichedu<br />Prakasam District</p>
          </div>
          <div>
            <div className="text-3xl mb-2">📞</div>
            <h3 className="font-semibold text-slate-800 mb-1">Contact Us</h3>
            <p className="text-slate-500 text-sm">90147 86264<br />90007 61921</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🕐</div>
            <h3 className="font-semibold text-slate-800 mb-1">Working Hours</h3>
            <p className="text-slate-500 text-sm">Open 24 Hours<br />7 Days a Week</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-12 text-white">
          <h2 className="font-display text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-teal-100 text-lg mb-8">Book your lab test or request medicines today. No account required.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tests" className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-xl hover:bg-teal-50 transition-all shadow-lg">
              Book Lab Test
            </Link>
            <Link to="/medicines" className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/30 transition-all border border-white/30">
              Request Medicine
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

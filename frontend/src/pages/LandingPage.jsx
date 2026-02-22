import { Zap, BarChart3, ShieldCheck, Users, TrendingUp, Box } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="font-sans" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .landing { font-family: 'Plus Jakarta Sans', sans-serif; }
        .feature-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(15,118,110,0.1); }
      `}</style>

      <div className="landing">

        {/* ── HERO ── */}
        <section className="text-center px-6 py-24 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6"
            style={{ background: '#ccfbf1', color: 'var(--color-primary)' }}>
            Built for modern inventory teams
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Manage your stock,{" "}
            <span style={{ color: 'var(--color-primary)' }}>not spreadsheets.</span>
          </h1>

          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--color-muted)', lineHeight: '1.7' }}>
            StockFlow gives your team real-time visibility over every product,
            every sale, and every restock — in one clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register">
              <button className="px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition"
                style={{ background: 'var(--color-primary)' }}>
                Get Started Free
              </button>
            </a>
            <a href="/login">
              <button className="px-8 py-3 rounded-xl font-semibold text-sm hover:bg-white transition"
                style={{ border: '2px solid var(--color-border)', color: 'var(--color-text)' }}>
                Login
              </button>
            </a>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="py-10 bg-white"
          style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '10K+', label: 'Products Tracked' },
                { value: '500+', label: 'Teams Using StockFlow' },
                { value: '99.9%', label: 'Uptime' },
                { value: '< 1s', label: 'Real-time Updates' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-extrabold mb-1" style={{ color: 'var(--color-primary)' }}>{value}</p>
                  <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-24" style={{ background: 'var(--color-bg)' }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Features</p>
              <h2 className="text-3xl md:text-4xl font-extrabold">Everything your team needs</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: <Zap size={22} />, title: "Real-time Stock", desc: "Every sale instantly updates inventory. No refresh, no lag.", color: 'var(--color-accent)' },
                { icon: <BarChart3 size={22} />, title: "Revenue Reports", desc: "See which products and categories drive the most revenue.", color: 'var(--color-primary)' },
                { icon: <ShieldCheck size={22} />, title: "Role-based Access", desc: "Admins manage everything. Staff handle daily sales only.", color: '#22c55e' },
                { icon: <Users size={22} />, title: "Staff Approval", desc: "New staff need admin approval before they can login.", color: '#8b5cf6' },
                { icon: <TrendingUp size={22} />, title: "Low Stock Alerts", desc: "Get alerted when items hit restock level automatically.", color: '#ef4444' },
                { icon: <Box size={22} />, title: "Categories", desc: "Organise products into categories and filter reports.", color: '#f59e0b' },
              ].map(({ icon, title, desc, color }) => (
                <div key={title} className="feature-card p-6 rounded-2xl bg-white"
                  style={{ border: '1px solid var(--color-border)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: color + '18', color }}>
                    {icon}
                  </div>
                  <h3 className="font-bold text-base mb-1">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>How it works</p>
              <h2 className="text-3xl md:text-4xl font-extrabold">Up and running in minutes</h2>
            </div>
            <div className="space-y-4">
              {[
                { step: 1, title: "Create your admin account", desc: "Sign up as admin — instant access, no approval needed." },
                { step: 2, title: "Add products and categories", desc: "Set up inventory with names, prices, stock levels, and categories." },
                { step: 3, title: "Invite and approve staff", desc: "Staff register themselves. You approve them from your dashboard." },
                { step: 4, title: "Start recording sales", desc: "Staff log sales in seconds. Stock and reports update automatically." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-5 items-start p-5 rounded-2xl"
                  style={{ border: '1px solid var(--color-border)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: 'var(--color-primary)' }}>
                    {step}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{title}</h3>
                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="py-24" style={{ background: 'var(--color-bg)' }}>
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>Pricing</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Simple, honest pricing</h2>
            <p className="mb-14" style={{ color: 'var(--color-muted)' }}>No hidden fees. Cancel anytime.</p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto items-start">
              {[
                { title: "Starter", price: "$49", sub: "/mo", features: ["500 SKUs", "2 Users", "Basic Reports"], cta: "Get Started" },
                { title: "Pro", price: "$129", sub: "/mo", features: ["Unlimited SKUs", "10 Users", "Advanced Analytics", "API Access"], cta: "Start Free Trial", highlight: true },
                { title: "Enterprise", price: "Custom", sub: "", features: ["Multi-warehouse", "Dedicated Manager", "Custom Integrations"], cta: "Contact Sales" },
              ].map(({ title, price, sub, features, cta, highlight }) => (
                <div key={title} className="p-8 rounded-2xl text-left"
                  style={{
                    border: highlight ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    background: highlight ? 'var(--color-primary)' : 'white'
                  }}>
                  <h3 className="text-lg font-bold mb-1" style={{ color: highlight ? 'white' : 'var(--color-text)' }}>{title}</h3>
                  <div className="text-4xl font-extrabold mb-1" style={{ color: highlight ? 'white' : 'var(--color-text)' }}>
                    {price}<span className="text-base font-normal opacity-70">{sub}</span>
                  </div>
                  <ul className="space-y-2 my-6 text-sm">
                    {features.map(f => (
                      <li key={f} className="flex items-center gap-2"
                        style={{ color: highlight ? 'rgba(255,255,255,0.85)' : 'var(--color-muted)' }}>
                        <span style={{ color: highlight ? 'white' : 'var(--color-primary)' }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/register">
                    <button className="w-full py-2.5 rounded-xl font-semibold text-sm transition hover:opacity-90"
                      style={highlight
                        ? { background: 'white', color: 'var(--color-primary)' }
                        : { background: 'var(--color-primary)', color: 'white' }}>
                      {cta}
                    </button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>FAQ</p>
              <h2 className="text-3xl md:text-4xl font-extrabold">Common questions</h2>
            </div>
            {[
              { q: "How long does setup take?", a: "Most teams are fully set up in under 24 hours." },
              { q: "Can staff access admin features?", a: "No. Staff can only log sales and view products. Admins control everything else." },
              { q: "What happens when stock runs low?", a: "Both admins and staff see a Low Stock Alert on their dashboard immediately." },
              { q: "Is my data safe?", a: "Yes. Passwords are hashed with bcrypt and access is JWT-authenticated." },
            ].map(({ q, a }) => (
              <div key={q} className="py-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <h4 className="font-bold mb-2">{q}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default LandingPage;
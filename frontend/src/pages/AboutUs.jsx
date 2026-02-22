const AboutUs = () => {
  return (
    <div className="font-sans" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Built for people, <br />
          <span style={{ color: 'var(--color-primary)' }}>not spreadsheets.</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-muted)' }}>
          StockFlow started in 2024 with one goal — make inventory management 
          simple enough for anyone, powerful enough for everyone.
        </p>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Simplicity First", body: "Software shouldn't need a manual. We design for clarity." },
              { title: "Speed Matters", body: "Real-time updates — when stock changes, your dashboard reflects it instantly." },
              { title: "Customer Driven", body: "Every feature is based on direct feedback from real users." },
            ].map(({ title, body }) => (
              <div key={title} className="p-6 rounded-2xl" style={{ border: '1px solid var(--color-border)' }}>
                <div className="w-2 h-8 rounded mb-4" style={{ background: 'var(--color-primary)' }} />
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
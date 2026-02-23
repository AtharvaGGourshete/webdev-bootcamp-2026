const AboutUs = () => {
  return (
    <div className="font-sans bg-slate-50 text-slate-800">
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Built for people, <br />
          <span className="text-teal-700">not spreadsheets.</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-slate-500">
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
              <div key={title} className="p-6 rounded-2xl border border-slate-200">
                <div className="w-2 h-8 rounded mb-4 bg-teal-700" />
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-sm text-slate-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
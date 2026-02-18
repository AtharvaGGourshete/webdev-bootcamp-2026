import React from 'react'

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header/Title Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          We’re building the <br />
          <span className="text-blue-600">future of logistics.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          StockFlow started in 2024 with a simple mission: to make inventory 
          management accessible to everyone. We believe that small businesses 
          should have the same powerful tools as global giants.
        </p>
      </section>

      {/* Values Grid */}
      <section className="border-y border-slate-100 py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-3">Simplicity First</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Software shouldn't require a manual. We design for clarity, 
                eliminating unnecessary clicks and complex menus.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Speed matters</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our infrastructure is built for real-time updates. When your stock 
                changes, your dashboard reflects it instantly—no lag.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Customer Driven</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We aren't building for ourselves. Every feature we ship is 
                based on direct feedback from the people using StockFlow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="container mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Our journey so far</h2>
            <p className="text-slate-600 mb-6">
              What started as a tool for a local warehouse has grown into a 
              platform used by thousands of businesses worldwide. We’re just 
              getting started.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-black text-blue-600">10k+</div>
                <div className="text-sm font-bold uppercase text-slate-400">Users</div>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-600">5M+</div>
                <div className="text-sm font-bold uppercase text-slate-400">SKUs Tracked</div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full h-64 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-bold italic">
            [Team Image or Office Photo Placeholder]
          </div>
        </div>
      </section> */}

      {/* Basic Footer CTA */}
      <footer className="bg-slate-900 text-white py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Want to join the mission?</h2>
          <button className="border border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-slate-900 transition-colors">
            View Careers
          </button>
        </div>
      </footer>
    </div>
  )
}

export default AboutUs

import { Package, UserCircle } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/login"
  }

  return (
    <nav style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-border)' }} className="px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <a href="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: 'var(--color-primary)' }}>
        <Package size={28} />
        <span>StockFlow</span>
      </a>

      <div className="flex items-center gap-6">
        <a href="/about" className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>About Us</a>

        {token ? (
          <div className="relative">
            <UserCircle size={34} className="cursor-pointer" style={{ color: 'var(--color-primary)' }}
              onClick={() => setShowDropdown(!showDropdown)} />
            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg p-4 w-44 z-10"
                style={{ border: '1px solid var(--color-border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>Logged in as</p>
                <p className="font-semibold capitalize mb-3" style={{ color: 'var(--color-text)' }}>{role}</p>
                <button onClick={handleLogout}
                  className="w-full py-1.5 rounded-lg text-sm text-white font-medium"
                  style={{ background: 'var(--color-danger)' }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <a href="/register">
            <button className="px-4 py-2 rounded-lg text-sm text-white font-medium"
              style={{ background: 'var(--color-primary)' }}>
              Register
            </button>
          </a>
        )}
      </div>
    </nav>
  )
}

export default Navbar
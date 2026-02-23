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
    <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <a href="/" className="flex items-center gap-2 font-bold text-xl text-teal-700">
        <Package size={28} />
        <span>StockFlow</span>
      </a>

      <div className="flex items-center gap-6">
        <a href="/about" className="text-sm font-medium text-slate-500">About Us</a>

        {token ? (
          <div className="relative">
            <UserCircle size={34} className="cursor-pointer text-teal-700"
              onClick={() => setShowDropdown(!showDropdown)} />
            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg p-4 w-44 z-10 border border-slate-200">
                <p className="text-xs mb-1 text-slate-500">Logged in as</p>
                <p className="font-semibold capitalize mb-3 text-slate-800">{role}</p>
                <button onClick={handleLogout}
                  className="w-full py-1.5 rounded-lg text-sm text-white font-medium bg-red-500 hover:bg-red-600">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <a href="/register">
            <button className="px-4 py-2 rounded-lg text-sm text-white font-medium bg-teal-700 hover:bg-teal-800">
              Register
            </button>
          </a>
        )}
      </div>
    </nav>
  )
}

export default Navbar
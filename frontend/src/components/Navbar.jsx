import { Package } from 'lucide-react'

const Navbar = () => {
  return (
    <nav>
      <div className='p-6 flex justify-between'>
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <Package size={32} />
          <a href='/'><span>StockFlow</span></a>
        </div>
        <div>
          <ul className='flex gap-5 items-center'>
            <a href='/about'><li>About Us</li></a>
            <button className='p-2 bg-blue-500 text-white rounded-md'><a href='/register'><li>Register</li></a></button>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

import { Package } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-400 py-10 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-lg text-white">
          <Package size={22} />
          <span>StockFlow</span>
        </div>
        <p className="text-sm">© 2025 StockFlow. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
import { Package } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <Package size={24} />
          <span>StockFlow</span>
        </div>
        <p className="text-sm">© 2024 StockFlow Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

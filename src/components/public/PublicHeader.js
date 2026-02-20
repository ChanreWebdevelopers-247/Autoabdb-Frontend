import React, { useState } from 'react';
import { Database, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className=" top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center justify-center shadow-sm">
            <Database className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-slate-900 font-bold text-lg sm:text-xl">AutoAb Database</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">Home</Link>
          {/* <Link href="/biomarkers" className="text-slate-600 hover:text-slate-900 transition-colors">Biomarkers</Link> */}
          <Link href="/dashboard/disease/disease" className="text-slate-600 hover:text-slate-900 transition-colors">Browse</Link>
          <Link href="/documentation" className="text-slate-600 hover:text-slate-900 transition-colors">Documentation</Link>
          <Link href="/about-us" className="text-slate-600 hover:text-slate-900 transition-colors">About Us</Link>
          <Link href="/article" className="text-slate-600 hover:text-slate-900 transition-colors">Reads</Link>
          <Link href="/advisory-board" className="text-slate-600 hover:text-slate-900 transition-colors">Advisory Board</Link>
          <Link href="/our-partners" className="text-slate-600 hover:text-slate-900 transition-colors">Our Partners</Link>
          <Link href="/auth/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-slate-900 hover:text-slate-600 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 z-40">
          <div className="px-4 py-6 space-y-4">
            {/* <Link href="/biomarkers" className="block text-slate-600 hover:text-slate-900 transition-colors py-2">Biomarkers</Link> */}
            <Link href="/dashboard/disease/disease" className="block text-slate-600 hover:text-slate-900 transition-colors py-2">Browse</Link>
            <Link href="/documentation" className="block text-slate-600 hover:text-slate-900 transition-colors py-2">Documentation</Link>
            <Link href="/about-us" className="block text-slate-600 hover:text-slate-900 transition-colors py-2">About Us</Link>
            <Link href="/auth/login" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5 px-4 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all mt-4">
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}


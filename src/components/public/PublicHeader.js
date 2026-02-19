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
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
            <Database className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-white font-bold text-lg sm:text-xl">AutoAb Database</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          {/* <Link href="/biomarkers" className="text-gray-300 hover:text-white transition-colors">Biomarkers</Link> */}
          <Link href="/dashboard/disease/disease" className="text-gray-300 hover:text-white transition-colors">Browse</Link>
          <Link href="/documentation" className="text-gray-300 hover:text-white transition-colors">Documentation</Link>
          <Link href="/about-us" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
          <Link href="/article" className="text-gray-300 hover:text-white transition-colors">Reads</Link>
          <Link href="/advisory-board" className="text-gray-300 hover:text-white transition-colors">Advisory Board</Link>
          <Link href="/our-partners" className="text-gray-300 hover:text-white transition-colors">Our Partners</Link>
          <Link href="/auth/login" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 z-40">
          <div className="px-4 py-6 space-y-4">
            {/* <Link href="/biomarkers" className="block text-gray-300 hover:text-white transition-colors py-2">Biomarkers</Link> */}
            <Link href="/dashboard/disease/disease" className="block text-gray-300 hover:text-white transition-colors py-2">Browse</Link>
            <Link href="/documentation" className="block text-gray-300 hover:text-white transition-colors py-2">Documentation</Link>
            <Link href="/about-us" className="block text-gray-300 hover:text-white transition-colors py-2">About Us</Link>
            <Link href="/auth/login" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all mt-4">
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}


import React from 'react';
import { Database } from 'lucide-react';
import Link from 'next/link';

export default function PublicFooter({ variant = 'default' }) {
  const isPrivacyPage = variant === 'privacy';

  return (
    <footer className="relative z-10 border-t border-white/10 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">AutoAb Database</span>
            </div>
            <p className="text-gray-400 text-sm">
              The comprehensive platform for autoantibody research and clinical diagnostics.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard/disease/disease" className="text-gray-400 hover:text-white transition-colors">Search Database</Link></li>
              <li><Link href="/dashboard/disease/disease" className="text-gray-400 hover:text-white transition-colors">Browse Categories</Link></li>
              <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">API Access</Link></li>
              <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Data Export</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/documentation" 
                  className={variant === 'documentation' ? "text-white font-semibold" : "text-gray-400 hover:text-white transition-colors"}
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="/about-us" 
                  className={variant === 'about' ? "text-white font-semibold" : "text-gray-400 hover:text-white transition-colors"}
                >
                  About Us
                </Link>
              </li>
              <li><Link href="/documentation" className="text-gray-400 hover:text-white transition-colors">Tutorials</Link></li>
              <li><Link href="/documentation" className="text-gray-400 hover:text-white transition-colors">Research Papers</Link></li>
              <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">{isPrivacyPage ? 'Legal' : 'Connect'}</h4>
            <ul className="space-y-2 text-sm">
              {isPrivacyPage ? (
                <>
                  <li>
                    <Link href="/privacy-policy" className="text-white font-semibold">Privacy Policy</Link>
                  </li>
                  <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">Newsletter</Link></li>
                </>
              ) : (
                <>
                  <li><Link href="/about-us" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">Newsletter</Link></li>
                  <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Community</Link></li>
                  <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-sm">
            Copyright © {new Date().getFullYear()} - AutoAb Database. All rights reserved. Built for the scientific community.
          </p>
        </div>
      </div>
    </footer>
  );
}


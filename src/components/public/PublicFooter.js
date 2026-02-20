import React from 'react';
import { Database } from 'lucide-react';
import Link from 'next/link';

export default function PublicFooter({ variant = 'default' }) {
  const isPrivacyPage = variant === 'privacy';

  return (
    <footer className="relative z-10 border-t border-slate-200/80 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white  rounded-lg flex items-center justify-center shadow-sm">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-900 font-bold">AutoAb Database</span>
            </div>
            <p className="text-slate-500 text-sm">
              The comprehensive platform for autoantibody research and clinical diagnostics.
            </p>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard/disease/disease" className="text-slate-500 hover:text-slate-900 transition-colors">Search Database</Link></li>
              <li><Link href="/dashboard/disease/disease" className="text-slate-500 hover:text-slate-900 transition-colors">Browse Categories</Link></li>
              <li><Link href="/auth/login" className="text-slate-500 hover:text-slate-900 transition-colors">API Access</Link></li>
              <li><Link href="/auth/login" className="text-slate-500 hover:text-slate-900 transition-colors">Data Export</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/documentation" 
                  className={variant === 'documentation' ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-900 transition-colors"}
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="/about-us" 
                  className={variant === 'about' ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-900 transition-colors"}
                >
                  About Us
                </Link>
              </li>
              <li><Link href="/documentation" className="text-slate-500 hover:text-slate-900 transition-colors">Tutorials</Link></li>
              <li><Link href="/documentation" className="text-slate-500 hover:text-slate-900 transition-colors">Research Papers</Link></li>
              <li><Link href="/auth/login" className="text-slate-500 hover:text-slate-900 transition-colors">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">{isPrivacyPage ? 'Legal' : 'Connect'}</h4>
            <ul className="space-y-2 text-sm">
              {isPrivacyPage ? (
                <>
                  <li>
                    <Link href="/privacy-policy" className="text-slate-900 font-semibold">Privacy Policy</Link>
                  </li>
                  <li><Link href="/auth/login" className="text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</Link></li>
                  <li><Link href="/auth/login" className="text-slate-500 hover:text-slate-900 transition-colors">Contact Us</Link></li>
                  <li><Link href="/auth/register" className="text-slate-500 hover:text-slate-900 transition-colors">Newsletter</Link></li>
                </>
              ) : (
                <>
                  <li><Link href="/about-us" className="text-slate-500 hover:text-slate-900 transition-colors">About Us</Link></li>
                  <li><Link href="/auth/login" className="text-slate-500 hover:text-slate-900 transition-colors">Contact Us</Link></li>
                  <li><Link href="/auth/register" className="text-slate-500 hover:text-slate-900 transition-colors">Newsletter</Link></li>
                  <li><Link href="/auth/login" className="text-slate-500 hover:text-slate-900 transition-colors">Community</Link></li>
                  <li><Link href="/privacy-policy" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200/80 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-slate-500 text-sm">
            Copyright © {new Date().getFullYear()} - AutoAb Database. All rights reserved. Built for the scientific community.
          </p>
        </div>
      </div>
    </footer>
  );
}


'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              SekolahKu
            </Link>
          </div>
          <nav className="flex space-x-8 items-center">
            <Link href="/konversi" className="text-gray-500 hover:text-gray-700">
              Konversi
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

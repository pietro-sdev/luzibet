'use client';

import { Home2, Building3 , LogoutCurve, Code1, UserAdd, TableDocument } from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `text-gray-500 rounded-lg p-2 ${
      pathname === path ? 'bg-green-600 text-gray-200' : 'hover:bg-green-700 hover:text-white'
    }`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col justify-between w-20 min-h-screen bg-bgLuizbet shadow-md border-r border-[] border-borderLuizbet border-[1.3px] overflow-y-auto">
      <div className="flex flex-col items-center py-12">
        <div className="flex flex-col items-center space-y-8">
          <Link href="/painel" className={linkClasses('/painel')}>
            <Home2 size="23" className='text-gray-200' />
          </Link>

          <Link href="/banco" className={linkClasses('/banco')}>
            <Building3 size="23" className='text-gray-200' />
          </Link>

          <Link href="/qrcodeinformacao" className={linkClasses('/qrcodeinformacao')}>
            <Code1 size="23" className='text-gray-200' />
          </Link>

          <Link href="/adicionar" className={linkClasses('/adicionar')}>
            <UserAdd size="23" className='text-gray-200' />
          </Link>

          <Link href="/tabela" className={linkClasses('/tabela')}>
            <TableDocument size="23" className='text-gray-200' />
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center pb-12">
        <button onClick={handleLogout} className="text-gray-500 hover:bg-verdeAgua hover:text-verde rounded-lg p-2">
          <LogoutCurve size="23" className='text-gray-200' />
        </button>
      </div>
    </div>
  );
}

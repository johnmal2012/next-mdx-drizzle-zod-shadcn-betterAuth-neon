'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function NavLink({
  href,
  children,
}: NavLinkProps) {
  const pathname = usePathname();

  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors duration-200',
        active
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-transparent text-gray-900 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600'
      )}
    >
      {children}
    </Link>
  );
}
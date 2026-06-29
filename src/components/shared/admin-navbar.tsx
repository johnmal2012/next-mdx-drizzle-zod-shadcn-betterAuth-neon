import Link from 'next/link';
// import { auth } from '@/lib/auth';
// import { headers } from 'next/headers';
import { AuthButtons } from '@/components/auth/auth-buttons';
import { getSession, isAdmin } from '@/lib/auth-utils';
import { Stethoscope } from 'lucide-react';
import { MobileSidebar } from '@/components/shared/mobile-sidebar';
import { adminNavItems } from '@/lib/constants/admin-navitems';
import { NavLink } from '@/components/shared/nav-link';

type NavbarProps = {
  session: Awaited<ReturnType<typeof getSession>>;
};

export async function AdminNavbar({ session }: NavbarProps) {
  const isAdmin = session?.user.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 border-b bg-stone-100/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        {/* Left */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <Stethoscope className="h-8 w-8 text-blue-700" />
          </div>

          <span className="text-lg font-semibold border-transparent text-gray-900 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600">Physician Portal</span>
        </Link>

        {/* Desktop Navigation */}
        {isAdmin && (
          <div className="hidden flex-1 items-center justify-center gap-4 md:flex">
            {/* {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-primary"
              >
                {item.title}
              </Link>
            ))} */}
            {adminNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
              >
                {item.title}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right */}
        <div className="ml-auto flex items-center gap-2">
          <AuthButtons user={session?.user} />

          {/* Mobile only */}
          {isAdmin && (
            <div className="md:hidden">
              <MobileSidebar />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// <nav className="sticky top-0 z-50 border-b bg-background">
//   <div className="container mx-auto px-6 sm:px-10 md:px-14 lg:px-18 xl:px-22 2xl:px-26 flex h-14 items-center justify-between">
//     {/* Left */}
//     <div className="flex items-center gap-6 text-gray-700">
//       <Link href="/" className="flex items-center gap-3">
//         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100">
//           <Stethoscope className="h-5 w-5 text-blue-700" />
//         </div>

//         <span className="text-lg font-semibold">Physician Portal</span>
//       </Link>
//     </div>

//     {/* Middle */}
//     <div className="flex items-center gap-6">
//       {isAdmin && (
//         <>
//           <Link href="/dashboard">Dashboard</Link>

//           <Link href="/profile">Profiles</Link>

//           <Link href="/sections">Sections</Link>
//         </>
//       )}
//     </div>

//     {/* Right */}
//     <div className="flex gap-2">
//       <AuthButtons user={session?.user} />
//     </div>
//   </div>
// </nav>
//   );
// }

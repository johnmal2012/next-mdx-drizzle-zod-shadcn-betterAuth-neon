// import type { Metadata } from 'next';
// import { db } from '@/db/db';
// import { physicianProfile } from '@/db/schema';
import { Toaster } from 'sonner';
// import { AuthNavbar } from '@/components/shared/auth-navbar';

// export async function generateMetadata(): Promise<Metadata> {
//   const physician = await db.query.physicianProfile.findFirst();

//   if (!physician) {
//     return {
//       title: 'Dr Nikki Lam',
//       description: 'Dr Nikki Lam Site',
//     };
//   }

//   return {
//     title: `${physician.logo} - ${physician.specialty}`,
//     description: physician.clinicName ?? '',
//   };
// }

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <AuthNavbar /> */}
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}

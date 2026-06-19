// import { LogoutButton } from '@/components/auth/logout-button';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';

// export default function HomePage() {
//   return (
//     <div className="p-10 space-y-4">
//       <h1 className="text-3xl font-bold">Better-auth app</h1>

//       <div className="flex gap-4">
//         <Button asChild>
//           <Link href="/login">Login</Link>
//         </Button>
//         <Button asChild>
//           <Link href="/signup">Signup</Link>
//         </Button>
//         <LogoutButton />
//       </div>
//     </div>
//   );
// }
import { GetStartedButton } from "@/components/navigation/get-started-button";
import { auth } from "@/lib/auth";

// type AuthApi = typeof auth.api;
// type AuthApiKeys = keyof AuthApi;
// console.log(Object.keys(auth.api));

export default function HomePage() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <div className="flex justify-center gap-8 flex-col items-center">
        <h1 className="text-6xl font-bold">Better Authy</h1>

        <GetStartedButton />
      </div>
    </div>
  );
}
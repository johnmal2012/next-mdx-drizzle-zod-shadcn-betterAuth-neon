import { ChangePasswordForm } from '@/components/auth/change-password-form';
import { ReturnButton } from '@/components/navigation/return-button';
// import { SignOutButton } from '@/components/auth/sign-out-button';
// import { Button } from '@/components/ui/button';
import { UpdateUserForm } from '@/components/user/update-user-form';
import { Separator } from '@/components/ui/separator';
// import { auth } from '@/lib/auth';
// import { AppRole, roles } from '@/lib/permissions';
// import { redirect } from 'next/navigation';
// import { headers } from 'next/headers';
// import Link from 'next/link';
import { getSession } from '@/lib/auth-utils';
// import { UserAvatar } from '@/components/user/user-avatar';
// import { ProfileImageUpload } from '@/components/profile/profile-image-upload';
import { db } from '@/db/db';

// import { toLowerCase } from 'zod';
// import { redirect } from 'next/navigation';
// import { admin } from 'better-auth/plugins';

export default async function AccountSettingsPage() {
  //   const headersList = await headers();

  // we need to pass our headers into session for any server related better-auth functionalities, otherwise you will not get desired result
  //   const session = await auth.api.getSession({
  //     headers: headersList,
  //   });

  // console.log('profile headersList: ', Array.from(headersList.entries()));
  //   console.log('cookie:', headersList.get('cookie'));
  //   console.log('profile session: ', session);
  //   if (!session) redirect('/auth/login');
  //   or
  //   if (!session) return <p className="text-destructive">Unauthorized</p>;
  //   or
  //   const session = await requirePermission({
  //     profile: ['list'], // or section: ['update', 'delete']
  //   });

  // or
  // direct expression style:
  // need to import eq operator
  // Instead of giving Drizzle a function, give it the condition directly
  // callback style:
  // where: whereCallback function
  // No need to import eq
  // Useful when building more complex relational queries
  // give users table and the operators like eq, and will tell you the condition
  // safer if session is null
  const session = await getSession();

  const currentUser = session
    ? await db.query.user.findFirst({
        where: (users, { eq }) => eq(users.id, session.user.id),
      })
    : null;

  //   console.log('currentUser from DB:', currentUser?.id, currentUser?.name);
  // console.log('UserSesionPage::session: ', session);
  // console.log('UserSesionPage::currentUser: ', currentUser);
  // //   console.log('profile session: ', session);
  //   if (!session) redirect('/login');
  //   const admin = await isAdmin();
  //   if (!admin) {
  //     notFound();
  //   }
  // use
  // rHasPermission() return object with error and success properties
  //   const ADMIN_ACCESS = await auth.api.userHasPermission({
  //     body: {
  //       userId: session?.user.id,
  //       permissions: {
  //         // posts: ['update', 'delete'],
  //         user: ['list'],
  //       },
  //     },
  //   });

  //   console.log('ADMIN_ACCESS: ', ADMIN_ACCESS);

  //   const role = session?.user.role as AppRole;

  //   // Look up the role in your local roles object
  //   const canUpdate = roles[role].authorize({
  //     user: ['get'],
  //   });

  //   console.log('roles: ', roles);
  //   console.log('user role: ', role);
  //   console.log('roles[role]: ', roles[role]);
  //   console.log('canUpdate: ', canUpdate);
  // or
  // const ADMIN_ACCESS =
  //   session.user.role === 'admin';

  //   console.log('FULL_POST_ACCESS: ', FULL_POST_ACCESS)
  return (
    <div className="px-8 py-16 container mx-auto max-w-3xl space-y-4">
      <ReturnButton href="/" label="Physician Portal" />
      <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-blue-600">
        <h2 className="text-2xl font-bold">Update User Name and/or Image</h2>

        <UpdateUserForm
          name={session?.user.name ?? ''}
          image={session?.user.image ?? ''}
        />
      </div>

      <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-red-600">
        <h2 className="text-2xl font-bold">Change Password</h2>

        <ChangePasswordForm />
      </div>
      <Separator className="my-8 data-[orientation=horizontal]:h-1 bg-slate-300" />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Profile</h1>

        {/* <div className="flex items-center gap-2"> */}
          {/* {session && ( */}
          {/* <Button size="sm" asChild>
            <Link href="/dashboard">Admin Dashboard</Link>
          </Button> */}
          {/* )} */}

          {/* <SignOutButton /> */}
        {/* </div> */}
      </div>

      {/* <h2 className="text-2xl font-bold">Permissions</h2>

      <div className="space-x-4">
        <Button size="sm">MANAGE OWN POSTS</Button>
        <Button size="sm" disabled={(await isAdmin()) ? false : true}>
          MANAGE ALL POSTS
        </Button>
      </div> */}

      {currentUser?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUser?.image}
          alt="User Image"
          className="size-32 border border-primary rounded-md object-cover"
        />
      ) : (
        <div className="size-32 border border-primary rounded-md bg-primary text-primary-foreground flex items-center justify-center">
          <span className="uppercase text-lg font-bold">
            {session?.user.name.slice(0, 2)}
          </span>
        </div>
      )}

      <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}

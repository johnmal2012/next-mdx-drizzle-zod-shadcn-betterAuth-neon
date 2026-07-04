// 1) admin dashboard page
// import { headers } from 'next/headers';
// import { redirect } from 'next/navigation';
// import { auth } from '@/lib/auth';
// import { LogoutButton } from '@/components/auth/logout-button';
import { ReturnButton } from '@/components/navigation/return-button';
import { DeleteSectionButton } from '@/components/sections/delete-section-button';
import { DeleteProfileButton } from '@/components/profile/delete-profile-button';
import { UserRoleSelect } from '@/components/user/user-role-select';
import { USER_ROLE, UserRole } from '@/db/schema/auth-schema';
import { requireAdmin } from '@/lib/auth-utils';
import { db } from '@/db/db';
import { RestoreUserButton } from '@/components/user/restore-user-button';
import { Separator } from '@/components/ui/separator';
import {
  DeleteUserButton,
  PlaceholderDeleteUserButton,
} from '@/components/user/delete-user-button';
import { RestoreSectionButton } from '@/components/sections/restore-section-button';
import { RestoreProfileButton } from '@/components/profile/restore-profile-button';

// type AuthApiKeys = keyof typeof auth.api;

export default async function DashboardPage() {
  //   const headersList = await headers();
  // need to pass headers when using server components because auth.api needs the session cookie to determine if the user is logged in or not, and cookies are sent in headers
  //   const session = await auth.api.getSession({
  //     headers: await headers(),
  //   });
  const session = await requireAdmin();

  //   console.log('session: ', session);
  //   return (
  //     <div className="p-10 space-y-4">
  //       <ReturnButton href="/profile" label="Profile" />
  //       <h1 className="text-3xl font-bold">Admin Dashboard</h1>

  //       <p>Welcome {session.user.name}</p>

  //       <LogoutButton />
  //     </div>
  //   );

  //   console.log('user role in dashboard: ', session.user.role);
  if (session.user.role !== USER_ROLE.ADMIN) {
    return (
      <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
        <div className="space-y-4">
          <ReturnButton href="/profile" label="Profile" />

          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <p className="p-2 rounded-md text-lg bg-red-600 text-white font-bold">
            FORBIDDEN
          </p>
        </div>
      </div>
    );
  }

  //   const { users } = await auth.api.listUsers({
  //     headers: headersList,
  //     query: {
  //       sortBy: 'name',
  //     },
  //   });
  //   const { users } = await auth.api.listUsers({
  //     headers: headersList,
  //     query: {
  //       sortBy: 'name',

  //       filterField: 'isActive',
  //       filterValue: true,
  //       filterOperator: 'eq',
  //     },
  //   });
  // user is an alias for the table Drizzle passes it to your callback automatically
  const activeUsers = await db.query.user.findMany({
    where: (user, { and, eq, isNull }) =>
      and(eq(user.isActive, true), isNull(user.deletedAt)),
    //   orderBy: (user, { asc }) => [asc(user.name)],
  });

  const deletedUsers = await db.query.user.findMany({
    where: (user, { and, eq, isNotNull }) =>
      and(eq(user.isActive, false), isNotNull(user.deletedAt)),
  });

  //   const activeUsers = users.filter((user) => user.deletedAt === null);
  // 1st condition:Put a before b if so admins move toward the beginning of the array
  // 2nd condition:Put b before a if b is admin and a is not, which also means admins move toward the beginning of the array
  const sortedUsers = activeUsers.sort((a, b) => {
    if (a.role === USER_ROLE.ADMIN && b.role !== USER_ROLE.ADMIN) return -1;
    if (a.role !== USER_ROLE.ADMIN && b.role === USER_ROLE.ADMIN) return 1;
    return 0;
  });

  const activeSections = await db.query.physicianSections.findMany({
    where: (section, { and, eq, isNull }) =>
      and(eq(section.isActive, true), isNull(section.deletedAt)),
    //   orderBy: (user, { asc }) => [asc(user.name)],
  });

  const deletedSections = await db.query.physicianSections.findMany({
    where: (physicianSections, { and, eq, isNotNull }) =>
      and(
        eq(physicianSections.isActive, false),
        isNotNull(physicianSections.deletedAt),
      ),
  });

  const activeProfile = await db.query.physicianProfile.findMany({
    where: (profile, { and, eq, isNull }) =>
      and(eq(profile.isActive, true), isNull(profile.deletedAt)),
    //   orderBy: (user, { asc }) => [asc(user.name)],
  });

  const deletedProfile = await db.query.physicianProfile.findMany({
    where: (physicianProfile, { and, eq, isNotNull }) =>
      and(
        eq(physicianProfile.isActive, false),
        isNotNull(physicianProfile.deletedAt),
      ),
  });

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/" label="Physician Portal" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {/*** User list ***/}
        <p className="p-2 rounded-md text-lg bg-green-400 text-white font-bold">
          Users
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="table-auto min-w-full whitespace-nowrap">
          <thead>
            <tr className="border-b text-sm text-left">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2 text-center">Role</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} className="border-b text-sm text-left">
                <td className="px-4 py-2">{user.id.slice(0, 8)}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 text-center">
                  <UserRoleSelect
                    userId={user.id}
                    role={user.role as UserRole}
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  {user.role === 'user' ? (
                    <DeleteUserButton userId={user.id} />
                  ) : (
                    <PlaceholderDeleteUserButton />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-4">
        <h2 className="p-2 rounded-md text-lg bg-red-400 text-white font-bold">
          Deleted Users
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="table-auto min-w-full whitespace-nowrap">
            <thead>
              <tr className="border-b text-sm text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {deletedUsers.map((user) => (
                <tr key={user.id} className="border-b text-sm text-left">
                  <td className="px-4 py-2">{user.id.slice(0, 8)}</td>

                  <td className="px-4 py-2">{user.name}</td>

                  <td className="px-4 py-2">{user.email}</td>

                  <td className="px-4 py-2">{user.role}</td>

                  <td className="px-4 py-2 text-center">
                    <RestoreUserButton userId={user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Separator className="data-[orientation=horizontal]:h-1 bg-slate-300" />
      {/*** Section list ***/}
      <div className="space-y-4">
        <h2 className="p-2 rounded-md text-lg bg-purple-400 text-white font-bold">
          Sections
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="table-auto min-w-full whitespace-nowrap">
            <thead>
              <tr className="border-b text-sm text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Display Order</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {activeSections.map((section) => (
                <tr key={section.id} className="border-b text-sm text-left">
                  <td className="px-4 py-2">{section.id}</td>

                  <td className="px-4 py-2">{section.title}</td>

                  <td className="px-4 py-2">{section.slug}</td>

                  <td className="px-4 py-2">{section.displayOrder}</td>

                  <td className="px-4 py-2 text-center">
                    <DeleteSectionButton sectionId={section.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="p-2 rounded-md text-lg bg-red-400 text-white font-bold">
          Deleted Sections
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="table-auto min-w-full whitespace-nowrap">
            <thead>
              <tr className="border-b text-sm text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Slug</th>
                <th className="px-4 py-2">Display Order</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {deletedSections.map((section) => (
                <tr key={section.id} className="border-b text-sm text-left">
                  <td className="px-4 py-2">{section.id}</td>

                  <td className="px-4 py-2">{section.title}</td>

                  <td className="px-4 py-2">{section.slug}</td>

                  <td className="px-4 py-2">{section.displayOrder}</td>

                  <td className="px-4 py-2 text-center">
                    <RestoreSectionButton sectionId={section.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Separator className="data-[orientation=horizontal]:h-1 bg-slate-300" />
      {/*** Profile list ***/}
      <div className="space-y-4">
        <h2 className="p-2 rounded-md text-lg bg-blue-400 text-white font-bold">
          Profiles
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="table-auto min-w-full whitespace-nowrap">
            <thead>
              <tr className="border-b text-sm text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Clinic Name</th>
                <th className="px-4 py-2">Clinic Address</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {activeProfile.map((profile) => (
                <tr key={profile.id} className="border-b text-sm text-left">
                  <td className="px-4 py-2">{profile.id}</td>

                  <td className="px-4 py-2">{profile.name}</td>

                  <td className="px-4 py-2">{profile.clinicName}</td>

                  <td className="px-4 py-2">{profile.clinicAddress}</td>

                  <td className="px-4 py-2 text-center">
                    <DeleteProfileButton profileId={profile.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="p-2 rounded-md text-lg bg-red-400 text-white font-bold">
          Deleted Profiles
        </h2>

        <div className="w-full overflow-x-auto">
          <table className="table-auto min-w-full whitespace-nowrap">
            <thead>
              <tr className="border-b text-sm text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Clinic Name</th>
                <th className="px-4 py-2">Clinic Address</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {deletedProfile.map((profile) => (
                <tr key={profile.id} className="border-b text-sm text-left">
                  <td className="px-4 py-2">{profile.id}</td>

                  <td className="px-4 py-2">{profile.name}</td>

                  <td className="px-4 py-2">{profile.clinicName}</td>

                  <td className="px-4 py-2">{profile.clinicAddress}</td>

                  <td className="px-4 py-2 text-center">
                    <RestoreProfileButton profileId={profile.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

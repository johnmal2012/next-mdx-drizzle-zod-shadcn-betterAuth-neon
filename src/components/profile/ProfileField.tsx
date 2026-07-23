import { PhysicianProfile } from "@/lib/types/physician-profile";
import { User } from "@/lib/types/user";
import { UserAvatar } from "@/components/user/user-avatar";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ProfileItem = {
    id: string,
    label: string,
    value: string,
    type: string,
}

type ProfileFieldProps = {
  item: ProfileItem;
  profile: PhysicianProfile;
  currentUser: User | null;
};

export function ProfileField({
  item,
  profile,
  currentUser,
}: ProfileFieldProps) {
  switch (item.type) {
    case 'info':
      return (
        <>
          <p className="text-sm text-muted-foreground">{item.label}</p>

          <p className="mt-1 wrap-break-word font-medium">
            {item.value || '—'}
          </p>
        </>
      );

    case 'image':
      return (
        <>
          <p className="text-sm text-muted-foreground">Image</p>

          <UserAvatar
            image={currentUser?.image}
            name={getInitials(currentUser?.name ?? '')}
            className="mt-2 h-12 w-12"
          />
        </>
      );

    case 'expertise':
      return (
        <>
          <p className="text-sm text-muted-foreground">Expertise</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {profile.expertise?.length ? (
              profile.expertise.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        </>
      );
  }
}
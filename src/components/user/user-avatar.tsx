import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

type UserAvatarProps = {
  image?: string | null;
  name?: string | null;
  className?: string;
};

export function UserAvatar({
  image,
  name,
  className
}: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage
        src={image ?? ""}
      />

      <AvatarFallback>
        {/* {name?.charAt(0)} */}
        {name}
      </AvatarFallback>
    </Avatar>
  );
}
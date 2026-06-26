import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

type Props = {
  image?: string | null;
  name?: string | null;
  className?: string;
};

export function UserAvatar({
  image,
  name,
  className
}: Props) {
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
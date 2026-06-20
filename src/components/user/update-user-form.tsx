'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ProfileImageUpload } from '@/components/profile/profile-image-upload';
import { UserAvatar } from './user-avatar';

interface UpdateUserFormProps {
  name: string;
  image: string;
}

export const UpdateUserForm = ({ name, image }: UpdateUserFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const [nameValue, setNameValue] = useState(name);
  //   const [imageValue, setImageValue] = useState(image);

  async function handleSubmit(evt: React.SubmitEvent<HTMLFormElement>) {
    evt.preventDefault();
    // const formData = new FormData(evt.target as HTMLFormElement);
    // const name = String(formData.get('name'));
    // const image = String(formData.get('image'));

    if (!nameValue.trim()) {
      return toast.error('Please enter a name');
    }

    console.log('Submitting::nameValue: ', nameValue);

    const result = await updateUser({
      // Spreading a falsy primitive contributes no enumerable properties, so the result is effectively nothing
      //   ...(name && { name }),
      //   image,
      name: nameValue,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success('User updated successfully');
          //   (evt.target as HTMLFormElement).reset();
          //   setNameValue('');
          //   setImageValue('');
          router.refresh();
        },
      },
    });
    console.log('result', JSON.stringify(result, null, 2));
  }

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          //   defaultValue={name}
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="image">Image</Label>
        {/* <Input
          id="image"
          name="image"
        //   defaultValue={image}
          value={imageValue}
          onChange={(e) => setImageValue(e.target.value)}
        /> */}
        <UserAvatar image={image} name={name} className="w-12 h-12" />
        <ProfileImageUpload />
      </div>

      <Button type="submit" disabled={isPending}>
        Update User
      </Button>
    </form>
  );
};

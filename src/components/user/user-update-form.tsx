'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ProfileImageUpload } from '@/components/profile/profile-image-upload';
import { UserAvatar } from '@/components/user/user-avatar';
import { useForm } from 'react-hook-form';
import {
  UpdateUserFormInput,
  UpdateUserInput,
  updateUserSchema,
} from '@/lib/validations/user';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
// import { getRandomValues } from 'crypto';

interface UpdateUserFormProps {
  image?: string | null;
  name?: string | null;
  className?: string;
}

export const UpdateUserForm = ({ name, image }: UpdateUserFormProps) => {
  //   const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  //   const [nameValue, setNameValue] = useState(name);
  //   const [imageValue, setImageValue] = useState(image);
  const form = useForm<UpdateUserFormInput, unknown, UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: name ?? '',
    },
  });

  async function onFormSubmit(values: UpdateUserFormInput) {
    // evt.preventDefault();
    // const formData = new FormData(evt.target as HTMLFormElement);
    // const name = String(formData.get('name'));
    // const image = String(formData.get('image'));

    // console.log('nameValue: ', nameValue);
    // if (!nameValue.trim()) {
    //   return toast.error('Please enter a name');
    // }

    // console.log('Submitting::nameValue: ', nameValue);

    const result = await updateUser({
      // Spreading a falsy primitive contributes no enumerable properties, so the result is effectively nothing
      //   ...(name && { name }),
      //   image,
      name: values.name,
      fetchOptions: {
        onRequest: () => {},
        onResponse: () => {},
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success('User updated successfully');
          //   (evt.target as HTMLFormElement).reset();
          //   setNameValue('');
          //   setImageValue('');
          form.reset(values);
          router.refresh();
        },
      },
    });
    // console.log('result', JSON.stringify(result, null, 2));
  }

  return (
    <form
      className="max-w-sm w-full space-y-4"
      noValidate
      onSubmit={form.handleSubmit(onFormSubmit)}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>

          <Input
            id="name"
            disabled={form.formState.isSubmitting}
            aria-invalid={!!form.formState.errors.name}
            {...form.register('name')}
          />

          <FieldError>{form.formState.errors.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Image</FieldLabel>

          <UserAvatar
            image={image}
            name={form.watch('name')}
            // className="h-12 w-12"
            size="lg"
          />

          <ProfileImageUpload />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting
          ? 'Updating...'
          : 'Update User'}
      </Button>
    </form>
  );
};

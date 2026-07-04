import { ReturnButton } from '@/components/navigation/return-button';
import { SendVerificationEmailForm } from '@/components/auth/send-verification-email-form';
import { redirect } from 'next/navigation';

interface VerifyProps {
  searchParams: Promise<{ error: string }>;
}

export default async function VerifyPage({ searchParams }: VerifyProps) {
  const error = (await searchParams).error;

//   console.log('verify page error: ', error);
  // successful email verify without error:
  if (!error) redirect('/profile');

  const errorCode = error.toLowerCase();

  let errorMessage: string;

  switch (errorCode) {
    case 'invalid_token':
    case 'token_expired':
      errorMessage =
        'Your token is invalid or expired. Please request a new one.';
      break;

    case 'email_not_verified':
      errorMessage =
        'Please verify your email, or request a new verification below.';
      break;

    default:
      errorMessage = 'Oops! Something went wrong. Please try again.';
  }
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <ReturnButton href="/login" label="Login" />

        <h1 className="text-3xl font-bold">Verify Email</h1>
      </div>

      {/* <p className="text-destructive">
        <span className="capitalize">
          {error.replace(/_/g, " ").replace(/-/g, " ")}
        </span>{" "}
        - Please request a new verification email.
      </p> */}
      {/* <p className="text-destructive">
        {error.toLowerCase() === 'invalid_token' || error.toLowerCase() === 'token_expired'
        ? 'Your token is invalid or expired please request a new one.'
        : error === 'email_not_verified'
            ? 'Please verify your email, or request a new verification below'
            : 'Opps! Something went wrong. Please try again.'}
      </p> */}
      <p className="text-destructive">{errorMessage}</p>
      <SendVerificationEmailForm />
    </div>
  );
}

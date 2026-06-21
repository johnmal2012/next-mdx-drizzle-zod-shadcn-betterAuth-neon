import { LoginForm } from '@/components/auth/_login-form';

import { SocialLogin } from '@/components/auth/_social-login';

export default function Page() {
  return (
    <div className="container py-10 space-y-6">
      <LoginForm />

      <SocialLogin />
    </div>
  );
}

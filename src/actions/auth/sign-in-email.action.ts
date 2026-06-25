'use server';

import { auth, ErrorCode } from '@/lib/auth';
// import { cookies, headers } from 'next/headers';
import { APIError } from 'better-auth/api';
// import { redirect } from 'next/navigation';
import { loginSchema } from '@/lib/validations/auth';
import z from 'zod';
import { redirect } from 'next/navigation';
// import { parseSetCookieHeader } from 'better-auth/cookies';

export type ActionState = {
  success: boolean;
  error: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
  fields?: {
    email?: string;
  };
};

// export async function signInEmailAction(formData: FormData) {
//   const email = String(formData.get("email"));
//   if (!email) return { error: "Please enter your email" };

//   const password = String(formData.get("password"));
//   if (!password) return { error: "Please enter your password" };
export async function signInEmailAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  //   const name = String(formData.get("name"));
  //   if (!name) return { error: "Please enter your name" };

  //   const email = String(formData.get("email"));
  //   if (!email) return { error: "Please enter your email" };

  //   const password = String(formData.get("password"));
  //   if (!password) return { error: "Please enter your password" };
  const values = {
    email: String(formData.get('email')),
    password: String(formData.get('password')),
  };

  //   const email = formData.get('email')?.toString() ?? '';
  //   const password = formData.get('password')?.toString() ?? '';

  const validated = loginSchema.safeParse(values);

  //   console.log('sign-in-email.action validated: ', validated);
  if (!validated.success) {
    return {
      success: false,
      error: '',
      fieldErrors: z.flattenError(validated.error).fieldErrors,
      //   fields: {
      //     email: values.email,
      //   },
      fields: {},
    };
  }

  // must have headers with cookie
  try {
    // await auth.api.signInEmail({
    //   headers: await headers(),
    //   //   body: {
    //   //     email,
    //   //     password,
    //   //   },
    //   body: validated.data,
    // });
    const { email, password } = validated.data;
    // manual cookie setting up
    // const res = await auth.api.signInEmail({
    //   body: {
    //     email,
    //     password,
    //   },
    //   asResponse: true,
    // });

    // // res = Response{status:xxx, headers:Headers{'set-cookie': 'better-auth.session_token=xxx, Max-Age=xxx,...}...}
    // console.log('res: ', res);
    // // ===
    // // retrieves a header value for key = set-cookie
    // const setCookieHeader = res.headers.get('set-cookie');
    // if (setCookieHeader) {
    //   const cookie = parseSetCookieHeader(setCookieHeader);
    //   const cookieStore = await cookies();

    //   // cookieStore = ResponseCookies {..., _headers: Headers {'set-cookie': xxx}}
    //   console.log('cookieStore: ', cookieStore);
    //   const [key, cookieAttributes] = [...cookie.entries()][0];
    //   // cookie.entries() = [['better-auth.session_token, {value: xxx, path: '/'...}]]
    //   console.log('cookie.entries()', [...cookie.entries()]);
    //   console.log('cookieAtttributes: ', cookieAttributes)
    //   const value = cookieAttributes.value;
    //   // use square brackets because max-age has a dash
    //   const maxAge = cookieAttributes['max-age'];
    //   const path = cookieAttributes.path;
    //   const httpOnly = cookieAttributes.httponly;
    //   const sameSite = cookieAttributes.samesite;

    //   // need decodeURIComponent otherwise cookie will not work
    //   cookieStore.set(key, decodeURIComponent(value), {
    //     maxAge,
    //     path,
    //     httpOnly,
    //     sameSite,
    //   });
    // }
    // // ===

    // using nextCookies()
    // server side: auth.api.sendVerificationEmail()
    // client side: sendVerificationEmail()
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      error: '',
    };
  } catch (err) {
    console.log('err: ', err);
    if (err instanceof APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : 'UNKNOWN';
      //   console.dir(err, { depth: 5 });

      console.log('sign-in-email errCode: ', errCode);
      switch (errCode) {
        case 'EMAIL_NOT_VERIFIED':
          redirect('/verify?error=email_not_verified');
        default:
          return {
            success: false,
            error: err.message,
          };
      }
      //   return {
      //     success: false,
      //     error: err.message,
      //   };
    }

    return {
      success: false,
      error: 'Internal Server Error',
    };
  }
}

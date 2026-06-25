// using nodemailer
// "use server";

// import { serverEnv } from "@/lib/env/server";
// import transporter from "@/lib/nodemailer";

// const styles = {
//   container:
//     "max-width:500px;margin:20px auto;padding:20px;border:1px solid #ddd;border-radius:6px;",
//   heading: "font-size:20px;color:#333;",
//   paragraph: "font-size:16px;",
//   link: "display:inline-block;margin-top:15px;padding:10px 15px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;",
// };

// export async function sendEmailAction({
//   to,
//   subject,
//   meta,
// }: {
//   to: string;
//   subject: string;
//   meta: {
//     description: string;
//     link: string;
//   };
// }) {
//   const mailOptions = {
//     from: serverEnv.NODEMAILER_USER,
//     to,
//     subject: `Profile - ${subject}`,
//     html: `
//     <div style="${styles.container}">
//       <h1 style="${styles.heading}">${subject}</h1>
//       <p style="${styles.paragraph}">${meta.description}</p>
//       <a href="${meta.link}" style="${styles.link}">Click Here</a>
//     </div>
//     `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return { success: true };
//   } catch (err) {
//     console.error("[SendEmail]: ", err);
//     return { success: false };
//   }
// }
'use server';

import sendEmail from '@/lib/email';
// import { serverEnv } from "@/lib/env/server";
import { SendEmailInput } from '@/lib/types/send-email';

const styles = {
  container:
    'max-width:500px;margin:20px auto;padding:20px;border:1px solid #ddd;border-radius:6px;',
  heading: 'font-size:20px;color:#333;',
  paragraph: 'font-size:16px;',
  link: 'display:inline-block;margin-top:15px;padding:10px 15px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;',
};

export async function sendEmailAction({ to, subject, meta }: SendEmailInput) {
  const mailOptions = {
    // from: serverEnv.EMAIL_FROM,
    to,
    subject: `Profile - ${subject}`,
    html: `
    <div style="${styles.container}">
      <h1 style="${styles.heading}">${meta.title}</h1>
      <p style="${styles.paragraph}">${meta.description}</p>
      <a href="${meta.link}" style="${styles.link}">${meta.buttonText}</a>
    </div>
    `,
  };

  try {
    await sendEmail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error('[SendEmail]: ', err);
    return { success: false };
  }
}

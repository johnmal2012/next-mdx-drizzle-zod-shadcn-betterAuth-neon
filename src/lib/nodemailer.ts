import nodemailer from "nodemailer";
// import { serverEnv } from "@/lib/env/server";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // user: serverEnv.NODEMAILER_USER,
    // pass: serverEnv.NODEMAILER_APP_PASSWORD,
  },
});

export default transporter;

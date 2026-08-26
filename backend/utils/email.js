import { Resend } from "resend";
import dotenv from "dotenv";


dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, text }) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    text,
  });

  if (error) {
    console.error("Email sending failed:", error);
    throw new Error(error.message);
  }

  console.log("Email sent successfully:", data);
};

// export const sendEmail = async ({ to, subject, text }) => {
//   console.log("========== EMAIL ==========");
//   console.log("To:", to);
//   console.log("Subject:", subject);
//   console.log("Message:", text);
//   console.log("===========================");
// };
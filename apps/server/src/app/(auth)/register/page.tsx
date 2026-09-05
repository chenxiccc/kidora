import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { registrationOpen } from "@/lib/site";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = {
  title: "Inscription · Kidora",
  description: "Créez votre compte Kidora gratuitement et protégez vos enfants en quelques minutes.",
};

export default async function RegisterPage() {
  if (await getSession()) redirect("/dashboard");
  // Registration closed by the operator (ALLOW_REGISTRATION=false) → send
  // visitors to the login page instead of showing a form that cannot work.
  if (!registrationOpen()) redirect("/login");
  return <AuthForm mode="register" />;
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { registrationOpen } from "@/lib/site";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = {
  title: "Connexion · Kidora",
  description: "Connectez-vous à votre tableau de bord Kidora.",
};

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");
  return <AuthForm mode="login" registrationOpen={registrationOpen()} />;
}

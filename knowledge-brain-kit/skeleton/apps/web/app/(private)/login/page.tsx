import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const sp = await searchParams;
  return <LoginForm error={sp.error} redirectTo={sp.redirectTo ?? "/admin"} />;
}

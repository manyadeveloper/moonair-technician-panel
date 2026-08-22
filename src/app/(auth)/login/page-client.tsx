"use client";

import { AppFooter } from "@/components/layout/app-footer";
import { MoonAirLogo } from "@/components/layout/moonair-logo";
import { PortalSkyBackground } from "@/components/layout/portal-sky-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { siteConfig } from "@/config/site";
import { MOCK_CREDENTIALS } from "@/lib/mock/technicians";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, ShieldCheck, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const PORTAL_FEATURES = [
  {
    icon: ClipboardList,
    title: "Service requests",
    description: "View assigned jobs, schedules, and customer details.",
  },
  {
    icon: Wrench,
    title: "Field workflow",
    description: "Record inspection, diagnosis, parts, and completion.",
  },
  {
    icon: ShieldCheck,
    title: "Service history",
    description: "Access warranty, product, and previous visit records.",
  },
] as const;

export default function LoginPageClient() {
  const { signIn, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", remember: false },
  });

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    const err = await signIn(
      values.identifier,
      values.password,
      values.remember
    );
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    router.push(redirect);
  };

  return (
    <PortalSkyBackground>
      <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Brand & operational context */}
        <aside className="flex flex-col lg:w-[42%] lg:min-w-[360px] lg:max-w-[520px]">
          <div className="px-6 py-6 lg:px-10 lg:py-8">
            <MoonAirLogo
              size="xl"
              showPanelName
              tone="light"
              logoBackground
            />
          </div>

          <div className="flex flex-1 flex-col px-6 pb-8 lg:px-10 lg:pb-10 lg:pt-2">
            <h1 className="text-[26px] font-semibold leading-8 text-foreground">
              Technician sign-in
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Internal portal for MoonAir field technicians. Manage service
              visits, update job progress, and maintain complete service
              records from one workspace.
            </p>

            <ul className="mt-8 space-y-4">
              {PORTAL_FEATURES.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-sky-200/80 bg-white/70 shadow-sm">
                    <Icon className="h-[18px] w-[18px] text-[#0284C7]" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {title}
                    </p>
                    <p className="mt-0.5 text-[13px] leading-[18px] text-muted">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <figure className="mt-8 max-w-md overflow-hidden rounded-lg border border-border/60 bg-white shadow-sm">
              <Image
                src={siteConfig.loginPanelImageSrc}
                alt="MoonAir MahaBali industrial cooler — field service product range"
                width={480}
                height={360}
                className="h-auto w-full object-contain object-center p-2"
              />
            </figure>
          </div>
        </aside>

        {/* Sign-in workspace */}
        <main className="flex flex-1 flex-col">
          <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
            <div className="w-full max-w-[420px]">
              <div className="mb-8 lg:mb-10">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Account access
                </p>
                <h2 className="mt-2 text-[30px] font-semibold leading-9 text-foreground">
                  Sign in
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Enter your technician ID or work email and password to
                  continue.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <Input
                    label="Technician ID / Email"
                    autoComplete="username"
                    placeholder="TECH-1001"
                    {...register("identifier")}
                    error={errors.identifier?.message}
                  />
                  <PasswordInput
                    label="Password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register("password")}
                    error={errors.password?.message}
                  />

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-secondary">
                      <input
                        type="checkbox"
                        {...register("remember")}
                        className="h-4 w-4 rounded border-border-input text-accent focus:ring-accent"
                      />
                      Remember me
                    </label>
                    <Link
                      href="#"
                      className="text-sm text-muted hover:text-accent"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]"
                    >
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    loading={loading}
                  >
                    Sign in
                  </Button>
                </form>
              </div>

              <div className="mt-6 rounded-lg border border-border bg-white/80 px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Demo environment
                </p>
                <p className="mt-1.5 text-sm text-secondary">
                  Technician ID{" "}
                  <span className="font-medium text-foreground">
                    {MOCK_CREDENTIALS.technicianId}
                  </span>
                </p>
                <p className="mt-1 text-sm text-secondary">
                  Password{" "}
                  <span className="font-medium text-foreground">
                    {MOCK_CREDENTIALS.password}
                  </span>
                </p>
                <p className="mt-1.5 text-[13px] text-muted">
                  Mock credentials for frontend testing only.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AppFooter variant="auth" className="border-t border-border/50 bg-white/60 backdrop-blur-sm" />
      </div>
    </PortalSkyBackground>
  );
}

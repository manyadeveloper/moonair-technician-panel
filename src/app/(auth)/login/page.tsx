import { Suspense } from "react";
import LoginPageClient from "./page-client";

export default function LoginRoute() {
  return (
    <Suspense>
      <LoginPageClient />
    </Suspense>
  );
}

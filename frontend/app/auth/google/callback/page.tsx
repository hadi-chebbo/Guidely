import { Suspense } from "react";

import GoogleCallbackClient from "./GoogleCallbackClient";

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
          <p className="text-sm font-medium text-gray-600">
            Signing you in with Google...
          </p>
        </main>
      }
    >
      <GoogleCallbackClient />
    </Suspense>
  );
}

"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "AccessDenied":
        return "Access denied. You do not have permission to access this resource.";
      case "Configuration":
        return "There is a problem with the authentication configuration. Please contact the administrator.";
      case "CredentialsSignin":
        return "The credentials you provided are invalid.";
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
        return "There was a problem with the authentication service. Please try again.";
      case "EmailSignin":
        return "The email sign-in link is invalid or has expired.";
      case "SessionRequired":
        return "You must be signed in to access this page.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 px-4">
      <Link
        href="/"
        className="group absolute left-4 top-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">
            Authentication Error
          </h1>
          
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">
            {getErrorMessage()}
          </p>
          
          {error === "Configuration" && (
            <div className="mt-4 rounded-md bg-amber-50 dark:bg-amber-900/30 p-4 text-amber-800 dark:text-amber-200">
              <p className="text-sm">
                This could be due to incomplete email provider settings or missing environment variables.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/signin"
            className="rounded-lg bg-gradient-to-r from-brandBlue-500 to-brandBlue-600 px-6 py-3 text-white shadow-lg shadow-brandBlue-500/20 transition-all hover:from-brandBlue-600 hover:to-brandBlue-700 hover:shadow-xl hover:shadow-brandBlue-500/30"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}

// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "flatpickr/dist/flatpickr.css";
import "./root.css";
import { AuthProvider } from "./context/Auth";
import LayoutSwitcher from "./layout/LayoutSwitcher";
import { SolidNProgress } from "solid-progressbar";
import { Toaster } from "solid-toast";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>MiniStore - Management System</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <SolidNProgress color="#4F46E5" />
        <Toaster position="top-center" />
        <Suspense
          fallback={
            <div class="h-screen grid place-items-center">Loading...</div>
          }
        >
          <ErrorBoundary>
            <AuthProvider>
              <LayoutSwitcher>
                <Routes>
                  <FileRoutes />
                </Routes>
              </LayoutSwitcher>
            </AuthProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}

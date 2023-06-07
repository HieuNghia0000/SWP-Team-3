// @refresh reload
import { Suspense, createSignal } from "solid-js";
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
import Navbar from "./components/Navbar";
import HeadBar from "./components/HeadBar";

export default function Root() {
  const [isNavOpen, setIsNavOpen] = createSignal(true);

  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - Bare</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <div class="flex flex-row h-screen">
              <Navbar isOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
              <div class="flex-1 overflow-x-auto flex flex-col">
                <HeadBar isOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
                <div class="relative flex-1">
                  <div class="overflow-auto py-8 px-6 h-full">
                    <Routes>
                      <FileRoutes />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}

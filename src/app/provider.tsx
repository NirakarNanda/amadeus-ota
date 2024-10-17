"use client";

import { NextUIProvider } from "@nextui-org/react";
import ReduxProvider from "@/Redux/ReduxProvider";

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <NextUIProvider>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </NextUIProvider>
  );
}

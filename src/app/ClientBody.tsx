'use client'

import { useEffect } from "react";

interface ClientBodyProps {
  children: React.ReactNode;
}

export default function ClientBody({ children }: ClientBodyProps) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    document.body.classList.remove(
      ...[...document.body.classList].filter((cls) =>
        cls.startsWith("antml-extension-")
      )
    );
  }, []);

  return <>{children}</>;
}

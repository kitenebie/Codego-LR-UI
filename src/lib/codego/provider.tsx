import * as React from "react";
import { useToast } from "@/src/components/ui/notification";
import { setToastFunction } from "./interceptors";

/** Mount once inside ToastProvider to enable api toast notifications. */
export function CodegoApiProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  React.useEffect(() => { setToastFunction(toast); }, [toast]);
  return <>{children}</>;
}

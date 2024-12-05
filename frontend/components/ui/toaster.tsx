"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="p-0 border-none">
            <div
              className={`relative bg-black w-full h-full rounded-sm w-[400px] ${
                action ? "h-[110px]" : "h-[88px]"
              }`}
            >
              <div
                className={`flex flex-col justify-center absolute bg-[#ffd75f] w-full h-full  -top-[4px] -left-[4px] rounded-sm w-[400px] ${
                  action ? "h-[110px] p-5" : "h-[88px] px-5"
                }  border-black `}
              >
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
                {action}
              </div>
              <ToastClose />
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

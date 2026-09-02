"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface AuthModalShellProps {
  onClose: () => void;
  children: React.ReactNode;
}

export function AuthModalShell({ onClose, children }: AuthModalShellProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`auth-modal fixed inset-0 z-[80] flex items-center justify-center p-4${isVisible ? " auth-modal--show" : ""}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Cerrar modal"
      />

      <div className="auth-modal-panel relative z-[81] w-full max-w-[1140px]">
        <div className="modal-body p-0">
          <div
            className={`modal-content overflow-hidden border-0 bg-transparent${isVisible ? " open" : ""}`}
          >
            <div className="flex min-h-0 flex-col lg:min-h-[520px] lg:flex-row">
              <div className="right-content relative flex w-full items-center justify-center bg-white px-[clamp(18px,4vw,24px)] py-[clamp(18px,4vw,24px)] lg:w-1/2 lg:px-[clamp(24px,3vw,44px)] lg:py-[clamp(24px,3vw,44px)]">
                <div className="w-full">{children}</div>
              </div>

              <div className="left-img relative hidden min-h-[520px] overflow-hidden lg:block lg:w-1/2">
                <Image
                  src="/images/placeholder/auth.png"
                  alt="Autenticación"
                  fill
                  className="object-cover"
                  priority
                  sizes="570px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";

interface AuthModalShellProps {
  onClose: () => void;
  children: React.ReactNode;
}

export function AuthModalShell({ onClose, children }: AuthModalShellProps) {
  return (
    <div className="auth-modal fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Cerrar modal"
      />

      <div className="relative z-[81] w-full max-w-[1140px]">
        <div className="modal-body p-0">
          <div className="modal-content open overflow-hidden border-0 bg-transparent">
            <div className="flex min-h-0 flex-col lg:min-h-[520px] lg:flex-row">
              <div className="right-content relative flex w-full items-center justify-center bg-white px-[clamp(18px,4vw,24px)] py-[clamp(18px,4vw,24px)] lg:w-1/2 lg:px-[clamp(24px,3vw,44px)] lg:py-[clamp(24px,3vw,44px)]">
                <div className="w-full">{children}</div>
              </div>

              <div className="left-img relative hidden min-h-[520px] lg:block lg:w-1/2">
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

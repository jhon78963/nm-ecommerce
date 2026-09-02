import { GoogleSignInButton, type GoogleSignInIntent } from "@/features/auth/components/GoogleSignInButton";

interface AuthSocialSectionProps {
  intent: GoogleSignInIntent;
}

export function AuthSocialSection({ intent }: AuthSocialSectionProps) {
  return (
    <>
      <div className="divider relative my-[clamp(14px,2vw,25px)] mb-[clamp(8px,1.2vw,17px)] text-center">
        <span className="relative z-[1] bg-white px-[9px] text-sm font-medium text-[#777]">o</span>
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#eee]" />
      </div>

      <GoogleSignInButton intent={intent} />
    </>
  );
}

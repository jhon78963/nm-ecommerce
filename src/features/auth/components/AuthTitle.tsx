interface AuthTitleProps {
  title: string;
  description?: string;
}

export function AuthTitle({
  title,
  description = "Vuelve a sumergirte en tu mundo con un simple inicio de sesión.",
}: AuthTitleProps) {
  return (
    <div className="auth-title mb-[26px] text-center">
      <h3 className="mb-[9px] text-[clamp(20px,1.5vw,24px)] font-semibold tracking-normal text-[#222]">
        {title}
      </h3>
      <p className="m-0 text-[clamp(13px,1vw,15px)] font-medium leading-relaxed text-[#6a6a6a]">
        {description}
      </p>
    </div>
  );
}

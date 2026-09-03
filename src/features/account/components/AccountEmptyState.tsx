import type { ReactNode } from "react";

export interface AccountEmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function AccountEmptyState({ title, description, action }: AccountEmptyStateProps) {
  return (
    <div className="account-empty-state">
      <div className="account-empty-state__icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" className="h-16 w-16 text-[#ddd]">
          <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2" />
          <path d="M8 22h48" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="38" r="6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="account-empty-state__action">{action}</div> : null}
    </div>
  );
}

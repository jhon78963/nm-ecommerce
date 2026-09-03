"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Heart,
  Home,
  LogOut,
  MapPin,
  Receipt,
  RefreshCcw,
  X,
} from "lucide-react";

import { ACCOUNT_NAV_ITEMS } from "@/features/account/constants/account-nav";
import { useAuth } from "@/features/auth/context/AuthProvider";

import "./account.css";

const ICONS = {
  home: Home,
  orders: Receipt,
  heart: Heart,
  address: MapPin,
  bell: Bell,
  refund: RefreshCcw,
} as const;

interface AccountSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function AccountSidebar({ isOpen, onClose, onLogout }: AccountSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <aside className={`account-sidebar${isOpen ? " account-sidebar--open" : ""}`}>
      <button type="button" className="account-sidebar__close" onClick={onClose}>
        <X className="size-4" />
        <span>Cerrar</span>
      </button>

      <div className="account-sidebar__profile">
        <div className="account-sidebar__avatar" aria-hidden="true">
          {initial}
        </div>
        <div>
          <h2 className="account-sidebar__name">{user?.name ?? "Cliente"}</h2>
          <p className="account-sidebar__email">{user?.email}</p>
        </div>
      </div>

      <nav className="account-sidebar__nav" aria-label="Menú de cuenta">
        <ul>
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon];
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={active ? "active" : undefined}
                  onClick={onClose}
                >
                  <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="account-sidebar__badge">({item.badge})</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
          <li className="account-sidebar__logout">
            <button type="button" onClick={onLogout}>
              <LogOut className="size-[18px] shrink-0" aria-hidden="true" />
              <span>Cerrar sesión</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

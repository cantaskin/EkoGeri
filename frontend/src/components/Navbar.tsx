"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/auth";
import { User } from "@/lib/types";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-green-700 text-lg">
          <span className="text-2xl">♻️</span> EkoGeri
        </Link>

        <div className="flex items-center gap-1 text-sm">
          {user.role === "CITIZEN" && (
            <>
              <NavLink href="/dashboard">Panel</NavLink>
              <NavLink href="/map">Harita</NavLink>
              <NavLink href="/deposit">Atık Bırak</NavLink>
              <NavLink href="/rewards">Ödüller</NavLink>
              <NavLink href="/leaderboard">Sıralama</NavLink>
            </>
          )}
          {user.role === "MUNICIPALITY_ADMIN" && (
            <>
              <NavLink href="/municipality">Belediye Paneli</NavLink>
              <NavLink href="/map">Harita</NavLink>
              <NavLink href="/leaderboard">Sıralama</NavLink>
            </>
          )}
          {user.role === "SUPER_ADMIN" && (
            <>
              <NavLink href="/admin">Yönetim</NavLink>
              <NavLink href="/municipality">Containerlar</NavLink>
              <NavLink href="/map">Harita</NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user.role === "CITIZEN" && (
            <Link href="/profile" className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              {user.points} puan
            </Link>
          )}
          <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900">
            {user.fullName}
          </Link>
          <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">
            Çıkış
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-3 py-2 rounded-lg text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors">
      {children}
    </Link>
  );
}

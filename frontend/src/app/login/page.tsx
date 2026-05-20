"use client";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { AuthResponse } from "@/lib/types";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>("/api/auth/login", { email, password });
      saveAuth(data);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">♻️</span>
          <h1 className="text-2xl font-bold mt-2">EkoGeri'ye Giriş Yap</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">E-posta</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ornek@email.com" />
          </div>
          <div>
            <label className="label">Şifre</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Hesabın yok mu?{" "}
          <Link href="/register" className="text-green-600 hover:underline">Üye Ol</Link>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p className="font-medium mb-1">Demo hesaplar:</p>
          <p>admin@recycling.com / admin123 (Süper Admin)</p>
          <p>belediye@recycling.com / belediye123 (Belediye Admin)</p>
          <p>ahmet@recycling.com / user123 (Vatandaş)</p>
        </div>
      </div>
    </div>
  );
}

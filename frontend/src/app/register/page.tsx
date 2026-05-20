"use client";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import { AuthResponse } from "@/lib/types";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>("/api/auth/register", form);
      saveAuth(data);
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">♻️</span>
          <h1 className="text-2xl font-bold mt-2">Üye Ol</h1>
          <p className="text-gray-500 text-sm mt-1">Geri dönüşümle puan kazanmaya başla</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Ad Soyad</label>
            <input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div>
            <label className="label">E-posta</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="label">Şifre (min 6 karakter)</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Üye Ol"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Zaten hesabın var mı?{" "}
          <Link href="/login" className="text-green-600 hover:underline">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
}

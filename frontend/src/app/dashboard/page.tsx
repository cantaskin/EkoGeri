"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { User, WasteDeposit, WASTE_TYPE_LABELS } from "@/lib/types";
import { getUser } from "@/lib/auth";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(getUser());
  const [history, setHistory] = useState<WasteDeposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<User>("/api/users/me"),
      api.get<WasteDeposit[]>("/api/deposits/my-history"),
    ]).then(([u, h]) => {
      setUser(u.data);
      setHistory(h.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  const treesaved = Math.floor((user?.totalWasteKg || 0) * 0.5);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Merhaba, {user?.fullName} 👋</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card border-l-4 border-green-500">
            <p className="text-sm text-gray-500 mb-1">Toplam Puanım</p>
            <p className="text-4xl font-bold text-green-600">{user?.points}</p>
            <p className="text-sm text-gray-500 mt-1">Eko-Puan</p>
          </div>
          <div className="card border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 mb-1">Toplam Atık</p>
            <p className="text-4xl font-bold text-blue-600">{user?.totalWasteKg?.toFixed(1)}</p>
            <p className="text-sm text-gray-500 mt-1">kg geri dönüştürüldü</p>
          </div>
          <div className="card border-l-4 border-emerald-500">
            <p className="text-sm text-gray-500 mb-1">Katkın</p>
            <p className="text-4xl font-bold text-emerald-600">{treesaved}</p>
            <p className="text-sm text-gray-500 mt-1">ağaç katkısı tahmini</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-semibold text-lg mb-4">Hızlı İşlemler</h2>
            <div className="space-y-3">
              <Link href="/deposit" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="text-2xl">🗑️</span>
                <div>
                  <p className="font-medium">Atık Bırak</p>
                  <p className="text-sm text-gray-500">Puan kazan</p>
                </div>
              </Link>
              <Link href="/map" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="text-2xl">🗺️</span>
                <div>
                  <p className="font-medium">Haritayı Aç</p>
                  <p className="text-sm text-gray-500">Yakın containerları bul</p>
                </div>
              </Link>
              <Link href="/rewards" className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <span className="text-2xl">🎁</span>
                <div>
                  <p className="font-medium">Ödülleri Gör</p>
                  <p className="text-sm text-gray-500">Puanlarını kullan</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-lg mb-4">Son Aktivitelerim</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">Henüz atık bırakmadınız.</p>
            ) : (
              <div className="space-y-3">
                {history.map((d) => (
                  <div key={d.id} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium">{WASTE_TYPE_LABELS[d.wasteType]}</p>
                      <p className="text-gray-500">{d.containerName} · {d.weightKg} kg</p>
                    </div>
                    <span className="badge-green">+{d.pointsEarned} puan</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

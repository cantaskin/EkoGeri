"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { User, WasteDeposit, Redemption, WASTE_TYPE_LABELS, WASTE_CO2_SAVINGS_KG, TREE_CO2_PER_YEAR } from "@/lib/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<WasteDeposit[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [fullName, setFullName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<User>("/api/users/me"),
      api.get<WasteDeposit[]>("/api/deposits/my-history"),
      api.get<Redemption[]>("/api/rewards/redemptions/my-history"),
    ]).then(([u, h, r]) => {
      setUser(u.data);
      setFullName(u.data.fullName);
      setHistory(h.data);
      setRedemptions(r.data);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await api.put<User>("/api/users/me", { fullName });
    setUser(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Profilim</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-semibold text-lg mb-4">Bilgilerimi Güncelle</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Ad Soyad</label>
                <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div>
                <label className="label">E-posta</label>
                <input className="input bg-gray-50 text-gray-500" value={user.email} disabled />
              </div>
              {saved && <p className="text-green-600 text-sm">Kaydedildi!</p>}
              <button className="btn-primary" type="submit">Kaydet</button>
            </form>
          </div>

          <div className="card">
            <h2 className="font-semibold text-lg mb-4">İstatistiklerim</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Toplam puan</span><strong className="text-green-600">{user.points}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Toplam atık</span><strong>{user.totalWasteKg?.toFixed(1)} kg</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Rol</span><strong>{user.role === "CITIZEN" ? "Vatandaş" : user.role}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Üyelik tarihi</span><strong>{new Date(user.createdAt).toLocaleDateString("tr-TR")}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Toplam işlem</span><strong>{history.length}</strong></div>
            </div>
          </div>

          {(() => {
            const totalCO2 = history.reduce((sum, d) => sum + d.weightKg * WASTE_CO2_SAVINGS_KG[d.wasteType], 0);
            const trees = totalCO2 / TREE_CO2_PER_YEAR;
            return (
              <div className="card md:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <h2 className="font-semibold text-lg mb-4 text-green-800">🌍 Çevresel Etkim</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-green-600">{totalCO2.toFixed(1)}</p>
                    <p className="text-sm text-gray-600 mt-1">kg CO₂ tasarrufu</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-600">{trees.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 mt-1">🌳 ağaca eşdeğer</p>
                    <p className="text-xs text-gray-400">(yıllık CO₂ emilimi)</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-600">{(user.totalWasteKg ?? 0).toFixed(1)}</p>
                    <p className="text-sm text-gray-600 mt-1">kg toplam atık</p>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="card md:col-span-2">
            <h2 className="font-semibold text-lg mb-4">Atık Geçmişim</h2>
            {history.length === 0 ? <p className="text-gray-500 text-sm">Henüz atık bırakmadınız.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 border-b"><th className="pb-2">Tarih</th><th className="pb-2">Tür</th><th className="pb-2">Ağırlık</th><th className="pb-2">Puan</th><th className="pb-2">Container</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {history.map((d) => (
                      <tr key={d.id} className="py-2">
                        <td className="py-2 text-gray-500">{new Date(d.depositedAt).toLocaleDateString("tr-TR")}</td>
                        <td className="py-2">{WASTE_TYPE_LABELS[d.wasteType]}</td>
                        <td className="py-2">{d.weightKg} kg</td>
                        <td className="py-2 text-green-600">+{d.pointsEarned}</td>
                        <td className="py-2 text-gray-500">{d.containerName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

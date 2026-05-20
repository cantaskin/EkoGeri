"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { getUser } from "@/lib/auth";
import { User, Reward, Container, RewardCategory, REWARD_CATEGORY_LABELS, WASTE_TYPE_LABELS } from "@/lib/types";
import QRCode from "react-qr-code";

export default function AdminPage() {
  const router = useRouter();
  const currentUser = getUser();
  const isAuthorized = !!currentUser && (currentUser.role === "SUPER_ADMIN" || currentUser.role === "MUNICIPALITY_ADMIN");

  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [tab, setTab] = useState<"stats" | "users" | "rewards" | "containers">("stats");
  const [msg, setMsg] = useState("");
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [editReward, setEditReward] = useState<Reward | null>(null);
  const [rewardForm, setRewardForm] = useState({ name: "", description: "", pointsCost: "100", category: "OTHER" as RewardCategory, stock: "-1", isActive: true });
  const [printContainer, setPrintContainer] = useState<Container | null>(null);

  async function load() {
    const [s, u, r, c] = await Promise.all([
      api.get("/api/admin/stats/overview"),
      api.get<User[]>("/api/users"),
      api.get<Reward[]>("/api/rewards"),
      api.get<Container[]>("/api/containers"),
    ]);
    setStats(s.data); setUsers(u.data); setRewards(r.data); setContainers(c.data);
  }

  useEffect(() => {
    if (!isAuthorized) {
      router.replace("/dashboard");
      return;
    }
    load();
  }, []);

  if (!isAuthorized) return null;

  async function handleRoleChange(userId: number, role: string) {
    await api.put(`/api/users/${userId}/role`, { role });
    await load(); setMsg("Rol güncellendi.");
  }

  async function handleDeleteUser(userId: number) {
    if (!confirm("Kullanıcıyı silmek istediğinize emin misiniz?")) return;
    await api.delete(`/api/users/${userId}`);
    await load(); setMsg("Kullanıcı silindi.");
  }

  async function handleSaveReward(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...rewardForm, pointsCost: parseInt(rewardForm.pointsCost), stock: parseInt(rewardForm.stock) };
    if (editReward) {
      await api.put(`/api/rewards/${editReward.id}`, payload);
    } else {
      await api.post("/api/rewards", payload);
    }
    setShowRewardForm(false); setEditReward(null);
    await load(); setMsg("Ödül kaydedildi.");
  }

  function startEditReward(r: Reward) {
    setRewardForm({ name: r.name, description: r.description || "", pointsCost: String(r.pointsCost), category: r.category, stock: String(r.stock), isActive: r.isActive });
    setEditReward(r); setShowRewardForm(true);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Süper Admin Paneli</h1>
        {msg && <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-green-700">{msg}</div>}

        <div className="flex gap-2 mb-6 flex-wrap">
          {(["stats", "users", "rewards", "containers"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {t === "stats" ? "İstatistikler" : t === "users" ? "Kullanıcılar" : t === "rewards" ? "Ödüller" : "Containerlar & QR"}
            </button>
          ))}
        </div>

        {tab === "stats" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Toplam Kullanıcı", value: stats.totalUsers },
              { label: "Toplam Container", value: stats.totalContainers },
              { label: "Toplam İşlem", value: stats.totalDeposits },
              { label: "Toplam Atık (kg)", value: Number(stats.totalWasteKg || 0).toFixed(1) },
              { label: "Haftalık Atık (kg)", value: Number(stats.weeklyWasteKg || 0).toFixed(1) },
            ].map((s) => (
              <div key={s.label} className="card">
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "users" && (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-gray-500 border-b"><th className="pb-2">Ad</th><th className="pb-2">E-posta</th><th className="pb-2">Rol</th><th className="pb-2">Puan</th><th className="pb-2">İşlem</th></tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 font-medium">{u.fullName}</td>
                      <td className="py-3 text-gray-500">{u.email}</td>
                      <td className="py-3">
                        <select className="border border-gray-200 rounded px-2 py-1 text-xs" value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)}>
                          <option value="CITIZEN">Vatandaş</option>
                          <option value="MUNICIPALITY_ADMIN">Belediye Admin</option>
                          <option value="SUPER_ADMIN">Süper Admin</option>
                        </select>
                      </td>
                      <td className="py-3 text-green-600">{u.points}</td>
                      <td className="py-3"><button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:underline text-xs">Sil</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "rewards" && (
          <>
            <div className="flex justify-end mb-4">
              <button className="btn-primary" onClick={() => { setShowRewardForm(true); setEditReward(null); setRewardForm({ name: "", description: "", pointsCost: "100", category: "OTHER", stock: "-1", isActive: true }); }}>+ Yeni Ödül</button>
            </div>
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 border-b"><th className="pb-2">İsim</th><th className="pb-2">Kategori</th><th className="pb-2">Puan</th><th className="pb-2">Stok</th><th className="pb-2">Durum</th><th className="pb-2">İşlem</th></tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {rewards.map((r) => (
                      <tr key={r.id}>
                        <td className="py-3 font-medium">{r.name}</td>
                        <td className="py-3">{REWARD_CATEGORY_LABELS[r.category]}</td>
                        <td className="py-3 text-green-600">{r.pointsCost}</td>
                        <td className="py-3">{r.stock === -1 ? "Sınırsız" : r.stock}</td>
                        <td className="py-3"><span className={r.isActive ? "badge-green" : "badge-gray"}>{r.isActive ? "Aktif" : "Pasif"}</span></td>
                        <td className="py-3"><button onClick={() => startEditReward(r)} className="text-green-600 hover:underline text-xs">Düzenle</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === "containers" && (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Container</th>
                    <th className="pb-2">Tür</th>
                    <th className="pb-2">Durum</th>
                    <th className="pb-2">Doluluk</th>
                    <th className="pb-2">QR Kod</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {containers.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3">
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.address}</p>
                      </td>
                      <td className="py-3">{WASTE_TYPE_LABELS[c.wasteType]}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === "ACTIVE" ? "bg-green-100 text-green-700" : c.status === "FULL" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                          {c.status === "ACTIVE" ? "Aktif" : c.status === "FULL" ? "Dolu" : "Bakımda"}
                        </span>
                      </td>
                      <td className="py-3">%{c.fillPercentage.toFixed(0)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <QRCode value={c.qrCode} size={48} />
                          <button onClick={() => setPrintContainer(c)} className="text-xs text-green-600 hover:underline whitespace-nowrap">Yazdır</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {printContainer && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 print:bg-white print:inset-auto print:flex print:items-start">
            <div className="bg-white rounded-xl p-8 w-full max-w-xs shadow-xl text-center print:shadow-none print:rounded-none" id="print-area">
              <p className="text-xs text-gray-400 mb-1 print:hidden">QR Kodu</p>
              <QRCode value={printContainer.qrCode} size={200} className="mx-auto" />
              <p className="font-bold text-lg mt-4">{printContainer.name}</p>
              <p className="text-sm text-gray-500 mt-1">{printContainer.address}</p>
              <p className="text-sm text-gray-500 mt-0.5">{WASTE_TYPE_LABELS[printContainer.wasteType]}</p>
              <div className="flex gap-3 mt-6 print:hidden">
                <button onClick={() => window.print()} className="btn-primary flex-1">Yazdır</button>
                <button onClick={() => setPrintContainer(null)} className="btn-secondary flex-1">Kapat</button>
              </div>
            </div>
          </div>
        )}

        {showRewardForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="font-bold text-lg mb-4">{editReward ? "Ödül Düzenle" : "Yeni Ödül"}</h3>
              <form onSubmit={handleSaveReward} className="space-y-3">
                <div><label className="label">İsim</label><input className="input" value={rewardForm.name} onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })} required /></div>
                <div><label className="label">Açıklama</label><textarea className="input" rows={2} value={rewardForm.description} onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Puan maliyeti</label><input className="input" type="number" min="1" value={rewardForm.pointsCost} onChange={(e) => setRewardForm({ ...rewardForm, pointsCost: e.target.value })} required /></div>
                  <div><label className="label">Stok (-1 = sınırsız)</label><input className="input" type="number" min="-1" value={rewardForm.stock} onChange={(e) => setRewardForm({ ...rewardForm, stock: e.target.value })} /></div>
                </div>
                <div><label className="label">Kategori</label>
                  <select className="input" value={rewardForm.category} onChange={(e) => setRewardForm({ ...rewardForm, category: e.target.value as RewardCategory })}>
                    {(Object.keys(REWARD_CATEGORY_LABELS) as RewardCategory[]).map((c) => <option key={c} value={c}>{REWARD_CATEGORY_LABELS[c]}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={rewardForm.isActive} onChange={(e) => setRewardForm({ ...rewardForm, isActive: e.target.checked })} />
                  Aktif
                </label>
                <div className="flex gap-3 pt-2">
                  <button className="btn-primary flex-1" type="submit">Kaydet</button>
                  <button className="btn-secondary flex-1" type="button" onClick={() => setShowRewardForm(false)}>İptal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

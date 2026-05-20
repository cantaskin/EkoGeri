"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Reward, User, REWARD_CATEGORY_LABELS } from "@/lib/types";
import { getUser } from "@/lib/auth";

const CATEGORY_ICONS: Record<string, string> = { DISCOUNT: "🏷️", TRANSPORT: "🚌", INTERNET: "📶", OTHER: "🎁" };

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [user, setUser] = useState<User | null>(getUser());
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get<Reward[]>("/api/rewards"), api.get<User>("/api/users/me")])
      .then(([r, u]) => { setRewards(r.data); setUser(u.data); });
  }, []);

  async function handleRedeem(reward: Reward) {
    setError(""); setSuccess("");
    try {
      await api.post(`/api/rewards/${reward.id}/redeem`);
      setSuccess(`"${reward.name}" başarıyla alındı!`);
      const u = await api.get<User>("/api/users/me");
      setUser(u.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "İşlem başarısız.");
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ödül Kataloğu</h1>
          <span className="badge-green text-base px-4 py-1">{user?.points} puanım</span>
        </div>
        {success && <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-green-700">{success}</div>}
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((r) => (
            <div key={r.id} className="card flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{CATEGORY_ICONS[r.category]}</span>
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <span className="badge-gray">{REWARD_CATEGORY_LABELS[r.category]}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 flex-1">{r.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold text-lg">{r.pointsCost} puan</span>
                <button
                  onClick={() => handleRedeem(r)}
                  disabled={!user || user.points < r.pointsCost}
                  className="btn-primary text-sm py-1.5 px-4 disabled:opacity-40"
                >
                  {!user || user.points < r.pointsCost ? "Yetersiz" : "Kullan"}
                </button>
              </div>
              {r.stock > 0 && <p className="text-xs text-gray-400 mt-2">Stok: {r.stock}</p>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

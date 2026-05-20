"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { LeaderboardEntry } from "@/lib/types";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    api.get<LeaderboardEntry[]>("/api/admin/leaderboard").then((r) => setEntries(r.data));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Haftalık Sıralama</h1>
        <p className="text-gray-500 mb-6">En çok puan kazanan kullanıcılar</p>
        <div className="card divide-y divide-gray-100">
          {entries.map((e, i) => (
            <div key={e.id} className="flex items-center gap-4 py-4">
              <span className="text-2xl w-8 text-center">{MEDALS[i] || `${i + 1}.`}</span>
              <div className="flex-1">
                <p className="font-semibold">{e.fullName}</p>
                <p className="text-sm text-gray-500">{e.totalWasteKg?.toFixed(1)} kg geri dönüştürüldü</p>
              </div>
              <span className="text-green-600 font-bold text-lg">{e.points} puan</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

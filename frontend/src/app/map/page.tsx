"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Container, WASTE_TYPE_LABELS } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function MapPage() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selected, setSelected] = useState<Container | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDesc, setReportDesc] = useState("");
  const [reportMsg, setReportMsg] = useState("");

  async function handleReport(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    try {
      await api.post("/api/reports", { containerId: selected.id, description: reportDesc });
      setReportMsg("Bildirim alındı, teşekkürler!");
      setReportDesc("");
      setTimeout(() => { setShowReportModal(false); setReportMsg(""); }, 2000);
    } catch {
      setReportMsg("Bildirim gönderilemedi, tekrar deneyin.");
    }
  }

  useEffect(() => {
    api.get<Container[]>("/api/containers")
      .then((r) => setContainers(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Geri Dönüşüm Noktaları</h1>
        <div className="flex gap-4 mb-4 text-sm flex-wrap">
          {[
            { label: "Boş (%0–30)", color: "bg-green-500" },
            { label: "Orta (%31–60)", color: "bg-yellow-400" },
            { label: "Dolu (%61–85)", color: "bg-orange-500" },
            { label: "Taşıyor (%86+)", color: "bg-red-600" },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded-full ${l.color}`} />
              {l.label}
            </span>
          ))}
        </div>
        {loading ? (
          <div className="h-96 flex items-center justify-center text-gray-500">Harita yükleniyor...</div>
        ) : (
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow relative z-0">
            <MapView containers={containers} onSelect={setSelected} />
          </div>
        )}
        {selected && (
          <div className="card mt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{selected.name}</h3>
                <p className="text-gray-500 text-sm">{selected.address}</p>
                <p className="text-sm mt-2">
                  Atık türü: <strong>{WASTE_TYPE_LABELS[selected.wasteType]}</strong>
                  {" · "}Doluluk: <strong>{selected.fillPercentage.toFixed(1)}%</strong>
                  {" · "}Kapasite: <strong>{selected.capacityKg} kg</strong>
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => { setShowReportModal(true); setReportMsg(""); }}
                className="text-sm text-orange-600 hover:text-orange-700 border border-orange-200 rounded-lg px-3 py-1.5 hover:bg-orange-50 transition-colors"
              >
                ⚠️ Arıza Bildir
              </button>
            </div>
          </div>
        )}

        {showReportModal && selected && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="font-bold text-lg mb-1">Arıza Bildir</h3>
              <p className="text-sm text-gray-500 mb-4">{selected.name}</p>
              {reportMsg ? (
                <p className={`text-sm font-medium ${reportMsg.includes("alındı") ? "text-green-600" : "text-red-600"}`}>{reportMsg}</p>
              ) : (
                <form onSubmit={handleReport} className="space-y-3">
                  <div>
                    <label className="label">Sorun açıklaması</label>
                    <textarea className="input" rows={3} value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} required placeholder="Container bozuk, dolu veya erişilemiyor..." />
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-primary flex-1" type="submit">Bildir</button>
                    <button className="btn-secondary flex-1" type="button" onClick={() => setShowReportModal(false)}>İptal</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

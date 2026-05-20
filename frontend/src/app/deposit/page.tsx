"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Container, WasteDeposit, WasteType, WASTE_TYPE_LABELS, WASTE_TYPE_POINTS } from "@/lib/types";

const QrScanner = dynamic(() => import("@/components/QrScanner"), { ssr: false });

export default function DepositPage() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [form, setForm] = useState({ containerId: "", wasteType: "" as WasteType | "", weightKg: "" });
  const [result, setResult] = useState<WasteDeposit | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedContainer, setScannedContainer] = useState<Container | null>(null);

  useEffect(() => {
    api.get<Container[]>("/api/containers").then((r) => setContainers(r.data.filter((c) => c.status === "ACTIVE")));
  }, []);

  async function handleQrScan(code: string) {
    setShowScanner(false);
    setError("");
    try {
      const { data } = await api.get<Container>(`/api/containers/qr/${code}`);
      if (data.status !== "ACTIVE") {
        setError(`Bu container şu anda aktif değil (${data.status}).`);
        return;
      }
      setScannedContainer(data);
      setForm((f) => ({ ...f, containerId: String(data.id) }));
    } catch {
      setError("Geçersiz QR kod. Lütfen tekrar deneyin.");
    }
  }

  const estimatedPoints = form.wasteType && form.weightKg
    ? Math.round(parseFloat(form.weightKg) * WASTE_TYPE_POINTS[form.wasteType as WasteType])
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post<WasteDeposit>("/api/deposits", {
        containerId: Number(form.containerId),
        wasteType: form.wasteType,
        weightKg: parseFloat(form.weightKg),
      });
      setResult(data);
      setForm({ containerId: "", wasteType: "", weightKg: "" });
      setScannedContainer(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "İşlem başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Atık Bırak</h1>
        <p className="text-gray-500 mb-6">Container seçin, atık türünü ve ağırlığı girin, puan kazanın.</p>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-xl font-bold text-green-700">+{result.pointsEarned} Eko-Puan kazandınız!</p>
            <p className="text-gray-600 mt-1">Toplam puanınız: <strong>{result.totalPoints}</strong></p>
            <button onClick={() => setResult(null)} className="btn-primary mt-4">Yeni Atık Bırak</button>
          </div>
        )}

        {!result && (
          <form onSubmit={handleSubmit} className="card space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label mb-0">Container Seç</label>
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 border border-green-200 rounded-lg px-3 py-1.5 hover:bg-green-50 transition-colors"
                >
                  <span>📷</span> QR ile Tara
                </button>
              </div>

              {scannedContainer && (
                <div className="mb-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span className="font-medium text-green-700">{scannedContainer.name}</span>
                  <span className="text-gray-500">— {scannedContainer.address}</span>
                  <button type="button" onClick={() => { setScannedContainer(null); setForm((f) => ({ ...f, containerId: "" })); }} className="ml-auto text-gray-400 hover:text-gray-600">✕</button>
                </div>
              )}

              <select
                className="input"
                value={form.containerId}
                onChange={(e) => { setForm({ ...form, containerId: e.target.value }); setScannedContainer(null); }}
                required
              >
                <option value="">-- Container seçin --</option>
                {containers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({WASTE_TYPE_LABELS[c.wasteType]})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Atık Türü</label>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(WASTE_TYPE_LABELS) as WasteType[]).map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => setForm({ ...form, wasteType: t })}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${form.wasteType === t ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    {WASTE_TYPE_LABELS[t]}<br />
                    <span className="text-xs text-gray-500">{WASTE_TYPE_POINTS[t]} puan/kg</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Ağırlık (kg)</label>
              <input className="input" type="number" min="0.1" step="0.1" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} required placeholder="örn: 2.5" />
            </div>

            {estimatedPoints > 0 && (
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-green-700 font-semibold">Tahmini kazanç: <span className="text-xl">{estimatedPoints}</span> puan</p>
              </div>
            )}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "İşleniyor..." : "Puan Kazan"}
            </button>
          </form>
        )}
      </main>

      {showScanner && (
        <QrScanner onScan={handleQrScan} onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
}

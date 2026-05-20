"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Container, ContainerReport, WasteCollection, WasteType, ContainerStatus, WASTE_TYPE_LABELS } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });
const QrScanner = dynamic(() => import("@/components/QrScanner"), { ssr: false });

const emptyForm = { name: "", address: "", latitude: "", longitude: "", capacityKg: "100", wasteType: "MIXED" as WasteType, status: "ACTIVE" as ContainerStatus };

type Tab = "containers" | "reports" | "collect";

export default function MunicipalityPage() {
  const [tab, setTab] = useState<Tab>("containers");
  const [containers, setContainers] = useState<Container[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [fillModal, setFillModal] = useState<Container | null>(null);
  const [fillKg, setFillKg] = useState("");
  const [msg, setMsg] = useState("");

  // Reports
  const [reports, setReports] = useState<ContainerReport[]>([]);

  // QR Collect
  const [showScanner, setShowScanner] = useState(false);
  const [scannedContainer, setScannedContainer] = useState<Container | null>(null);
  const [collectResult, setCollectResult] = useState<{ containerName: string; collectedWeightKg: number } | null>(null);
  const [collectError, setCollectError] = useState("");
  const [collections, setCollections] = useState<WasteCollection[]>([]);

  async function loadContainers() {
    const { data } = await api.get<Container[]>("/api/containers");
    setContainers(data);
  }

  async function loadReports() {
    const { data } = await api.get<ContainerReport[]>("/api/admin/reports");
    setReports(data);
  }

  async function loadCollections() {
    const { data } = await api.get<WasteCollection[]>("/api/collections/my");
    setCollections(data);
  }

  useEffect(() => {
    loadContainers();
    loadReports();
    loadCollections();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), capacityKg: parseFloat(form.capacityKg) };
    if (editId) {
      await api.put(`/api/containers/${editId}`, payload);
    } else {
      await api.post("/api/containers", payload);
    }
    setShowForm(false); setEditId(null); setForm(emptyForm);
    await loadContainers(); setMsg("Container kaydedildi.");
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu containeri silmek istediğinize emin misiniz?")) return;
    await api.delete(`/api/containers/${id}`);
    await loadContainers(); setMsg("Container silindi.");
  }

  async function handleFillUpdate(e: React.FormEvent) {
    e.preventDefault();
    await api.patch(`/api/containers/${fillModal!.id}/fill`, { fillKg: parseFloat(fillKg) });
    setFillModal(null); setFillKg(""); await loadContainers(); setMsg("Doluluk güncellendi.");
  }

  function startEdit(c: Container) {
    setForm({ name: c.name, address: c.address || "", latitude: String(c.latitude), longitude: String(c.longitude), capacityKg: String(c.capacityKg), wasteType: c.wasteType, status: c.status });
    setEditId(c.id); setShowForm(true);
  }

  async function handleResolve(id: number) {
    await api.patch(`/api/admin/reports/${id}/resolve`);
    await loadReports(); setMsg("Rapor kapatıldı.");
  }

  async function handleQrScan(code: string) {
    setShowScanner(false);
    setCollectError("");
    setCollectResult(null);
    try {
      const { data } = await api.get<Container>(`/api/containers/qr/${code}`);
      setScannedContainer(data);
    } catch {
      setCollectError("Geçersiz QR kod.");
    }
  }

  async function handleCollect() {
    if (!scannedContainer) return;
    try {
      const { data } = await api.post<{ containerName: string; collectedWeightKg: number }>("/api/collections/collect", { qrCode: scannedContainer.qrCode });
      setCollectResult(data);
      setScannedContainer(null);
      await loadContainers();
      await loadCollections();
    } catch {
      setCollectError("Toplama kaydedilemedi.");
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Belediye Paneli</h1>
          {tab === "containers" && (
            <button className="btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}>+ Yeni Container</button>
          )}
        </div>

        {msg && <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-green-700">{msg}</div>}

        {/* Sekmeler */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["containers", "reports", "collect"] as Tab[]).map((t) => (
            <button key={t} onClick={() => { setTab(t); setMsg(""); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {t === "containers" ? "Containerlar" : t === "reports" ? `Arıza Bildirimleri ${reports.length > 0 ? `(${reports.length})` : ""}` : "QR ile Topla"}
            </button>
          ))}
        </div>

        {/* --- CONTAINERS TAB --- */}
        {tab === "containers" && (
          <>
            <div className="card mb-6">
              <h2 className="font-semibold mb-3">Container Doluluk Haritası</h2>
              <MapView containers={containers} />
            </div>
            <div className="card">
              <h2 className="font-semibold mb-4">Tüm Containerlar ({containers.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">İsim</th><th className="pb-2">Tür</th><th className="pb-2">Doluluk</th><th className="pb-2">Durum</th><th className="pb-2">İşlem</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {containers.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3"><p className="font-medium">{c.name}</p><p className="text-gray-400 text-xs">{c.address}</p></td>
                        <td className="py-3">{WASTE_TYPE_LABELS[c.wasteType]}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="h-2 rounded-full" style={{ width: `${Math.min(c.fillPercentage, 100)}%`, backgroundColor: c.fillPercentage > 85 ? "#dc2626" : c.fillPercentage > 60 ? "#f97316" : c.fillPercentage > 30 ? "#facc15" : "#22c55e" }} />
                            </div>
                            <span className="text-xs">{c.fillPercentage.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={c.status === "ACTIVE" ? "badge-green" : c.status === "FULL" ? "badge-red" : "badge-gray"}>
                            {c.status === "ACTIVE" ? "Aktif" : c.status === "FULL" ? "Dolu" : "Bakım"}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <button onClick={() => { setFillModal(c); setFillKg(String(c.currentFillKg)); }} className="text-blue-600 hover:underline text-xs">Doluluk</button>
                            <button onClick={() => startEdit(c)} className="text-green-600 hover:underline text-xs">Düzenle</button>
                            <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline text-xs">Sil</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* --- REPORTS TAB --- */}
        {tab === "reports" && (
          <div className="card">
            {reports.length === 0 ? (
              <p className="text-gray-500 text-sm">Açık arıza bildirimi bulunmuyor.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Container</th><th className="pb-2">Açıklama</th><th className="pb-2">Tarih</th><th className="pb-2">İşlem</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {reports.map((r) => (
                      <tr key={r.id}>
                        <td className="py-3 font-medium">{r.containerName}</td>
                        <td className="py-3 text-gray-600 max-w-xs">{r.description}</td>
                        <td className="py-3 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString("tr-TR")}</td>
                        <td className="py-3">
                          <button onClick={() => handleResolve(r.id)} className="text-green-600 hover:underline text-xs">✓ Çözüldü</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- QR COLLECT TAB --- */}
        {tab === "collect" && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="font-semibold text-lg mb-4">QR ile Atık Toplama</h2>

              {collectResult ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-3">✅</div>
                  <p className="text-xl font-bold text-green-700">{collectResult.containerName} boşaltıldı</p>
                  <p className="text-gray-500 mt-1">{collectResult.collectedWeightKg.toFixed(1)} kg atık toplandı</p>
                  <button onClick={() => { setCollectResult(null); setCollectError(""); }} className="btn-primary mt-4">Yeni Tarama</button>
                </div>
              ) : scannedContainer ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-blue-800">{scannedContainer.name}</p>
                    <p className="text-sm text-blue-600">{scannedContainer.address}</p>
                    <p className="text-sm text-blue-600 mt-1">
                      Doluluk: <strong>{scannedContainer.fillPercentage.toFixed(0)}%</strong>
                      {" · "}Mevcut: <strong>{scannedContainer.currentFillKg.toFixed(1)} kg</strong>
                    </p>
                  </div>
                  {collectError && <p className="text-red-600 text-sm">{collectError}</p>}
                  <div className="flex gap-3">
                    <button onClick={handleCollect} className="btn-primary flex-1">✓ Toplamayı Onayla</button>
                    <button onClick={() => { setScannedContainer(null); setCollectError(""); }} className="btn-secondary flex-1">İptal</button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  {collectError && <p className="text-red-600 text-sm mb-4">{collectError}</p>}
                  <p className="text-gray-500 mb-4">Container üzerindeki QR kodu tarayın</p>
                  <button onClick={() => { setShowScanner(true); setCollectError(""); }} className="btn-primary">
                    📷 QR Tara
                  </button>
                </div>
              )}
            </div>

            {collections.length > 0 && (
              <div className="card">
                <h2 className="font-semibold mb-4">Toplama Geçmişim</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-500 border-b">
                      <th className="pb-2">Container</th><th className="pb-2">Toplanan (kg)</th><th className="pb-2">Tarih</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {collections.map((c) => (
                        <tr key={c.id}>
                          <td className="py-3 font-medium">{c.containerName}</td>
                          <td className="py-3">{c.collectedWeightKg.toFixed(1)} kg</td>
                          <td className="py-3 text-gray-400">{new Date(c.collectedAt).toLocaleDateString("tr-TR")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Container form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="font-bold text-lg mb-4">{editId ? "Container Düzenle" : "Yeni Container"}</h3>
              <form onSubmit={handleSave} className="space-y-3">
                <div><label className="label">İsim</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label className="label">Adres</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="label">Enlem</label><input className="input" type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} required /></div>
                  <div><label className="label">Boylam</label><input className="input" type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} required /></div>
                </div>
                <div><label className="label">Kapasite (kg)</label><input className="input" type="number" value={form.capacityKg} onChange={(e) => setForm({ ...form, capacityKg: e.target.value })} required /></div>
                <div><label className="label">Atık Türü</label>
                  <select className="input" value={form.wasteType} onChange={(e) => setForm({ ...form, wasteType: e.target.value as WasteType })}>
                    {(Object.keys(WASTE_TYPE_LABELS) as WasteType[]).map((t) => <option key={t} value={t}>{WASTE_TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button className="btn-primary flex-1" type="submit">Kaydet</button>
                  <button className="btn-secondary flex-1" type="button" onClick={() => { setShowForm(false); setEditId(null); }}>İptal</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Fill update modal */}
        {fillModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
              <h3 className="font-bold text-lg mb-2">Doluluk Güncelle</h3>
              <p className="text-sm text-gray-500 mb-4">{fillModal.name} · Kapasite: {fillModal.capacityKg} kg</p>
              <form onSubmit={handleFillUpdate} className="space-y-3">
                <div><label className="label">Mevcut doluluk (kg)</label><input className="input" type="number" step="0.1" min="0" max={fillModal.capacityKg} value={fillKg} onChange={(e) => setFillKg(e.target.value)} required /></div>
                <div className="flex gap-3">
                  <button className="btn-primary flex-1" type="submit">Güncelle</button>
                  <button className="btn-secondary flex-1" type="button" onClick={() => setFillModal(null)}>İptal</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showScanner && (
          <QrScanner onScan={handleQrScan} onClose={() => setShowScanner(false)} />
        )}
      </main>
    </div>
  );
}

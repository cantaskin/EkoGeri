import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-green-700 font-bold text-xl">
          <span className="text-3xl">♻️</span> EkoGeri
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary">Giriş Yap</Link>
          <Link href="/register" className="btn-primary">Üye Ol</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Geri Dönüşümle <span className="text-green-600">Puan Kazan</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Atıklarını doğru containerına bırak, Eko-Puan kazan, ulaşım ve indirim ödüllerine dönüştür.
          Çevreye katkın puanlarla ölçülsün.
        </p>
        <Link href="/register" className="btn-primary text-lg px-8 py-3">
          Hemen Başla
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          {[
            { icon: "📍", title: "Yakın Container Bul", desc: "Harita üzerinde en yakın geri dönüşüm noktalarını görüntüle." },
            { icon: "🏆", title: "Puan Kazan", desc: "Her kilogram atık için Eko-Puan kazan. Plastik 10, Cam 12 puan/kg." },
            { icon: "🎁", title: "Ödüllere Dönüştür", desc: "Puanlarını İstanbul Kart bakiyesi, market indirimi ve daha fazlasına çevir." },
          ].map((f) => (
            <div key={f.title} className="card">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

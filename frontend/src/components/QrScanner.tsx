"use client";
import { useEffect, useRef } from "react";

interface Props {
  onScan: (code: string) => void;
  onClose: () => void;
}

export default function QrScanner({ onScan, onClose }: Props) {
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const elementId = "qr-reader-modal";

  useEffect(() => {
    let stopped = false;

    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (stopped) return;
      const scanner = new Html5Qrcode(elementId);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => {
            scanner.stop().then(() => onScan(decodedText)).catch(() => onScan(decodedText));
          },
          () => {}
        )
        .catch(() => {});
    });

    return () => {
      stopped = true;
      scannerRef.current?.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">QR Kodu Tara</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Container üzerindeki QR kodu kameraya gösterin</p>
        <div id={elementId} className="w-full rounded overflow-hidden" />
        <button onClick={onClose} className="btn-secondary w-full mt-4">İptal</button>
      </div>
    </div>
  );
}

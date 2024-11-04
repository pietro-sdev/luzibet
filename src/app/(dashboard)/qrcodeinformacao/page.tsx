'use client';
export const dynamic = "force-dynamic";

import { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import NotificationButton from '@/components/ui/notification-button';

export default function QRCodeInformacao() {
  const qrCodeUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/captura`; // URL que o QR Code direcionará
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  // Função para verificar o status do pagamento
  const checkPaymentStatus = async () => {
    try {
      const response = await fetch('/api/payment/status');
      const data = await response.json();
      setPaymentStatus(data.status); // Atualiza o estado com o status do pagamento
    } catch (error) {
      console.error('Erro ao verificar o status do pagamento:', error);
    }
  };

  useEffect(() => {
    checkPaymentStatus();
    const interval = setInterval(checkPaymentStatus, 5000); // Checa a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  // Função para converter o QR Code em uma imagem e compartilhar
  const handleShare = async () => {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        alert('QR Code não encontrado');
        return;
      }

      const dataUrl = canvas.toDataURL('image/png');
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'QR Code para Captura de Dados',
          text: 'Escaneie o QR Code ou clique no link para capturar os dados do usuário.',
          files: [file],
          url: qrCodeUrl,
        });
        console.log('QR Code compartilhado com sucesso!');
      } else {
        alert('Seu dispositivo não suporta o compartilhamento de arquivos.');
      }
    } catch (error) {
      console.error('Erro ao compartilhar QR Code:', error);
      alert('Erro ao compartilhar o QR Code.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-semibold mb-6">QR Code para capturar os dados do usuário</h1>

      <div ref={qrCodeRef} className="p-4 bg-white rounded-lg">
        <QRCodeCanvas
          value={qrCodeUrl}
          size={200}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="Q"
          includeMargin={true}
        />
      </div>

      <button
        onClick={handleShare}
        className="mt-6 p-2 bg-green-500 font-semibold text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Compartilhar QR Code
      </button>

      {paymentStatus === 'COMPLETED' && (
        <div className="mt-4">
          <NotificationButton />
        </div>
      )}
    </div>
  );
}

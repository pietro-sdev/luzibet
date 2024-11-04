'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PagamentoPage() {
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const paymentId = searchParams ? searchParams.get('paymentId') : null; // Obtém o `paymentId` dos parâmetros

  useEffect(() => {
    const fetchPaymentLink = async () => {
      try {
        setLoading(true);
        console.log('Iniciando a busca do QR Code de pagamento...');

        if (!paymentId) {
          throw new Error('ID de pagamento não encontrado nos parâmetros.');
        }

        const response = await fetch('/api/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId }),
        });

        if (!response.ok) {
          console.error('Erro ao gerar QR Code de pagamento:', response.statusText);
          throw new Error('Erro ao gerar QR Code de pagamento');
        }

        const data = await response.json();
        setQrCodeBase64(data.qr_code_base64); // `qr_code_base64` é a imagem em base64 do QR Code PIX
        console.log('QR Code de pagamento obtido.');
      } catch (error: any) {
        setError(error.message || 'Erro desconhecido');
        console.error('Erro ao buscar o QR Code de pagamento:', error);
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) fetchPaymentLink();
  }, [paymentId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-bgLuizbet border-2 border-[#202020] rounded-lg shadow-lg text-center">
        <h1 className="text-xl font-semibold">Pagamento</h1>
        <p className="text-gray-300 mb-4">Escaneie o QR Code abaixo para realizar o pagamento via PIX.</p>

        {loading && <p>Carregando QR Code...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && qrCodeBase64 && (
          <div className="bg-white rounded-lg p-4">
            <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code PIX" />
          </div>
        )}
      </div>
    </div>
  );
}

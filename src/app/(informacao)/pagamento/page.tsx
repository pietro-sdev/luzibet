'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const PagamentoPage = () => {
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [qrCodeCopiaECola, setQrCodeCopiaECola] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const paymentId = searchParams ? searchParams.get('paymentId') : null;

  useEffect(() => {
    const fetchPaymentLink = async () => {
      try {
        setLoading(true);

        if (!paymentId) {
          throw new Error('ID de pagamento não encontrado nos parâmetros.');
        }

        const response = await fetch('/api/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId }),
        });

        if (!response.ok) {
          throw new Error('Erro ao gerar QR Code de pagamento');
        }

        const data = await response.json();
        setQrCodeBase64(data.qr_code_base64); // QR Code em base64
        setQrCodeCopiaECola(data.qr_code_copia_e_cola); // Código "copia e cola"
      } catch (error: any) {
        setError(error.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) fetchPaymentLink();
  }, [paymentId]);

  const handleCopy = () => {
    if (qrCodeCopiaECola) {
      navigator.clipboard.writeText(qrCodeCopiaECola);
      alert('Código PIX copiado para a área de transferência!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-bgLuizbet border-2 border-[#202020] rounded-lg shadow-lg text-center">
        <h1 className="text-xl font-semibold">Pagamento</h1>
        <p className="text-gray-300 mb-4">Escaneie o QR Code abaixo ou use o código de "copia e cola" para realizar o pagamento via PIX.</p>

        {loading && <p>Carregando QR Code...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && qrCodeBase64 && (
          <>
            <div className="bg-white rounded-lg p-4">
              <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code PIX" />
            </div>
            {qrCodeCopiaECola && (
              <div className="mt-4">
                <p className="text-gray-300">Código Copia e Cola:</p>
                <p className="text-gray-100 bg-gray-800 rounded-md p-2 mt-2">{qrCodeCopiaECola}</p>
                <button
                  onClick={handleCopy}
                  className="mt-2 p-2 bg-green-500 font-semibold text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Copiar Código PIX
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Desativa a renderização no servidor para essa página
export default dynamic(() => Promise.resolve(PagamentoPage), { ssr: false });

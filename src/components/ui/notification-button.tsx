import { useEffect, useState } from 'react';

export default function NotificationButton() {
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  useEffect(() => {
    async function checkPaymentStatus() {
      const response = await fetch('/api/payment/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'payment.updated',
          data: { id: 'example-payment-id' }, // Substitua pelo ID correto
        }),
      });

      const data = await response.json();
      if (data.whatsappLink) {
        setWhatsappLink(data.whatsappLink);
      }
    }

    checkPaymentStatus();
  }, []);

  if (!whatsappLink) return null;

  return (
    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
      <button>Enviar Mensagem no WhatsApp</button>
    </a>
  );
}

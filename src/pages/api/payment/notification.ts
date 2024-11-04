// pages/api/payment/notification.ts
import mercadopago from 'mercadopago';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_ACCESS_TOKEN!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { type, action, data } = req.body;

    if (type === 'payment' && action === 'payment.updated' && data.id) {
      const paymentId = data.id;
      const payment = await mercadopago.payment.findById(paymentId);

      if (payment.body.status === 'approved') {
        const dbPayment = await prisma.payment.findFirst({
          where: { mercadoPagoId: String(paymentId) },
        });

        if (dbPayment) {
          await prisma.payment.update({
            where: { id: dbPayment.id },
            data: { paymentStatus: 'COMPLETED', paymentDate: new Date() },
          });

          // Número de telefone do cliente (substitua pelo telefone do cliente real)
          const phoneNumber = '5511998765432';
          const message = encodeURIComponent('Seu pagamento foi confirmado com sucesso! Obrigado por escolher nosso serviço.');

          // Cria o link de WhatsApp para o cliente
          const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;

          // Opcional: envia o link de WhatsApp no corpo da resposta (para integração futura ou testes)
          return res.status(200).json({ 
            message: 'Pagamento atualizado com sucesso', 
            whatsappLink 
          });
        } else {
          return res.status(404).json({ message: 'Pagamento não encontrado no banco de dados' });
        }
      } else {
        return res.status(200).json({ message: 'Pagamento ainda não aprovado' });
      }
    } else {
      return res.status(400).json({ message: 'Tipo ou ação inválida' });
    }
  } catch (error) {
    console.error('Erro ao processar notificação:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}

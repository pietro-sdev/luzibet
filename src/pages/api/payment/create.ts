// pages/api/payment/create.ts

import mercadopago from 'mercadopago';
import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_ACCESS_TOKEN!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ message: 'paymentId é obrigatório' });
  }

  try {
    console.log('Buscando o valor configurado para o QR Code no banco de dados...');
    const qrCodeValue = await prisma.qRCodeValue.findFirst({
      where: { id: 1 },
    });

    if (!qrCodeValue || !qrCodeValue.amount) {
      console.error('Valor do QR Code não encontrado ou não definido');
      return res.status(400).json({ message: 'Valor do QR Code não definido' });
    }

    console.log('Valor do QR Code encontrado:', qrCodeValue.amount);

    // Cria um pagamento com método PIX no Mercado Pago
    console.log('Criando um pagamento PIX no Mercado Pago...');
    const payment = await mercadopago.payment.create({
      transaction_amount: qrCodeValue.amount,
      description: 'Pagamento de Serviço',
      payment_method_id: 'pix',
      installments: 1,
      payer: {
        email: 'pietro07menezes@gmail.com',
      },
    });

    console.log('Pagamento PIX criado com sucesso:', payment.body);

    // Atualiza o pagamento no banco de dados com o valor, status pendente e ID do Mercado Pago
    await prisma.payment.update({
      where: { id: parseInt(paymentId, 10) },
      data: { 
        amount: qrCodeValue.amount, 
        paymentStatus: 'PENDING', 
        mercadoPagoId: String(payment.body.id) // Converte o ID para string
      },
    });

    // Retorna o QR Code e link para pagamento PIX
    res.status(200).json({
      qr_code: payment.body.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: payment.body.point_of_interaction.transaction_data.qr_code_base64,
    });
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    res.status(500).json({ message: 'Erro ao criar pagamento PIX' });
  }
}

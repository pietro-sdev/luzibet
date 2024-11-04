// pages/api/payment/getPayments.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    // Busca todos os pagamentos
    const payments = await prisma.payment.findMany({
      select: {
        id: true,
        nome: true,
        phone: true,
        amount: true,
        paymentStatus: true,
        paymentDate: true,
        createdAt: true,
      },
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    res.status(500).json({ message: 'Erro ao buscar pagamentos' });
  }
}

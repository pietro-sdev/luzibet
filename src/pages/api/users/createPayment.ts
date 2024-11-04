// pages/api/users/createPayment.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { nome, telefone } = req.body;

  try {
    // Cria um pagamento com o nome e telefone do cliente diretamente no modelo Payment
    const payment = await prisma.payment.create({
      data: {
        nome,
        phone: telefone,
        amount: 0, // O valor será atualizado quando buscarmos o valor definido do QR Code
        paymentStatus: 'PENDING',
        createdAt: new Date(),
      },
    });

    // Retorna o `paymentId` criado
    res.status(201).json({ message: 'Dados capturados e pagamento criado com sucesso.', paymentId: payment.id });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({ message: 'Erro ao criar pagamento' });
  }
}

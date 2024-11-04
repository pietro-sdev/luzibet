import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const bankAccount = await prisma.bankAccount.findUnique({
      where: { id: 1 },
    });

    if (!bankAccount) {
      return res.status(404).json({ message: 'Conta bancária não encontrada' });
    }

    res.status(200).json(bankAccount);
  } catch (error) {
    console.error('Erro ao buscar conta bancária:', error);
    res.status(500).json({ message: 'Erro ao buscar conta bancária' });
  }
}

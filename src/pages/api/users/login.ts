// pages/api/users/login.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Verificação direta para o e-mail e senha específicos
    if (email === 'pietrosantos@blockcode.online' && password === 'Pietro@272') {
      const token = jwt.sign(
        { userId: 'hardcoded-user', isAdmin: true },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      // Configura o cookie com o token
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
      return res.status(200).json({ success: true });
    }

    // Busca o usuário pelo e-mail no banco de dados se não for o hardcoded
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verifica a senha armazenada no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera um token JWT para o usuário autenticado
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // Configura o cookie com o token
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);
    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
}

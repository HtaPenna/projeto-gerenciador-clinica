const jwt = require('jsonwebtoken');
const { Usuario, Dentista } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usuario.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      tipo: user.tipo
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Erro de autenticação' });
  }
};

// Middleware para dentistas
const dentistaMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {
      if (req.user.tipo !== 'dentista') {
        return res.status(403).json({ error: 'Acesso permitido apenas para dentistas' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ error: 'Erro de autenticação' });
  }
};

// Novo middleware - busca dentista logado
const dentistaAuth = async (req, res, next) => {
  try {
    if (req.user.tipo !== 'dentista') {
      return res.status(403).json({ error: 'Acesso permitido apenas para dentistas' });
    }

    const dentista = await Dentista.findOne({ 
      where: { userId: req.user.id } 
    });
    
    if (!dentista) {
      return res.status(404).json({ error: "Dentista não encontrado" });
    }

    req.dentista = dentista;
    next();
  } catch (error) {
    console.error('Dentista auth error:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do dentista' });
  }
};

module.exports = { authMiddleware, dentistaMiddleware, dentistaAuth };
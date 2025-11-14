const { Dentista } = require('../models');

const dentistaAuth = async (req, res, next) => {
  try {
    console.log("🔍 [DENTISTA AUTH] User logado:", req.user);
    if (req.user.tipo !== 'dentista') {
      return res.status(403).json({ error: 'Acesso permitido apenas para dentistas' });
    }

    const dentista = await Dentista.findOne({ 
      where: { userId: req.user.id } 
    });

    console.log("🔍 [DENTISTA AUTH] Dentista encontrado:", dentista?.id);
    
    if (!dentista) {
      return res.status(404).json({ error: "Dentista não encontrado" });
    }

    req.dentista = dentista;
    next();
  } catch (error) {
    console.error("❌ [DENTISTA AUTH] Erro:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = dentistaAuth;
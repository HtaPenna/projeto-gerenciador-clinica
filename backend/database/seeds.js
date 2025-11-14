const bcrypt = require('bcryptjs');
const { 
  Usuario, Dentista, Paciente, Suprimento, Tratamento, Procedimento, Evento, Anamnese, Especialidade, sequelize 
} = require('../models');

async function createInitialData() {
  try {
    console.log('Iniciando população do banco...');

    await sequelize.sync({ force: true });

    // 1. CRIAR DENTISTAS
    console.log('Criando dentistas...');
    const dentistaUsers = await Usuario.bulkCreate([
      {
        email: 'dr.silva@clinica.com',
        senha: await bcrypt.hash('Senha123!', 10),
        tipo: 'dentista'
      },
      {
        email: 'dra.santos@clinica.com', 
        senha: await bcrypt.hash('Senha123!', 10),
        tipo: 'dentista'
      }
    ]);

    const dentistas = await Dentista.bulkCreate([
      {
        userId: dentistaUsers[0].id,
        nome: 'Dr. Carlos Silva',
        cro: 'SP12345',
        enderecoConsultorio: 'Rua das Flores, 123 - Centro, São Paulo/SP',
        telefoneConsultorio: '11987654321'
      },
      {
        userId: dentistaUsers[1].id,
        nome: 'Dra. Ana Santos',
        cro: 'SP67890', 
        enderecoConsultorio: 'Av. Paulista, 1000 - Bela Vista, São Paulo/SP',
        telefoneConsultorio: '11912345678'
      }
    ]);

    // 2. CRIAR ESTOQUE (10 SUPRIMENTOS POR DENTISTA)
    console.log('Criando suprimentos...');
    await createSuprimentos(dentistas);

    // 3. CRIAR PACIENTES EXCLUSIVOS
    console.log('Criando pacientes...');
    
    // Pacientes do Dr. Silva
    for (let i = 1; i <= 10; i++) {
      await createPacienteCompleto(i, dentistas[0].id, 'silva');
    }

    // Pacientes da Dra. Santos  
    for (let i = 11; i <= 20; i++) {
      await createPacienteCompleto(i, dentistas[1].id, 'santos');
    }

    console.log('Dados iniciais criados com sucesso!');
    console.log(`Dr. Silva: 10 pacientes | Dra. Santos: 10 pacientes`);
    console.log(`Cada dentista: 10 suprimentos no estoque`);

  } catch (error) {
    console.error('Erro ao criar dados iniciais:', error);
    throw error;
  }
}

async function createSuprimentos(dentistas) {
  const suprimentosData = [];
  
  dentistas.forEach(dentista => {
    const prefixo = dentista.nome.includes('Silva') ? 'SILVA' : 'SANTOS';
    
    // 10 suprimentos para cada dentista
    for (let i = 1; i <= 10; i++) {
      suprimentosData.push({
        dentistaId: dentista.id,
        Codigo_Sup: parseInt(`${dentista.id}${i.toString().padStart(3, '0')}`),
        Nome_Sup: `Suprimento ${prefixo} ${i}`,
        Tipo_Sup: i % 3 === 0 ? 'Medicamento' : i % 3 === 1 ? 'Material' : 'EPI',
        Descricao_Sup: `Descrição do suprimento ${i} - ${prefixo}`,
        Quantidade_Sup: Math.floor(Math.random() * 100) + 20,
        QuantidadeMin_Sup: 10
      });
    }
  });

  await Suprimento.bulkCreate(suprimentosData);
}

async function createPacienteCompleto(i, dentistaId, sobrenome) {
  const user = await Usuario.create({
    email: `paciente.${sobrenome}${i}@email.com`,
    senha: await bcrypt.hash('Senha123!', 10),
    tipo: 'paciente'
  });

  const paciente = await Paciente.create({
    userId: user.id,
    dentistaId: dentistaId,
    nome: `Paciente ${sobrenome.charAt(0).toUpperCase() + sobrenome.slice(1)} ${i}`,
    cpf: `${sobrenome === 'silva' ? '111' : '222'}111111${i.toString().padStart(2, '0')}`,
    email: `paciente.${sobrenome}${i}@email.com`,
    telefoneCelular: `119${sobrenome === 'silva' ? '8888' : '7777'}${i.toString().padStart(4, '0')}`,
    dataNascimento: new Date(1980 + (i % 30), i % 12, (i % 28) + 1),
    cep: '01234-567',
    logradouro: `${sobrenome === 'silva' ? 'Rua Silva' : 'Av. Santos'}, ${i * 100}`,
    bairro: sobrenome === 'silva' ? 'Centro' : 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    genero: i % 2 === 0 ? 'Masculino' : 'Feminino'
  });

  // Tratamento
  const tratamento = await Tratamento.create({
    pacienteId: paciente.id,
    nome: `Tratamento ${sobrenome === 'silva' ? 'Ortodontia' : 'Clareamento'} ${i}`,
    valorTotal: 0
  });

  // Procedimento
  const procedimento = await Procedimento.create({
    tratamentoId: tratamento.id,
    nome: `Procedimento ${i}`,
    descricao: `Descrição do procedimento ${i}`,
    valor: sobrenome === 'silva' ? 150.00 + (i * 10) : 200.00 + (i * 10),
    status: 'pendente'
  });

  // Evento (Consulta)
  await Evento.create({
    dentistaId: dentistaId,
    pacienteId: paciente.id,
    tratamentoId: tratamento.id,
    procedimentoId: procedimento.id,
    inicio: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)),
    fim: new Date(Date.now() + (i * 24 * 60 * 60 * 1000) + 60 * 60 * 1000),
    status: i % 3 === 0 ? 'concluída' : 'agendada',
    descricao: `Consulta ${i} - ${paciente.nome}`,
    valorPrevisto: procedimento.valor
  });

  // Anamnese para alguns pacientes
  if (i <= 3) {
    await Anamnese.create({
      pacienteId: paciente.id,
      queixaPrincipal: `Dor no dente ${i}`,
      condicoesSaude: JSON.stringify(['Hipertensão', 'Diabetes']),
      antecedentesMedicos: 'Nenhum antecedente relevante',
      usoMedicamentos: 'Nenhum medicamento em uso',
      alergias: 'Nenhuma alergia conhecida',
      sobreCicatrizacao: 'Normal',
      fumante: i % 4 === 0,
      consumoBebidasAlcoolicas: i % 3 === 0,
      dificuldadeRespiratoria: false,
      problemaDigestivo: 'Nenhum',
      ultimoTratamento: 'Nenhum tratamento anterior',
      satisfacaoSorriso: true,
      dentesBrancos: i % 2 === 0,
      sensibilidadeDentes: 'Leve',
      usoFioDental: 'Diariamente',
      orientacaoBucal: 'Boa',
      desconfortoBucal: 'Nenhum',
      sobreMaxilar: 'Normal',
      placaMordida: 'Nenhuma',
      grauTensao: 'Baixo'
    });
  }
}

if (require.main === module) {
  createInitialData()
    .then(() => {
      console.log('População concluída!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = createInitialData;
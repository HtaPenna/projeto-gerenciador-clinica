const bcrypt = require('bcryptjs');
const {
  Usuario, Dentista, Paciente, Suprimento, Tratamento, Procedimento, Evento, Anamnese, sequelize
} = require('../models');

async function createInitialData() {
  try {
    console.log('Iniciando população do banco...');

    await sequelize.sync({ force: true });

    // 1. CRIAR DENTISTAS
    console.log('Criando dentistas...');
    const dentistaUsers = await Usuario.bulkCreate([
      {
        email: 'dr.carlos.silva@odontoclinic.com',
        senha: await bcrypt.hash('Senha123!', 10),
        tipo: 'dentista'
      },
      {
        email: 'dra.maria.santos@odontoclinic.com',
        senha: await bcrypt.hash('Senha123!', 10),
        tipo: 'dentista'
      }
    ]);

    const dentistas = await Dentista.bulkCreate([
      {
        userId: dentistaUsers[0].id,
        nome: 'Dr. Carlos Eduardo Silva',
        cro: 'SP-12345',
        enderecoConsultorio: 'Av. Paulista, 1578 - Bela Vista, São Paulo/SP',
        telefoneConsultorio: '1134567890'
      },
      {
        userId: dentistaUsers[1].id,
        nome: 'Dra. Maria Fernanda Santos',
        cro: 'SP-67890',
        enderecoConsultorio: 'Rua Augusta, 267 - Cerqueira César, São Paulo/SP',
        telefoneConsultorio: '1123456789'
      }
    ]);

    // 2. CRIAR ESTOQUE (30 SUPRIMENTOS POR DENTISTA)
    console.log('Criando suprimentos...');
    await createSuprimentos(dentistas);

    // 3. CRIAR PACIENTES COMPLETOS
    console.log('Criando pacientes...');

    // Pacientes do Dr. Silva
    for (let i = 1; i <= 15; i++) {
      await createPacienteCompleto(i, dentistas[0].id, 'silva');
    }

    // Pacientes da Dra. Santos  
    for (let i = 16; i <= 30; i++) {
      await createPacienteCompleto(i, dentistas[1].id, 'santos');
    }

    console.log('✅ Dados iniciais criados com sucesso!');
    console.log(`👨‍⚕️ Dr. Silva: 15 pacientes | 👩‍⚕️ Dra. Santos: 15 pacientes`);
    console.log(`📦 Cada dentista: 30 suprimentos no estoque`);
    console.log(`📅 Cada paciente: 1 tratamento + 1 procedimento + 1 consulta agendada`);
    console.log(`📋 Cada paciente: Anamnese completa`);

  } catch (error) {
    console.error('❌ Erro ao criar dados iniciais:', error);
    throw error;
  }
}

async function createSuprimentos(dentistas) {
  const suprimentosData = [];

  const tiposSuprimentos = {
    'Medicamento': [
      'Anestésico Lidocaína 2%', 'Analgésico Ibuprofeno', 'Antibiótico Amoxicilina',
      'Anti-inflamatório Diclofenaco', 'Anestésico Mepivacaína', 'Antisséptico Clorexidina'
    ],
    'Material': [
      'Seringa Carpule', 'Agulha 30G', 'Luvas de Latex', 'Máscara Cirúrgica',
      'Rolo de Alginato', 'Cimento Provisório', 'Broca Diamantada', 'Cone de Guta-percha'
    ],
    'EPI': [
      'Avental Descartável', 'Óculos de Proteção', 'Máscara N95', 'Touca Descartável',
      'Propé Descartável', 'Protetor Facial'
    ],
    'Consumível': [
      'Copa de Profilaxia', 'Fio Dental', 'Escova Interdental', 'Pasta Profilática',
      'Flúor Gel', 'Molusca para Clareamento'
    ]
  };

  dentistas.forEach(dentista => {
    const prefixo = dentista.nome.includes('Silva') ? 'SILVA' : 'SANTOS';
    let codigoBase = dentista.id * 1000;

    Object.entries(tiposSuprimentos).forEach(([tipo, itens]) => {
      itens.forEach((item, index) => {
        suprimentosData.push({
          dentistaId: dentista.id,
          Codigo_Sup: codigoBase++,
          Nome_Sup: item,
          Tipo_Sup: tipo,
          Descricao_Sup: `${item} - Fornecedor ${prefixo}`,
          Quantidade_Sup: Math.floor(Math.random() * 150) + 50,
          QuantidadeMin_Sup: 20,
          Unidade_Sup: tipo === 'Medicamento' ? 'caixa' : 'unidade',
          ValorUnitario_Sup: parseFloat((Math.random() * 50 + 5).toFixed(2))
        });
      });
    });
  });

  await Suprimento.bulkCreate(suprimentosData);
}

async function createPacienteCompleto(i, dentistaId, sobrenome) {
  const nomesMasculinos = [
    'João', 'Pedro', 'Carlos', 'Ricardo', 'Fernando', 'Lucas', 'Marcos', 'Rafael',
    'Daniel', 'Bruno', 'André', 'Paulo', 'Roberto', 'Eduardo', 'Felipe'
  ];

  const nomesFemininos = [
    'Ana', 'Maria', 'Juliana', 'Patrícia', 'Camila', 'Amanda', 'Beatriz', 'Carolina',
    'Larissa', 'Tatiane', 'Vanessa', 'Claudia', 'Renata', 'Simone', 'Elaine'
  ];

  const sobrenomes = [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida',
    'Pereira', 'Gomes', 'Martins', 'Rocha', 'Ribeiro', 'Carvalho', 'Lima', 'Costa'
  ];

  const genero = i % 2 === 0 ? 'Masculino' : 'Feminino';
  const nome = genero === 'Masculino'
    ? nomesMasculinos[(i - 1) % nomesMasculinos.length]
    : nomesFemininos[(i - 1) % nomesFemininos.length];

  const sobrenomeCompleto = sobrenomes[(i - 1) % sobrenomes.length];
  const nomeCompleto = `${nome} ${sobrenomeCompleto}`;

  const user = await Usuario.create({
    email: `${nome.toLowerCase()}.${sobrenomeCompleto.toLowerCase()}${i}@gmail.com`,
    senha: await bcrypt.hash('Senha123!', 10),
    tipo: 'paciente'
  });

  // TELEFONES MUITO MAIS CURTOS - APENAS 10-11 DÍGITOS
  const telefoneCelular = `119${dentistaId}${i}${i}${i}`; // 11 dígitos: 119 + dentistaId + i+i+i
  const telefoneResidencial = `11${dentistaId}${i}${i}${i}`; // 10 dígitos: 11 + dentistaId + i+i+i

  const paciente = await Paciente.create({
    userId: user.id,
    dentistaId: dentistaId,
    nome: nomeCompleto,
    cpf: `${dentistaId}${i.toString().padStart(2, '0')}${i}${i}${i}`, // CPF menor
    email: `${nome.toLowerCase()}.${sobrenomeCompleto.toLowerCase()}${i}@gmail.com`,
    telefoneCelular: telefoneCelular,
    telefoneResidencial: telefoneResidencial,
    dataNascimento: new Date(1970 + (i % 40), i % 12, (i % 28) + 1),
    cep: '01451000',
    logradouro: `Rua ${sobrenomeCompleto}, ${i * 100}`,
    bairro: dentistaId === 1 ? 'Bela Vista' : 'Jardins',
    cidade: 'São Paulo',
    estado: 'SP',
    genero: genero,
    profissao: ['Engenheiro', 'Médico', 'Professor', 'Advogado', 'Empresário'][(i - 1) % 5],
    estadoCivil: ['Solteiro', 'Casado', 'Divorciado'][(i - 1) % 3]
  });

  // TRATAMENTOS REALISTAS
  const tratamentos = [
    {
      nome: 'Ortodontia Corretiva',
      descricao: 'Tratamento para correção de má oclusão e alinhamento dental',
      duracao: '24 meses'
    },
    {
      nome: 'Clareamento Dental',
      descricao: 'Clareamento dental a laser para remoção de manchas',
      duracao: '2 sessões'
    },
    {
      nome: 'Implante Dentário',
      descricao: 'Reposição de dente perdido com implante de titânio',
      duracao: '6 meses'
    },
    {
      nome: 'Restauração Estética',
      descricao: 'Restauração em resina composta para dentes anteriores',
      duracao: '1 sessão'
    },
    {
      nome: 'Limpeza e Profilaxia',
      descricao: 'Limpeza dental completa e remoção de tártaro',
      duracao: '1 sessão'
    }
  ];

  const tratamentoSelecionado = tratamentos[(i - 1) % tratamentos.length];
  const tratamento = await Tratamento.create({
    pacienteId: paciente.id,
    nome: tratamentoSelecionado.nome,
    descricao: tratamentoSelecionado.descricao,
    valorTotal: 0,
    status: 'em_andamento',
    dataInicio: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000))
  });

  // PROCEDIMENTOS ESPECÍFICOS
  const procedimentosMap = {
    'Ortodontia Corretiva': [
      { nome: 'Colocação de aparelho fixo', valor: 2500.00 },
      { nome: 'Manutenção mensal', valor: 200.00 },
      { nome: 'Troca de fios', valor: 150.00 }
    ],
    'Clareamento Dental': [
      { nome: 'Sessão de clareamento a laser', valor: 800.00 },
      { nome: 'Kit caseiro de manutenção', valor: 350.00 }
    ],
    'Implante Dentário': [
      { nome: 'Cirurgia de implante', valor: 1800.00 },
      { nome: 'Coroa de porcelana', valor: 1200.00 },
      { nome: 'Consulta pós-operatória', valor: 150.00 }
    ],
    'Restauração Estética': [
      { nome: 'Restauração em resina', valor: 300.00 },
      { nome: 'Acabamento e polimento', valor: 80.00 }
    ],
    'Limpeza e Profilaxia': [
      { nome: 'Profilaxia completa', valor: 180.00 },
      { nome: 'Aplicação de flúor', valor: 50.00 }
    ]
  };

  const procedimentos = procedimentosMap[tratamentoSelecionado.nome];
  const procedimentoPrincipal = procedimentos[0];

  const procedimento = await Procedimento.create({
    tratamentoId: tratamento.id,
    nome: procedimentoPrincipal.nome,
    descricao: `Procedimento: ${procedimentoPrincipal.nome}`,
    valor: procedimentoPrincipal.valor,
    status: i % 3 === 0 ? 'concluido' : 'pendente',
    duracaoEstimada: 60
  });

  // EVENTO (CONSULTA)
  const dataBase = new Date();
  dataBase.setDate(dataBase.getDate() + (i * 2));

  await Evento.create({
    dentistaId: dentistaId,
    pacienteId: paciente.id,
    tratamentoId: tratamento.id,
    procedimentoId: procedimento.id,
    inicio: new Date(dataBase.getTime() + 9 * 60 * 60 * 1000),
    fim: new Date(dataBase.getTime() + 10 * 60 * 60 * 1000),
    status: i % 3 === 0 ? 'concluída' : (i % 3 === 1 ? 'confirmada' : 'agendada'),
    descricao: `${procedimentoPrincipal.nome} - ${paciente.nome}`,
    observacoes: i % 4 === 0 ? 'Paciente com ansiedade dental. Usar abordagem calmante.' : null,
    valorPrevisto: procedimentoPrincipal.valor
  });

  // ANAMNESE COMPLETA PARA TODOS OS PACIENTES
  await Anamnese.create({
    pacienteId: paciente.id,
    queixaPrincipal: [
      'Dor no dente posterior direito',
      'Dente quebrado',
      'Manchas nos dentes',
      'Sensibilidade ao frio',
      'Mau hálito persistente'
    ][(i - 1) % 5],
    condicoesSaude: JSON.stringify(i % 3 === 0 ? ['Hipertensão'] : i % 3 === 1 ? ['Diabetes'] : []),
    antecedentesMedicos: i % 4 === 0 ? 'Cirurgia cardíaca em 2018' : 'Nenhum antecedente relevante',
    usoMedicamentos: i % 3 === 0 ? 'Losartana 50mg' : i % 3 === 1 ? 'Metformina 850mg' : 'Nenhum medicamento em uso',
    alergias: i % 5 === 0 ? 'Penicilina' : 'Nenhuma alergia conhecida',
    sobreCicatrizacao: 'Normal',
    fumante: i % 5 === 0,
    consumoBebidasAlcoolicas: i % 3 === 0,
    dificuldadeRespiratoria: false,
    problemaDigestivo: 'Nenhum',
    ultimoTratamento: i % 4 === 0 ? 'Extração do siso em 2020' : 'Nenhum tratamento anterior',
    satisfacaoSorriso: i % 2 === 0,
    dentesBrancos: i % 3 === 0,
    sensibilidadeDentes: ['Leve', 'Moderada', 'Severa'][(i - 1) % 3],
    usoFioDental: ['Diariamente', 'Ocasionalmente', 'Raramente'][(i - 1) % 3],
    orientacaoBucal: i % 2 === 0 ? 'Boa' : 'Regular',
    desconfortoBucal: i % 6 === 0 ? 'Ranger de dentes noturno' : 'Nenhum',
    sobreMaxilar: 'Normal',
    placaMordida: 'Nenhuma',
    grauTensao: ['Baixo', 'Moderado', 'Alto'][(i - 1) % 3],
    observacoesAdicionais: i % 4 === 0 ? 'Paciente muito ansioso com procedimentos dentários' : null
  });
}

if (require.main === module) {
  createInitialData()
    .then(() => {
      console.log('\n🎉 População do banco concluída com sucesso!');
      console.log('📊 Resumo:');
      console.log('   👨‍⚕️ 2 Dentistas');
      console.log('   👥 30 Pacientes (15 cada)');
      console.log('   📦 60 Suprimentos (30 cada)');
      console.log('   🦷 30 Tratamentos + 30 Procedimentos');
      console.log('   📅 30 Consultas agendadas');
      console.log('   📋 30 Anamneses completas');
      console.log('\n🔑 Credenciais para login:');
      console.log('   Dentistas: dr.carlos.silva@odontoclinic.com / Senha123!');
      console.log('              dra.maria.santos@odontoclinic.com / Senha123!');
      console.log('   Pacientes: [nome.sobrenome]@gmail.com / Senha123!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erro fatal:', error);
      process.exit(1);
    });
}

module.exports = createInitialData;
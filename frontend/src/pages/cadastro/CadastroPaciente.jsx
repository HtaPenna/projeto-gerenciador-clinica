import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CadastroPacienteStepForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1, "novoPaciente" ou "criarUsuario"
  const [mensagem, setMensagem] = useState("");
  const [pacienteId, setPacienteId] = useState(null); // paciente existente

  // Campos do paciente
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefoneCelular, setTelefoneCelular] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefoneResidencial, setTelefoneResidencial] = useState("");
  const [telefoneEmergencia, setTelefoneEmergencia] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [genero, setGenero] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [tipoSanguineo, setTipoSanguineo] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [nomeConjuge, setNomeConjuge] = useState("");
  const [profissao, setProfissao] = useState("");
  const [redesSociais, setRedesSociais] = useState("");
  const [assinatura, setAssinatura] = useState("");

  // Campos do usuário
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // 1️⃣ Verifica se o paciente já existe
  const verificarPaciente = async () => {
    try {
      const res = await fetch(`http://localhost:3001/pacientes/verificar?cpf=${cpf}`);
      const data = await res.json();

      if (res.ok) {
        setMensagem(data.message);
        if (data.step === "novoPaciente") {
          setStep("novoPaciente");
        } else if (data.step === "criarUsuario") {
          setPacienteId(data.pacienteId);
          setStep("criarUsuario");
        }
      } else {
        setMensagem(data.erro);
      }
    } catch (err) {
      setMensagem("Erro no servidor");
    }
  };

  // 2️⃣ Cria paciente ou apenas usuário
  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Criar usuário
      const payloadUsuario = { email, senha };
      const resUsuario = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadUsuario),
      });

      const dataUsuario = await resUsuario.json();

      if (!resUsuario.ok) {
        setMensagem(dataUsuario.erro || "Erro ao criar usuário");
        return;
      }

      const userId = dataUsuario.id;
      console.log("Usuário criado com id:", userId);

      if (step === "criarUsuario" && pacienteId) {
        // 2️⃣ Atualiza paciente existente com o userId
        const resAtualizaPaciente = await fetch(`http://localhost:3001/pacientes/${pacienteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!resAtualizaPaciente.ok) {
          const dataErro = await resAtualizaPaciente.json();
          setMensagem(dataErro.erro || "Erro ao atualizar paciente");
          return;
        }

        setMensagem("Usuário vinculado ao paciente existente com sucesso!");
        navigate("/login");
        return;
      }

      // 2️⃣ Novo paciente, criar normalmente
      const payloadPaciente = {
        userId,
        nome,
        cpf,
        telefoneCelular,
        dataNascimento: dataNascimento || null,
        telefoneResidencial,
        telefoneEmergencia,
        cep,
        logradouro,
        bairro,
        cidade,
        estado,
        genero,
        peso,
        altura,
        tipoSanguineo,
        estadoCivil,
        nomeConjuge,
        profissao,
        redesSociais,
        assinatura
      };

      const resPaciente = await fetch("http://localhost:3001/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadPaciente),
      });

      const dataPaciente = await resPaciente.json();

      if (resPaciente.ok) {
        setMensagem("Usuário e paciente cadastrados com sucesso!");
        navigate("/login");
      } else {
        setMensagem(dataPaciente.erro || "Erro ao criar paciente");
      }

    } catch (err) {
      console.error(err);
      setMensagem("Erro no servidor");
    }
  };


  return (
    <div>
      <h2>Cadastro de Paciente</h2>

      {step === 1 && (
        <>
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
          <button onClick={verificarPaciente}>Verificar paciente</button>
        </>
      )}

      {(step === "novoPaciente" || step === "criarUsuario") && (
        <form onSubmit={handleCadastro}>
          {step === "novoPaciente" && (
            <>
              <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
              <input type="text" placeholder="Telefone Celular" value={telefoneCelular} onChange={(e) => setTelefoneCelular(e.target.value)} required />
              <input type="date" placeholder="Data de Nascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
              <input type="text" placeholder="Telefone Residencial" value={telefoneResidencial} onChange={(e) => setTelefoneResidencial(e.target.value)} />
              <input type="text" placeholder="Telefone de Emergência" value={telefoneEmergencia} onChange={(e) => setTelefoneEmergencia(e.target.value)} />
              <input type="text" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} required />
              <input type="text" placeholder="Logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} required />
              <input type="text" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
              <input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
              <input type="text" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} required />
              <select value={genero} onChange={(e) => setGenero(e.target.value)} required>
                <option value="">Gênero</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
              <input type="text" placeholder="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} />
              <input type="text" placeholder="Altura" value={altura} onChange={(e) => setAltura(e.target.value)} />
              <input type="text" placeholder="Tipo Sanguíneo" value={tipoSanguineo} onChange={(e) => setTipoSanguineo(e.target.value)} />
              <input type="text" placeholder="Estado Civil" value={estadoCivil} onChange={(e) => setEstadoCivil(e.target.value)} />
              <input type="text" placeholder="Nome do Cônjuge" value={nomeConjuge} onChange={(e) => setNomeConjuge(e.target.value)} />
              <input type="text" placeholder="Profissão" value={profissao} onChange={(e) => setProfissao(e.target.value)} />
              <input type="text" placeholder="Redes Sociais" value={redesSociais} onChange={(e) => setRedesSociais(e.target.value)} />
              <textarea placeholder="Assinatura" value={assinatura} onChange={(e) => setAssinatura(e.target.value)} />
            </>
          )}

          {/* Campos do usuário */}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />

          <button type="submit">Cadastrar</button>
        </form>
      )}

      {mensagem && <p>{mensagem}</p>}
      <p>Já tem conta? <Link to="/login">Login</Link></p>
    </div>
  );
}

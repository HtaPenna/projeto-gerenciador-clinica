import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CadastroPacienteStepForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // pode ser 1, "novoPaciente" ou "criarUsuario"
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [pacienteId, setPacienteId] = useState(null); // para vincular usuário ao paciente existente

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
          setPacienteId(data.pacienteId); // guarda o paciente existente
          setStep("criarUsuario");
        }
      } else {
        setMensagem(data.erro);
      }
    } catch (err) {
      setMensagem("Erro no servidor");
    }
  };

  // 2️⃣ Cria paciente + usuário ou apenas usuário
  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      const payload = { email, senha, nome, cpf, telefone, endereco };
      if (step === "criarUsuario") {
        payload.pacienteId = pacienteId; // envia ID do paciente existente
      }

      const res = await fetch("http://localhost:3001/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMensagem("Cadastro realizado com sucesso!");
        navigate("/login");
      } else {
        setMensagem(data.erro || "Erro no cadastro");
      }
    } catch (err) {
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
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          {step === "novoPaciente" && (
            <>
              <input
                type="text"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
              />
            </>
          )}
          <button type="submit">Cadastrar</button>
        </form>
      )}

      {mensagem && <p>{mensagem}</p>}
      <p>
        Já tem conta? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

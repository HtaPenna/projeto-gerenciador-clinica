import React, { useState, useEffect } from "react";

const API_PACIENTES = "http://localhost:3001/pacientes";

export default function VisaoGeral({ pacienteId }) {
  const [paciente, setPaciente] = useState(null);

  const carregarPaciente = async () => {
    try {
      const res = await fetch(`${API_PACIENTES}/${pacienteId}`);
      if (res.status === 404) {
        setPaciente(null);
        return;
      }
      const data = await res.json();
      setPaciente(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarPaciente();
  }, [pacienteId]);

  if (!paciente) return <p>Carregando dados do paciente...</p>;

  return (
    <div className="card-visao-geral p-4 bg-white shadow rounded mb-4">
      <h2 className="mb-4">Informações</h2>

      {/* Contatos e Comunicação */}
      <div className="mb-2">
        <h3 className="font-semibold text-sm">Contatos e Comunicação</h3>
        <p className="mb-1"><strong>Celular:</strong> {paciente.telefoneCelular}</p>
        {paciente.telefoneResidencial && <p className="mb-1"><strong>Residencial:</strong> {paciente.telefoneResidencial}</p>}
        {paciente.telefoneEmergencia && <p className="mb-1"><strong>Emergência:</strong> {paciente.telefoneEmergencia}</p>}
        {paciente.redesSociais && <p className="mb-1"><strong>Redes Sociais:</strong> {paciente.redesSociais}</p>}
      </div>

      {/* Endereço Residencial */}
      <div className="mb-2">
        <h3 className="font-semibold text-sm">Endereço Residencial</h3>
        <p className="mb-1"><strong>CEP:</strong> {paciente.cep}</p>
        <p className="mb-1"><strong>Logradouro:</strong> {paciente.logradouro}</p>
        <p className="mb-1"><strong>Bairro:</strong> {paciente.bairro}</p>
        <p className="mb-1"><strong>Cidade:</strong> {paciente.cidade}</p>
        <p className="mb-1"><strong>Estado:</strong> {paciente.estado}</p>
      </div>

      {/* Parâmetros Biomédicos */}
      <div className="mb-2">
        <h3 className="font-semibold text-sm">Parâmetros Biomédicos</h3>
        <p className="mb-1"><strong>Gênero:</strong> {paciente.genero}</p>
        {paciente.peso && <p className="mb-1"><strong>Peso:</strong> {paciente.peso}</p>}
        {paciente.altura && <p className="mb-1"><strong>Altura:</strong> {paciente.altura}</p>}
        {paciente.tipoSanguineo && <p className="mb-1"><strong>Tipo Sanguíneo:</strong> {paciente.tipoSanguineo}</p>}
      </div>

      {/* Dados Pessoais e Estado Civil */}
      <div className="mb-2">
        <h3 className="font-semibold text-sm">Dados Pessoais</h3>
        {paciente.estadoCivil && <p className="mb-1"><strong>Estado Civil:</strong> {paciente.estadoCivil}</p>}
        {paciente.nomeConjuge && <p className="mb-1"><strong>Cônjuge:</strong> {paciente.nomeConjuge}</p>}
        {paciente.profissao && <p className="mb-1"><strong>Profissão:</strong> {paciente.profissao}</p>}
      </div>

      {/* Assinatura */}
      {paciente.assinatura && (
        <div className="mb-2">
          <h3 className="font-semibold text-sm">Assinatura</h3>
          <img src={paciente.assinatura} alt="Assinatura" className="w-48 h-auto" />
        </div>
      )}
    </div>
  );
}

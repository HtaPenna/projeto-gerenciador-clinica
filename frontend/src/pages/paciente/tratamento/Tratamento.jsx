import React, { useState, useEffect } from "react";

const API_TRATAMENTOS = "http://localhost:3001/tratamentos";
const API_PROCEDIMENTOS = "http://localhost:3001/procedimentos";

export default function Tratamentos({ pacienteId }) {
  const [tratamentos, setTratamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [novoTratamento, setNovoTratamento] = useState("");
  const [tratamentoEditando, setTratamentoEditando] = useState(null);
  const [novoProcedimento, setNovoProcedimento] = useState({});
  const [procedimentoEditando, setProcedimentoEditando] = useState({});

  const carregarTratamentos = async () => {
    try {
      setLoading(true);
      const resTrat = await fetch(`${API_TRATAMENTOS}/${pacienteId}`);
      const tratamentosData = await resTrat.json();

      const tratamentosComProcedimentos = await Promise.all(
        tratamentosData.map(async (trat) => {
          try {
            const resProc = await fetch(`${API_PROCEDIMENTOS}/tratamento/${trat.id}`);
            const procedimentos = await (resProc.ok ? resProc.json() : []);
            return { ...trat, procedimentos };
          } catch {
            return { ...trat, procedimentos: [] };
          }
        })
      );

      setTratamentos(tratamentosComProcedimentos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTratamentos();
  }, [pacienteId]);

  // === Tratamento ===
  const handleAdicionarTratamento = async (e) => {
    e.preventDefault();
    if (!novoTratamento) return;
    try {
      await fetch(API_TRATAMENTOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pacienteId, nome: novoTratamento }),
      });
      setNovoTratamento("");
      carregarTratamentos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAtualizarTratamento = async (tratamento) => {
    if (!tratamentoEditando?.nome) return;
    try {
      await fetch(`${API_TRATAMENTOS}/${tratamento.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: tratamentoEditando.nome }),
      });
      setTratamentoEditando(null);
      carregarTratamentos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletarTratamento = async (id) => {
    if (!window.confirm("Deseja realmente excluir este tratamento?")) return;
    try {
      await fetch(`${API_TRATAMENTOS}/${id}`, { method: "DELETE" });
      carregarTratamentos();
    } catch (err) {
      console.error(err);
    }
  };

  // === Procedimento ===
  const handleAdicionarProcedimento = async (tratamentoId) => {
    const dados = novoProcedimento[tratamentoId];
    if (!dados?.nome) return alert("Preencha o nome do procedimento!");

    try {
      await fetch(API_PROCEDIMENTOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dados, tratamentoId }),
      });

      // limpar campo
      setNovoProcedimento((prev) => ({ ...prev, [tratamentoId]: null }));
      carregarTratamentos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAtualizarProcedimento = async (proc) => {
    const dados = procedimentoEditando[proc.id];
    if (!dados?.nome) return;
    try {
      await fetch(`${API_PROCEDIMENTOS}/${proc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      setProcedimentoEditando((prev) => ({ ...prev, [proc.id]: null }));
      carregarTratamentos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletarProcedimento = async (id) => {
    if (!window.confirm("Deseja realmente excluir este procedimento?")) return;
    try {
      await fetch(`${API_PROCEDIMENTOS}/${id}`, { method: "DELETE" });
      carregarTratamentos();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Carregando tratamentos...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Histórico de Tratamentos</h2>

      {!tratamentoEditando && (
        <form onSubmit={handleAdicionarTratamento} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Novo tratamento"
            value={novoTratamento}
            onChange={(e) => setNovoTratamento(e.target.value)}
            className="border p-1 rounded flex-1"
          />
          <button type="submit" className="bg-green-600 text-white px-3 rounded">
            Adicionar
          </button>
        </form>
      )}

      <div className="space-y-4">
        {tratamentos.map((trat) => {
          const valorTotal =
            trat.procedimentos?.reduce(
              (sum, p) => sum + parseFloat(p.valor || 0),
              0
            ) || 0;

          return (
            <div key={trat.id} className="p-4 bg-white shadow rounded">
              {/* Nome do tratamento */}
              <div className="flex justify-between items-center mb-2">
                {tratamentoEditando?.id === trat.id ? (
                  <>
                    <input
                      type="text"
                      value={tratamentoEditando.nome}
                      onChange={(e) =>
                        setTratamentoEditando({
                          ...tratamentoEditando,
                          nome: e.target.value,
                        })
                      }
                      className="border p-1 rounded flex-1"
                    />
                    <button
                      onClick={() => handleAtualizarTratamento(trat)}
                      className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Salvar
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold">{trat.nome}</h3>
                    <div>
                      <button
                        onClick={() => setTratamentoEditando(trat)}
                        className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletarTratamento(trat.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded"
                      >
                        Excluir
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Procedimentos */}
              <div className="ml-4 space-y-2">
                {trat.procedimentos?.map((proc) => (
                  <div key={proc.id} className="p-2 bg-gray-50 rounded space-y-1">
                    {procedimentoEditando[proc.id] ? (
                      <>
                        <input
                          type="text"
                          value={procedimentoEditando[proc.id].nome}
                          onChange={(e) =>
                            setProcedimentoEditando((prev) => ({
                              ...prev,
                              [proc.id]: {
                                ...prev[proc.id],
                                nome: e.target.value,
                              },
                            }))
                          }
                          placeholder="Nome"
                          className="border p-1 rounded w-full"
                        />
                        <textarea
                          value={procedimentoEditando[proc.id].descricao}
                          onChange={(e) =>
                            setProcedimentoEditando((prev) => ({
                              ...prev,
                              [proc.id]: {
                                ...prev[proc.id],
                                descricao: e.target.value,
                              },
                            }))
                          }
                          placeholder="Descrição"
                          className="border p-1 rounded w-full"
                        />
                        <textarea
                          value={procedimentoEditando[proc.id].observacoes}
                          onChange={(e) =>
                            setProcedimentoEditando((prev) => ({
                              ...prev,
                              [proc.id]: {
                                ...prev[proc.id],
                                observacoes: e.target.value,
                              },
                            }))
                          }
                          placeholder="Observações"
                          className="border p-1 rounded w-full"
                        />
                        <input
                          type="number"
                          value={procedimentoEditando[proc.id].valor}
                          onChange={(e) =>
                            setProcedimentoEditando((prev) => ({
                              ...prev,
                              [proc.id]: {
                                ...prev[proc.id],
                                valor: e.target.value,
                              },
                            }))
                          }
                          placeholder="Valor"
                          className="border p-1 rounded w-full"
                        />

                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleAtualizarProcedimento(proc)}
                            className="px-2 py-1 bg-blue-600 text-white rounded"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() =>
                              setProcedimentoEditando((prev) => ({
                                ...prev,
                                [proc.id]: null,
                              }))
                            }
                            className="px-2 py-1 bg-gray-400 text-white rounded"
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Procedimento:</strong> {proc.nome}
                        </p>
                        <p>
                          <strong>Descrição:</strong> {proc.descricao || "-"}
                        </p>
                        <p>
                          <strong>Observações:</strong> {proc.observacoes || "-"}
                        </p>
                        <p>
                          <strong>Valor:</strong> R${" "}
                          {parseFloat(proc.valor || 0).toFixed(2)}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {proc.status === "concluído"
                            ? "Concluído"
                            : "Pendente"}
                        </p>

                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() =>
                              setProcedimentoEditando((prev) => ({
                                ...prev,
                                [proc.id]: proc,
                              }))
                            }
                            className="px-2 py-1 bg-yellow-400 text-white rounded text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeletarProcedimento(proc.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                          >
                            Excluir
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* 🔧 Formulário inline de novo procedimento */}
                {novoProcedimento[trat.id] ? (
                  <div className="mt-2 bg-gray-100 p-2 rounded space-y-2">
                    <input
                      type="text"
                      placeholder="Nome do procedimento"
                      value={novoProcedimento[trat.id].nome}
                      onChange={(e) =>
                        setNovoProcedimento((prev) => ({
                          ...prev,
                          [trat.id]: {
                            ...prev[trat.id],
                            nome: e.target.value,
                          },
                        }))
                      }
                      className="border p-1 rounded w-full"
                    />
                    <textarea
                      placeholder="Descrição"
                      value={novoProcedimento[trat.id].descricao}
                      onChange={(e) =>
                        setNovoProcedimento((prev) => ({
                          ...prev,
                          [trat.id]: {
                            ...prev[trat.id],
                            descricao: e.target.value,
                          },
                        }))
                      }
                      className="border p-1 rounded w-full"
                    />
                    <textarea
                      placeholder="Observações"
                      value={novoProcedimento[trat.id].observacoes}
                      onChange={(e) =>
                        setNovoProcedimento((prev) => ({
                          ...prev,
                          [trat.id]: {
                            ...prev[trat.id],
                            observacoes: e.target.value,
                          },
                        }))
                      }
                      className="border p-1 rounded w-full"
                    />
                    <input
                      type="number"
                      placeholder="Valor"
                      value={novoProcedimento[trat.id].valor}
                      onChange={(e) =>
                        setNovoProcedimento((prev) => ({
                          ...prev,
                          [trat.id]: {
                            ...prev[trat.id],
                            valor: e.target.value,
                          },
                        }))
                      }
                      className="border p-1 rounded w-full"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAdicionarProcedimento(trat.id)}
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() =>
                          setNovoProcedimento((prev) => ({
                            ...prev,
                            [trat.id]: null,
                          }))
                        }
                        className="px-2 py-1 bg-gray-400 text-white rounded text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setNovoProcedimento((prev) => ({
                        ...prev,
                        [trat.id]: {
                          nome: "",
                          descricao: "",
                          observacoes: "",
                          valor: 0,
                          status: "pendente",
                        },
                      }))
                    }
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm mt-2"
                  >
                    Adicionar Procedimento
                  </button>
                )}
              </div>

              <p className="mt-2 font-semibold">
                Valor total: R$ {valorTotal.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';

export default function AgendamentoForm({
    modoVisualizacao,
    pacienteInput,
    onPacienteInputChange,
    pacientes,
    showDropdown,
    onSelectPaciente,
    pacienteSelecionado,
    tratamentos,
    tratamentoSelecionado,
    onTratamentoChange,
    procedimentoSelecionado,
    onProcedimentoChange,
    inicio,
    onInicioChange,
    fim,
    onFimChange,
    status,
    onStatusChange,
    valorPrevisto,
    onValorPrevistoChange,
    observacoes,
    onObservacoesChange,
    onSubmit,
    onClose,
    onEdit,
    onDelete,
    dataSelecionada
}) {
    return (
        <div className="card">
            <div className="card-body">
                <form onSubmit={onSubmit}>
                    {/* Paciente */}
                    <div className="mb-3 position-relative">
                        <label className="form-label fw-semibold">Paciente</label>
                        <input
                            type="text"
                            className={`form-control ${modoVisualizacao ? 'bg-light' : ''}`}
                            placeholder="Digite o nome do paciente"
                            value={pacienteInput}
                            onChange={(e) => {
                                onPacienteInputChange(e.target.value);
                                if (!modoVisualizacao) onSelectPaciente(null); // Reset para mostrar dropdown
                            }}
                            onFocus={() => pacienteInput && onSelectPaciente(null)} // Mostrar dropdown
                            disabled={modoVisualizacao}
                        />
                        {showDropdown && pacientes.length > 0 && !modoVisualizacao && (
                            <div className="position-absolute w-100 bg-white border mt-1 max-h-40 overflow-auto rounded shadow z-3">
                                {pacientes.map((p) => (
                                    <div
                                        key={p.id}
                                        className="p-2 hover-bg-light cursor-pointer"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            onSelectPaciente(p);
                                        }}
                                    >
                                        {p.nome}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tratamento */}
                    {pacienteSelecionado && tratamentos.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Tratamento</label>
                            <select
                                className={`form-select ${modoVisualizacao ? 'bg-light' : ''}`}
                                value={tratamentoSelecionado?.id || ""}
                                onChange={(e) => {
                                    const sel = tratamentos.find((t) => t.id === parseInt(e.target.value));
                                    onTratamentoChange(sel || null);
                                }}
                                disabled={modoVisualizacao}
                            >
                                <option value="">Selecione um tratamento</option>
                                {tratamentos.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Procedimento */}
                    {tratamentoSelecionado && tratamentoSelecionado.procedimentos?.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Procedimento</label>
                            <select
                                className={`form-select ${modoVisualizacao ? 'bg-light' : ''}`}
                                value={procedimentoSelecionado?.id || ""}
                                onChange={(e) => {
                                    const sel = tratamentoSelecionado.procedimentos.find(
                                        (p) => p.id === parseInt(e.target.value)
                                    );
                                    onProcedimentoChange(sel || null);
                                }}
                                disabled={modoVisualizacao}
                            >
                                <option value="">Selecione um procedimento</option>
                                {tratamentoSelecionado.procedimentos.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Início e Fim */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Início</label>
                            <input
                                type="datetime-local"
                                className={`form-control ${modoVisualizacao ? 'bg-light' : ''}`}
                                value={inicio}
                                onChange={(e) => onInicioChange(e.target.value)}
                                disabled={modoVisualizacao}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Fim</label>
                            <input
                                type="datetime-local"
                                className={`form-control ${modoVisualizacao ? 'bg-light' : ''}`}
                                value={fim}
                                onChange={(e) => onFimChange(e.target.value)}
                                disabled={modoVisualizacao}
                            />
                        </div>
                    </div>

                    {/* Status e Valor */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Status</label>
                            <select
                                className={`form-select ${modoVisualizacao ? 'bg-light' : ''}`}
                                value={status}
                                onChange={(e) => onStatusChange(e.target.value)}
                                disabled={modoVisualizacao}
                            >
                                <option value="agendada">Agendada</option>
                                <option value="confirmada">Confirmada</option>
                                <option value="concluída">Concluída</option>
                                <option value="indisponível">Indisponível</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Valor Previsto</label>
                            <input
                                type="number"
                                step="0.01"
                                className={`form-control ${modoVisualizacao ? 'bg-light' : ''}`}
                                value={valorPrevisto}
                                onChange={(e) => onValorPrevistoChange(e.target.value)}
                                disabled={modoVisualizacao}
                            />
                        </div>
                    </div>

                    {/* Observações */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Observações</label>
                        <textarea
                            className={`form-control ${modoVisualizacao ? 'bg-light' : ''}`}
                            rows="3"
                            value={observacoes}
                            onChange={(e) => onObservacoesChange(e.target.value)}
                            disabled={modoVisualizacao}
                        />
                    </div>

                    {/* Botões */}
                    <div className="d-flex gap-2 justify-content-end mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        {modoVisualizacao ? (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={onEdit}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={onDelete}
                                >
                                    Excluir
                                </button>
                            </>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-success"
                            >
                                {dataSelecionada?.id ? "Atualizar" : "Salvar"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
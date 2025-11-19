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
    procedimentos,
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
    dataSelecionada,
    config
}) {
    return (
        <div className="card">
            <div className="card-body">
                {config && (
                    <div className="alert alert-info small mb-3">
                        Expediente: {config.slotMinTime.slice(0, 5)} às {config.slotMaxTime.slice(0, 5)}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <div className="mb-3 position-relative">
                        <label className="form-label fw-semibold">Paciente</label>
                        <input
                            type="text"
                            className={`form-control ${modoVisualizacao ? 'bg-light' : ''}`}
                            placeholder="Digite o nome do paciente"
                            value={pacienteInput}
                            onChange={(e) => onPacienteInputChange(e.target.value)}
                            disabled={modoVisualizacao}
                        />
                        {showDropdown && pacientes.length > 0 && !modoVisualizacao && (
                            <div className="position-absolute w-100 bg-white border mt-1" style={{ maxHeight: '200px', overflow: 'auto', zIndex: 1050 }}>
                                {pacientes.map((p) => (
                                    <div
                                        key={p.id}
                                        className="p-2 border-bottom cursor-pointer"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => onSelectPaciente(p)}
                                    >
                                        {p.nome}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {pacienteSelecionado && (
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Tratamento</label>
                            {modoVisualizacao ? (
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    value={tratamentoSelecionado?.nome || tratamentoSelecionado?.descricao || "Nenhum tratamento selecionado"}
                                    disabled
                                />
                            ) : (
                                <select
                                    className="form-select"
                                    value={tratamentoSelecionado?.id || ""}
                                    onChange={(e) => {
                                        const sel = tratamentos.find((t) => t.id === parseInt(e.target.value));
                                        onTratamentoChange(sel || null);
                                    }}
                                >
                                    <option value="">Selecione um tratamento</option>
                                    {tratamentos.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.descricao || t.nome}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {tratamentoSelecionado && (
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Procedimento</label>
                            {modoVisualizacao ? (
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    value={procedimentoSelecionado?.nome || procedimentoSelecionado?.descricao || "Nenhum procedimento selecionado"}
                                    disabled
                                />
                            ) : (
                                <select
                                    className="form-select"
                                    value={procedimentoSelecionado?.id || ""}
                                    onChange={(e) => {
                                        const sel = procedimentos.find((p) => p.id === parseInt(e.target.value));
                                        onProcedimentoChange(sel || null);
                                    }}
                                >
                                    <option value="">Selecione um procedimento</option>
                                    {procedimentos.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.descricao || p.nome}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

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

                    <div className="d-flex gap-2 justify-content-end mt-4">
                        {modoVisualizacao ? (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >
                                    Fechar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onEdit(e);
                                    }}
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
                            <>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                >
                                    {dataSelecionada?.id ? "Atualizar" : "Salvar"}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
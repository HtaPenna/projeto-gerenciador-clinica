import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../hooks/useToast';

const API_URL = "http://localhost:3001";

export default function GerenciamentoContaModal({ isOpen, onClose }) {
    const [abaAtiva, setAbaAtiva] = useState('dadosPessoais');
    const [loading, setLoading] = useState(false);
    const { getUser, getAuthHeaders } = useAuth();
    const { addToast } = useToast();

    // Estados para os formulários
    const [dadosPessoais, setDadosPessoais] = useState({
        nome: '',
        email: '',
        telefone: ''
    });

    const [seguranca, setSeguranca] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    });

    const [dadosClinica, setDadosClinica] = useState({
        cro: '',
        enderecoConsultorio: '',
        telefoneConsultorio: ''
    });

    useEffect(() => {
        if (isOpen) {
            carregarDadosUsuario();
        }
    }, [isOpen]);

    const carregarDadosUsuario = async () => {
        try {
            const user = getUser();
            if (user) {
                const res = await fetch(`${API_URL}/dentistas/me`, {
                    headers: getAuthHeaders()
                });

                if (res.ok) {
                    const dentista = await res.json();

                    setDadosPessoais({
                        nome: dentista.nome || '',
                        email: user.email || '',
                        telefone: dentista.telefoneConsultorio || ''  
                    });

                    setDadosClinica({
                        cro: dentista.cro || '',
                        enderecoConsultorio: dentista.enderecoConsultorio || '',
                        telefoneConsultorio: dentista.telefoneConsultorio || ''
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };
    
    const salvarDadosPessoais = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/dentistas/dados-pessoais`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    nome: dadosPessoais.nome,
                    telefoneConsultorio: dadosPessoais.telefone
                })
            });

            if (!response.ok) throw new Error('Erro ao atualizar dados');

            addToast('Dados pessoais atualizados com sucesso!', 'success');
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const salvarDadosClinica = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/dentistas/dados-clinica`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    cro: dadosClinica.cro,
                    enderecoConsultorio: dadosClinica.enderecoConsultorio
                })
            });

            if (!response.ok) throw new Error('Erro ao atualizar dados da clínica');

            addToast('Dados da clínica atualizados com sucesso!', 'success');
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const alterarSenha = async () => {
        try {
            setLoading(true);

            if (seguranca.novaSenha !== seguranca.confirmarSenha) {
                addToast('As senhas não coincidem', 'error');
                return;
            }

            const response = await fetch(`${API_URL}/dentistas/alterar-senha`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    senhaAtual: seguranca.senhaAtual,
                    novaSenha: seguranca.novaSenha
                })
            });

            if (!response.ok) throw new Error('Erro ao alterar senha');

            addToast('Senha alterada com sucesso!', 'success');
            setSeguranca({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFechar = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleFechar}>
            <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Gerenciar Conta</h5>
                        <button type="button" className="btn-close" onClick={handleFechar}></button>
                    </div>

                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        {/* Abas de Navegação */}
                        <ul className="nav nav-tabs mb-4">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${abaAtiva === 'dadosPessoais' ? 'active' : ''}`}
                                    onClick={() => setAbaAtiva('dadosPessoais')}
                                >
                                    Dados Pessoais
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${abaAtiva === 'seguranca' ? 'active' : ''}`}
                                    onClick={() => setAbaAtiva('seguranca')}
                                >
                                    Segurança
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${abaAtiva === 'clinica' ? 'active' : ''}`}
                                    onClick={() => setAbaAtiva('clinica')}
                                >
                                    Clínica
                                </button>
                            </li>
                        </ul>

                        {/* Conteúdo das Abas */}
                        <div className="tab-content">
                            {/* Aba Dados Pessoais */}
                            {abaAtiva === 'dadosPessoais' && (
                                <div className="tab-pane fade show active">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Nome Completo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dadosPessoais.nome}
                                                onChange={(e) => setDadosPessoais({ ...dadosPessoais, nome: e.target.value })}
                                                placeholder="Seu nome completo"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={dadosPessoais.email}
                                                onChange={(e) => setDadosPessoais({ ...dadosPessoais, email: e.target.value })}
                                                placeholder="seu@email.com"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Telefone</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                value={dadosPessoais.telefone}
                                                onChange={(e) => setDadosPessoais({ ...dadosPessoais, telefone: e.target.value })}
                                                placeholder="(11) 99999-9999"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button
                                                className="btn btn-primary"
                                                onClick={salvarDadosPessoais}
                                                disabled={loading}
                                            >
                                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Aba Segurança */}
                            {abaAtiva === 'seguranca' && (
                                <div className="tab-pane fade show active">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Senha Atual</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={seguranca.senhaAtual}
                                                onChange={(e) => setSeguranca({ ...seguranca, senhaAtual: e.target.value })}
                                                placeholder="Digite sua senha atual"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Nova Senha</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={seguranca.novaSenha}
                                                onChange={(e) => setSeguranca({ ...seguranca, novaSenha: e.target.value })}
                                                placeholder="Digite a nova senha"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Confirmar Nova Senha</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={seguranca.confirmarSenha}
                                                onChange={(e) => setSeguranca({ ...seguranca, confirmarSenha: e.target.value })}
                                                placeholder="Confirme a nova senha"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button
                                                className="btn btn-primary"
                                                onClick={alterarSenha}
                                                disabled={loading}
                                            >
                                                {loading ? 'Alterando...' : 'Alterar Senha'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Aba Clínica */}
                            {abaAtiva === 'clinica' && (
                                <div className="tab-pane fade show active">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">CRO</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dadosClinica.cro}
                                                onChange={(e) => setDadosClinica({ ...dadosClinica, cro: e.target.value })}
                                                placeholder="Número do CRO"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Endereço do Consultório</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dadosClinica.enderecoConsultorio}
                                                onChange={(e) => setDadosClinica({ ...dadosClinica, enderecoConsultorio: e.target.value })}
                                                placeholder="Endereço completo"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Telefone do Consultório</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                value={dadosClinica.telefoneConsultorio}
                                                onChange={(e) => setDadosClinica({ ...dadosClinica, telefoneConsultorio: e.target.value })}
                                                placeholder="(11) 3333-3333"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button
                                                className="btn btn-primary"
                                                onClick={salvarDadosClinica}
                                                disabled={loading}
                                            >
                                                {loading ? 'Salvando...' : 'Salvar Dados'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
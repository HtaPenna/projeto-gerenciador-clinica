import React, { useState, useEffect } from "react";
import { PatternFormat } from 'react-number-format';
import { useToast } from '../../../hooks/useToast';
import 'bootstrap/dist/css/bootstrap.min.css';

const generoOptions = ["Masculino", "Feminino", "Outro"];

export default function PacienteForm({ paciente, onSalvar, onCancelar, hideTitle = false }) {
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: "", cpf: "", email: "", telefoneCelular: "", dataNascimento: "",
    telefoneResidencial: "", telefoneEmergencia: "", cep: "", logradouro: "",
    bairro: "", cidade: "", estado: "", genero: "", peso: "", altura: "",
    tipoSanguineo: "", estadoCivil: "", nomeConjuge: "", profissao: "",
    redesSociais: "", assinatura: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCEP, setLoadingCEP] = useState(false);

  useEffect(() => {
    if (paciente) {
      setFormData({
        nome: paciente.nome || "", cpf: paciente.cpf || "", email: paciente.email || "",
        telefoneCelular: paciente.telefoneCelular || "", 
        dataNascimento: paciente.dataNascimento ? paciente.dataNascimento.split("T")[0] : "",
        telefoneResidencial: paciente.telefoneResidencial || "",
        telefoneEmergencia: paciente.telefoneEmergencia || "", cep: paciente.cep || "",
        logradouro: paciente.logradouro || "", bairro: paciente.bairro || "",
        cidade: paciente.cidade || "", estado: paciente.estado || "", genero: paciente.genero || "",
        peso: paciente.peso || "", altura: paciente.altura || "", tipoSanguineo: paciente.tipoSanguineo || "",
        estadoCivil: paciente.estadoCivil || "", nomeConjuge: paciente.nomeConjuge || "",
        profissao: paciente.profissao || "", redesSociais: paciente.redesSociais || "",
        assinatura: paciente.assinatura || ""
      });
    }
  }, [paciente]);

  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        setLoadingCEP(true);
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || ''
          }));
        }
      } catch (error) {
        addToast("Erro ao buscar CEP", "error");
      } finally {
        setLoadingCEP(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'cep' && value.replace(/\D/g, '').length === 8) {
      buscarCEP(value);
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const cpfLimpo = formData.cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) newErrors.cpf = "CPF deve conter 11 dígitos";

    const cepLimpo = formData.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) newErrors.cep = "CEP deve conter 8 dígitos";

    const telefoneLimpo = formData.telefoneCelular.replace(/\D/g, '');
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      newErrors.telefoneCelular = "Telefone celular inválido";
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = "Email inválido";
    }

    const camposObrigatorios = [
      'nome', 'cpf', 'email', 'telefoneCelular', 'dataNascimento', 
      'cep', 'logradouro', 'bairro', 'cidade', 'estado', 'genero'
    ];

    camposObrigatorios.forEach(campo => {
      if (!formData[campo]) newErrors[campo] = "Este campo é obrigatório";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      addToast("Preencha os campos destacados corretamente", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const dadosLimpos = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefoneCelular: formData.telefoneCelular.replace(/\D/g, ''),
        telefoneResidencial: formData.telefoneResidencial.replace(/\D/g, '') || null,
        telefoneEmergencia: formData.telefoneEmergencia.replace(/\D/g, '') || null,
        cep: formData.cep.replace(/\D/g, ''),
        peso: formData.peso || null, altura: formData.altura || null,
        tipoSanguineo: formData.tipoSanguineo || null, estadoCivil: formData.estadoCivil || null,
        nomeConjuge: formData.nomeConjuge || null, profissao: formData.profissao || null,
        redesSociais: formData.redesSociais || null, assinatura: formData.assinatura || null
      };

      await onSalvar(dadosLimpos);
    } catch (error) {
      addToast("Erro ao salvar paciente", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldClass = (fieldName) => {
    return errors[fieldName] ? "form-control is-invalid" : "form-control";
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          {!hideTitle && <h5 className="card-title border-bottom pb-2 mb-4">Dados do Paciente</h5>}
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="row mb-4">
              <div className="col-12"><h6 className="border-bottom pb-2">Dados Pessoais</h6></div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Nome *</label>
                <input type="text" className={getFieldClass('nome')} name="nome" value={formData.nome} onChange={handleChange} required />
                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">CPF *</label>
                <PatternFormat format="###.###.###-##" mask="_" className={getFieldClass('cpf')} name="cpf" value={formData.cpf}
                  onValueChange={(values) => handleChange({ target: { name: 'cpf', value: values.formattedValue } })} required />
                {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email *</label>
                <input type="email" className={getFieldClass('email')} name="email" value={formData.email} onChange={handleChange} required />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Data Nascimento *</label>
                <input type="date" className={getFieldClass('dataNascimento')} name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required />
                {errors.dataNascimento && <div className="invalid-feedback">{errors.dataNascimento}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Gênero *</label>
                <select className={getFieldClass('genero')} name="genero" value={formData.genero} onChange={handleChange} required>
                  <option value="">-- Selecione --</option>
                  {generoOptions.map((genero) => <option key={genero} value={genero}>{genero}</option>)}
                </select>
                {errors.genero && <div className="invalid-feedback">{errors.genero}</div>}
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-12"><h6 className="border-bottom pb-2">Contato</h6></div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Telefone Celular *</label>
                <PatternFormat format="(##) #####-####" mask="_" className={getFieldClass('telefoneCelular')} name="telefoneCelular" value={formData.telefoneCelular}
                  onValueChange={(values) => handleChange({ target: { name: 'telefoneCelular', value: values.formattedValue } })} required />
                {errors.telefoneCelular && <div className="invalid-feedback">{errors.telefoneCelular}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Telefone Residencial</label>
                <PatternFormat format="(##) ####-####" mask="_" className="form-control" name="telefoneResidencial" value={formData.telefoneResidencial}
                  onValueChange={(values) => handleChange({ target: { name: 'telefoneResidencial', value: values.formattedValue } })} />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Telefone Emergência</label>
                <PatternFormat format="(##) #####-####" mask="_" className="form-control" name="telefoneEmergencia" value={formData.telefoneEmergencia}
                  onValueChange={(values) => handleChange({ target: { name: 'telefoneEmergencia', value: values.formattedValue } })} />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-12"><h6 className="border-bottom pb-2">Endereço</h6></div>
              
              <div className="col-md-3 mb-3">
                <label className="form-label">CEP *</label>
                <div className="input-group">
                  <PatternFormat format="#####-###" mask="_" className={getFieldClass('cep')} name="cep" value={formData.cep}
                    onValueChange={(values) => handleChange({ target: { name: 'cep', value: values.formattedValue } })} required />
                  {loadingCEP && <span className="input-group-text"><div className="spinner-border spinner-border-sm" /></span>}
                </div>
                {errors.cep && <div className="invalid-feedback">{errors.cep}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Logradouro *</label>
                <input type="text" className={getFieldClass('logradouro')} name="logradouro" value={formData.logradouro} onChange={handleChange} required />
                {errors.logradouro && <div className="invalid-feedback">{errors.logradouro}</div>}
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Bairro *</label>
                <input type="text" className={getFieldClass('bairro')} name="bairro" value={formData.bairro} onChange={handleChange} required />
                {errors.bairro && <div className="invalid-feedback">{errors.bairro}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Cidade *</label>
                <input type="text" className={getFieldClass('cidade')} name="cidade" value={formData.cidade} onChange={handleChange} required />
                {errors.cidade && <div className="invalid-feedback">{errors.cidade}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Estado *</label>
                <input type="text" className={getFieldClass('estado')} name="estado" value={formData.estado} onChange={handleChange} required />
                {errors.estado && <div className="invalid-feedback">{errors.estado}</div>}
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-12"><h6 className="border-bottom pb-2">Informações Adicionais</h6></div>
              
              <div className="col-md-3 mb-3"><label className="form-label">Peso (kg)</label><input type="text" className="form-control" name="peso" value={formData.peso} onChange={handleChange} /></div>
              <div className="col-md-3 mb-3"><label className="form-label">Altura (m)</label><input type="text" className="form-control" name="altura" value={formData.altura} onChange={handleChange} /></div>
              <div className="col-md-3 mb-3"><label className="form-label">Tipo Sanguíneo</label><input type="text" className="form-control" name="tipoSanguineo" value={formData.tipoSanguineo} onChange={handleChange} /></div>
              <div className="col-md-3 mb-3"><label className="form-label">Estado Civil</label><input type="text" className="form-control" name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} /></div>
              <div className="col-md-6 mb-3"><label className="form-label">Nome do Cônjuge</label><input type="text" className="form-control" name="nomeConjuge" value={formData.nomeConjuge} onChange={handleChange} /></div>
              <div className="col-md-6 mb-3"><label className="form-label">Profissão</label><input type="text" className="form-control" name="profissao" value={formData.profissao} onChange={handleChange} /></div>
              <div className="col-12 mb-3"><label className="form-label">Redes Sociais</label><input type="text" className="form-control" name="redesSociais" value={formData.redesSociais} onChange={handleChange} /></div>
              <div className="col-12 mb-3"><label className="form-label">Assinatura</label><textarea className="form-control" rows="3" name="assinatura" value={formData.assinatura} onChange={handleChange} /></div>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={isSubmitting}>Cancelar</button>
              <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting ? <><span className="spinner-border spinner-border-sm me-2" />{paciente?.id ? "Atualizando..." : "Cadastrando..."}</> : paciente?.id ? "Atualizar Paciente" : "Cadastrar Paciente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";

export default function SuprimentoForm({ suprimento = null, onSalvar, onCancelar }) {
  const [form, setForm] = useState({
    Codigo_Sup: "",
    Nome_Sup: "",
    Tipo_Sup: "",
    Descricao_Sup: "",
    Quantidade_Sup: "",
    QuantidadeMin_Sup: "",
    id: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (suprimento) {
      setForm({
        Codigo_Sup: suprimento.Codigo_Sup ?? "",
        Nome_Sup: suprimento.Nome_Sup ?? "",
        Tipo_Sup: suprimento.Tipo_Sup ?? "",
        Descricao_Sup: suprimento.Descricao_Sup ?? "",
        Quantidade_Sup: suprimento.Quantidade_Sup ?? "",
        QuantidadeMin_Sup: suprimento.QuantidadeMin_Sup ?? "",
        id: suprimento.id ?? null,
      });
    } else {
      setForm({
        Codigo_Sup: "",
        Nome_Sup: "",
        Tipo_Sup: "",
        Descricao_Sup: "",
        Quantidade_Sup: "",
        QuantidadeMin_Sup: "",
        id: null,
      });
    }
  }, [suprimento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.Codigo_Sup) newErrors.Codigo_Sup = "Código é obrigatório";
    if (!form.Nome_Sup) newErrors.Nome_Sup = "Nome é obrigatório";
    if (!form.Tipo_Sup) newErrors.Tipo_Sup = "Tipo é obrigatório";
    if (!form.Quantidade_Sup) newErrors.Quantidade_Sup = "Quantidade é obrigatória";

    if (form.Codigo_Sup && isNaN(form.Codigo_Sup)) newErrors.Codigo_Sup = "Código deve ser um número";
    if (form.Quantidade_Sup && isNaN(form.Quantidade_Sup)) newErrors.Quantidade_Sup = "Quantidade deve ser um número";
    if (form.QuantidadeMin_Sup && isNaN(form.QuantidadeMin_Sup)) newErrors.QuantidadeMin_Sup = "Quantidade mínima deve ser um número";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        Codigo_Sup: Number(form.Codigo_Sup),
        Nome_Sup: form.Nome_Sup,
        Tipo_Sup: form.Tipo_Sup,
        Descricao_Sup: form.Descricao_Sup,
        Quantidade_Sup: Number(form.Quantidade_Sup),
        QuantidadeMin_Sup: form.QuantidadeMin_Sup ? Number(form.QuantidadeMin_Sup) : null,
      };

      if (form.id) payload.id = form.id;

      await onSalvar(payload);
    } catch (error) {
      console.error("Erro ao salvar suprimento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldClass = (fieldName) => {
    return errors[fieldName] ? "form-control is-invalid" : "form-control";
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <label className="form-label">Código *</label>
                <input
                  type="number"
                  className={getFieldClass('Codigo_Sup')}
                  name="Codigo_Sup"
                  value={form.Codigo_Sup}
                  onChange={handleChange}
                  required
                />
                {errors.Codigo_Sup && <div className="invalid-feedback">{errors.Codigo_Sup}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Nome *</label>
                <input
                  type="text"
                  className={getFieldClass('Nome_Sup')}
                  name="Nome_Sup"
                  value={form.Nome_Sup}
                  onChange={handleChange}
                  required
                />
                {errors.Nome_Sup && <div className="invalid-feedback">{errors.Nome_Sup}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Tipo *</label>
                <input
                  type="text"
                  className={getFieldClass('Tipo_Sup')}
                  name="Tipo_Sup"
                  value={form.Tipo_Sup}
                  onChange={handleChange}
                  required
                />
                {errors.Tipo_Sup && <div className="invalid-feedback">{errors.Tipo_Sup}</div>}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Quantidade *</label>
                <input
                  type="number"
                  className={getFieldClass('Quantidade_Sup')}
                  name="Quantidade_Sup"
                  value={form.Quantidade_Sup}
                  onChange={handleChange}
                  required
                />
                {errors.Quantidade_Sup && <div className="invalid-feedback">{errors.Quantidade_Sup}</div>}
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Descrição</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="Descricao_Sup"
                  value={form.Descricao_Sup}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Quantidade Mínima</label>
                <input
                  type="number"
                  className={getFieldClass('QuantidadeMin_Sup')}
                  name="QuantidadeMin_Sup"
                  value={form.QuantidadeMin_Sup}
                  onChange={handleChange}
                />
                {errors.QuantidadeMin_Sup && <div className="invalid-feedback">{errors.QuantidadeMin_Sup}</div>}
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelar}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    {form.id ? "Atualizando..." : "Salvando..."}
                  </>
                ) : (
                  form.id ? "Atualizar Suprimento" : "Salvar Suprimento"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
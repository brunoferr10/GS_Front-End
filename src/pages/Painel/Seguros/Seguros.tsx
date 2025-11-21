import { useEffect, useState, FormEvent } from "react";

type Seguro = {
  cdApolice?: number;
  dsPlano: string;
  vlCobertura: number | string;
  dsCobertura: string;
  dsSituacao: string;
  cdServico: number | string;
};

type Servico = {
  cdServico: number;
  dsServico: string;
};

const API_SEGURO = "https://five63489.onrender.com/seguro";
const API_SERVICO = "https://five63489.onrender.com/servico";


const PLANOS = [
  "Plano Residencial",
  "Plano Empresarial",
  "Plano Premium",
  "Plano Essencial",
];

const SITUACOES = ["Ativo", "Pendente", "Cancelado"];

export default function Seguros() {
  const [seguros, setSeguros] = useState<Seguro[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [loadingLista, setLoadingLista] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [form, setForm] = useState<Seguro>({
    dsPlano: "",
    vlCobertura: "",
    dsCobertura: "",
    dsSituacao: "",
    cdServico: "",
  });

  
  useEffect(() => {
    carregarSeguros();
    carregarServicos();
  }, []);

  async function carregarServicos() {
    try {
      const res = await fetch(API_SERVICO);
      if (res.ok) setServicos(await res.json());
    } catch {
      console.log("Erro ao carregar serviços.");
    }
  }

  async function carregarSeguros() {
    setLoadingLista(true);
    try {
      const res = await fetch(API_SEGURO);
      if (res.ok) setSeguros(await res.json());
      else setSeguros([]);
    } catch {
      console.log("Erro ao carregar seguros");
    } finally {
      setLoadingLista(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function limparFormulario() {
    setEditandoId(null);
    setForm({
      dsPlano: "",
      vlCobertura: "",
      dsCobertura: "",
      dsSituacao: "",
      cdServico: "",
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const valor = Number(
      typeof form.vlCobertura === "string"
        ? form.vlCobertura.replace(",", ".")
        : form.vlCobertura
    );

    if (isNaN(valor) || valor <= 0) {
      alert("Valor de cobertura inválido.");
      return;
    }

    const payload: Seguro = {
      ...form,
      vlCobertura: valor,
      cdServico: Number(form.cdServico),
    };

    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `${API_SEGURO}/${editandoId}` : API_SEGURO;

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Erro ao salvar seguro.");
        return;
      }

      await carregarSeguros();
      limparFormulario();
      alert(editandoId ? "Seguro atualizado!" : "Seguro cadastrado!");
    } catch {
      alert("Erro de comunicação com o servidor.");
    }
  }

  function iniciarEdicao(s: Seguro) {
    setEditandoId(s.cdApolice ?? null);
    setForm({
      dsPlano: s.dsPlano,
      vlCobertura: String(s.vlCobertura),
      dsCobertura: s.dsCobertura,
      dsSituacao: s.dsSituacao,
      cdServico: s.cdServico,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirSeguro(id?: number) {
    if (!id) return;
    if (!confirm("Deseja realmente excluir este seguro?")) return;

    try {
      const res = await fetch(`${API_SEGURO}/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Seguro excluído!");
        carregarSeguros();
      }
    } catch {
      alert("Erro ao excluir.");
    }
  }

  function nomeServico(id: number | string) {
    const s = servicos.find((x) => x.cdServico === Number(id));
    return s ? s.dsServico : `Serviço ${id}`;
  }

  return (
    <main className="p-8 flex flex-col gap-8">

      {/* TÍTULO + LISTAR */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#ff6600]">Seguros</h1>

        <button
          onClick={() => {
            const novo = !mostrarLista;
            setMostrarLista(novo);
            if (novo) carregarSeguros();
          }}
          className="bg-[#ff6600] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#ff8533] transition"
        >
          {mostrarLista ? "Ocultar Lista" : "Listar Seguros"}
        </button>
      </div>

      {/* FORMULÁRIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#111] border border-gray-300 dark:border-[#222] p-8 rounded-2xl shadow-lg flex flex-col gap-6 max-w-5xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Plano */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Plano</label>
            <select
              name="dsPlano"
              value={form.dsPlano}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
            >
              <option value="">Selecione...</option>
              {PLANOS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Cobertura */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Valor da Cobertura (R$)</label>
            <input
              type="number"
              step="0.01"
              name="vlCobertura"
              value={form.vlCobertura}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
            />
          </div>

          {/* Situação */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Situação</label>
            <select
              name="dsSituacao"
              value={form.dsSituacao}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
            >
              <option value="">Selecione...</option>
              {SITUACOES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Serviço Vinculado */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Serviço</label>
            <select
              name="cdServico"
              value={form.cdServico}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
            >
              <option value="">Selecione...</option>
              {servicos.map((s) => (
                <option key={s.cdServico} value={s.cdServico}>
                  {s.dsServico}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cobertura Descritiva */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Descrição da Cobertura</label>
          <textarea
            name="dsCobertura"
            value={form.dsCobertura}
            onChange={handleChange}
            required
            rows={3}
            className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
          />
        </div>

        {/* BOTÃO SALVAR */}
        <button
          type="submit"
          className={`w-full text-white font-bold py-3 rounded-lg mt-4 transition ${
            editandoId
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {editandoId ? "Salvar Alterações" : "Salvar Seguro"}
        </button>
      </form>

      {/* LISTA */}
      {mostrarLista && (
        <section className="bg-[#111] border border-[#222] rounded-2xl p-6 max-w-6xl">
          {loadingLista ? (
            <p className="text-white text-sm">Carregando seguros...</p>
          ) : seguros.length === 0 ? (
            <p className="text-white text-sm">Nenhum seguro cadastrado.</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#333] text-white">
                  <th className="py-2 px-2 text-left">Apolice</th>
                  <th className="py-2 px-2 text-left">Plano</th>
                  <th className="py-2 px-2 text-left">Cobertura (R$)</th>
                  <th className="py-2 px-2 text-left">Situação</th>
                  <th className="py-2 px-2 text-left">Serviço</th>
                  <th className="py-2 px-2 text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {seguros.map((s) => (
                  <tr
                    key={s.cdApolice}
                    className="border-b border-[#222] hover:bg-[#1a1a1a] transition"
                  >
                    <td className="py-2 px-2 text-white">{s.cdApolice}</td>
                    <td className="py-2 px-2 text-white">{s.dsPlano}</td>
                    <td className="py-2 px-2 text-white">
                      R$ {Number(s.vlCobertura).toFixed(2).replace(".", ",")}
                    </td>
                    <td className="py-2 px-2 text-white">{s.dsSituacao}</td>
                    <td className="py-2 px-2 text-white">{nomeServico(s.cdServico)}</td>

                    <td className="py-2 px-2 text-center space-x-2">
                      <button
                        onClick={() => iniciarEdicao(s)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => excluirSeguro(s.cdApolice)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </main>
  );
}

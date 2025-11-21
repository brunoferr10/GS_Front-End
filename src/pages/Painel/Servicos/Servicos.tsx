import { useEffect, useState } from "react";

type Servico = {
  cdServico?: number;
  dsServico: string;
  dsComentario: string;
  dsGrauDificuldade: string;
  dsSegmento: string;
  cdCliente: number | "";
  cdContratado: number | "";
  cdPagamento: number | "";
  cdFeedback: number | "";
  dtPrevisao: string;
  dtConclusao: string;
};

type Cliente = {
  cdCliente: number;
  dsNome: string;
};

type Contratado = {
  cdContratado: number;
  dsNome: string;
  dsEspecialidade?: string;
};

type Pagamento = {
  cdPagamento: number;
  dsFormaPag: string;
  vlServico1?: number;
};

type Feedback = {
  cdFeedback: number;
  dsFeedback: string;
};

const API = "https://five63489.onrender.com";

const GRAUS_DIFICULDADE = ["Baixa", "Média", "Alta"];

const SEGMENTOS = [
  "Reforma Residencial",
  "Elétrica",
  "Hidráulica",
  "Piso e Azulejo",
  "Pintura",
  "Acabamento",
  "Manutenção Predial",
];

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contratados, setContratados] = useState<Contratado[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const [form, setForm] = useState<Servico>({
    dsServico: "",
    dsComentario: "",
    dsGrauDificuldade: "",
    dsSegmento: "",
    cdCliente: "",
    cdContratado: "",
    cdPagamento: "",
    cdFeedback: "",
    dtPrevisao: "",
    dtConclusao: "",
  });

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [loadingLista, setLoadingLista] = useState(false);

  const [carregandoClientes, setCarregandoClientes] = useState(false);
  const [carregandoContratados, setCarregandoContratados] = useState(false);
  const [carregandoPagamentos, setCarregandoPagamentos] = useState(false);
  const [carregandoFeedbacks, setCarregandoFeedbacks] = useState(false);

  const loadServicos = async () => {
    setLoadingLista(true);
    try {
      const res = await fetch(`${API}/servico`);
      if (!res.ok) {
        if (res.status === 404) {
          setServicos([]);
          return;
        }
        throw new Error();
      }
      setServicos(await res.json());
    } catch {
      alert("Erro ao listar serviços.");
    } finally {
      setLoadingLista(false);
    }
  };

  const loadClientes = async () => {
    if (clientes.length || carregandoClientes) return;
    setCarregandoClientes(true);
    try {
      const res = await fetch(`${API}/cliente`);
      if (res.ok) setClientes(await res.json());
    } catch {
      console.warn("Erro ao carregar clientes");
    } finally {
      setCarregandoClientes(false);
    }
  };

  const loadContratados = async () => {
    if (contratados.length || carregandoContratados) return;
    setCarregandoContratados(true);
    try {
      const res = await fetch(`${API}/contratado`);
      if (res.ok) setContratados(await res.json());
    } catch {
      console.warn("Erro ao carregar contratados");
    } finally {
      setCarregandoContratados(false);
    }
  };

  const loadPagamentos = async () => {
    if (pagamentos.length || carregandoPagamentos) return;
    setCarregandoPagamentos(true);
    try {
      const res = await fetch(`${API}/pagamento`);
      if (res.ok) setPagamentos(await res.json());
    } catch {
      console.warn("Erro ao carregar pagamentos");
    } finally {
      setCarregandoPagamentos(false);
    }
  };

  const loadFeedbacks = async () => {
    if (feedbacks.length || carregandoFeedbacks) return;
    setCarregandoFeedbacks(true);
    try {
      const res = await fetch(`${API}/feedback`);
      if (res.ok) setFeedbacks(await res.json());
    } catch {
      console.warn("Erro ao carregar feedbacks");
    } finally {
      setCarregandoFeedbacks(false);
    }
  };

  useEffect(() => {
  
    loadClientes();
    loadContratados();
    loadPagamentos();
    loadFeedbacks();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function limparFormulario() {
    setForm({
      dsServico: "",
      dsComentario: "",
      dsGrauDificuldade: "",
      dsSegmento: "",
      cdCliente: "",
      cdContratado: "",
      cdPagamento: "",
      cdFeedback: "",
      dtPrevisao: "",
      dtConclusao: "",
    });
    setEditandoId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.dtPrevisao || !form.dtConclusao) {
      alert("Informe a data de previsão e de conclusão.");
      return;
    }

    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `${API}/servico/${editandoId}` : `${API}/servico`;

    const payload: Servico = {
      ...form,
      cdCliente: form.cdCliente ? Number(form.cdCliente) : 0,
      cdContratado: form.cdContratado ? Number(form.cdContratado) : 0,
      cdPagamento: form.cdPagamento ? Number(form.cdPagamento) : 0,
      cdFeedback: form.cdFeedback ? Number(form.cdFeedback) : 0,
    };

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Erro ao salvar serviço. Verifique os dados.");
        return;
      }

      alert(editandoId ? "Serviço atualizado com sucesso!" : "Serviço cadastrado com sucesso!");
      limparFormulario();
      if (mostrarLista) loadServicos();
    } catch {
      alert("Erro de comunicação com o servidor.");
    }
  }

  function handleEdit(s: Servico) {
    setForm({
      dsServico: s.dsServico,
      dsComentario: s.dsComentario,
      dsGrauDificuldade: s.dsGrauDificuldade,
      dsSegmento: s.dsSegmento,
      cdCliente: s.cdCliente ?? "",
      cdContratado: s.cdContratado ?? "",
      cdPagamento: s.cdPagamento ?? "",
      cdFeedback: s.cdFeedback ?? "",
      dtPrevisao: s.dtPrevisao,
      dtConclusao: s.dtConclusao,
      cdServico: s.cdServico,
    });
    setEditandoId(s.cdServico ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const res = await fetch(`${API}/servico/${id}`, { method: "DELETE" });
      if (res.status === 204) {
        alert("Serviço excluído com sucesso!");
        loadServicos();
      } else {
        alert("Erro ao excluir serviço.");
      }
    } catch {
      alert("Erro de comunicação com o servidor.");
    }
  }

  const nomeCliente = (id: number | "") => {
    const c = clientes.find((x) => x.cdCliente === Number(id));
    return c ? c.dsNome : id ? `Cliente ${id}` : "-";
  };

  const nomeContratado = (id: number | "") => {
    const c = contratados.find((x) => x.cdContratado === Number(id));
    if (!c) return id ? `Contratado ${id}` : "-";
    return c.dsEspecialidade
      ? `${c.dsNome} (${c.dsEspecialidade})`
      : c.dsNome;
  };

  const nomePagamento = (id: number | "") => {
    const p = pagamentos.find((x) => x.cdPagamento === Number(id));
    if (!p) return id ? `Pagamento ${id}` : "-";
    const valor =
      typeof p.vlServico1 === "number"
        ? ` - R$ ${p.vlServico1.toFixed(2).replace(".", ",")}`
        : "";
    return `${p.dsFormaPag}${valor}`;
  };

  const nomeFeedback = (id: number | "") => {
    const f = feedbacks.find((x) => x.cdFeedback === Number(id));
    return f ? f.dsFeedback : id ? `Feedback ${id}` : "-";
  };

  return (
    <main className="p-8 flex flex-col gap-8">
      {/* Título + botão listar */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#ff6600]">Serviços</h1>

        <button
          onClick={() => {
            const novo = !mostrarLista;
            setMostrarLista(novo);
            if (novo) loadServicos();
          }}
          className="bg-[#ff6600] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#ff8533] transition"
        >
          {mostrarLista ? "Ocultar Lista" : "Listar Serviços"}
        </button>
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] border border-[#222] rounded-2xl p-8 shadow flex flex-col gap-6 max-w-6xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Descrição do serviço */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold mb-1 block">
              Descrição do serviço
            </label>
            <input
              type="text"
              name="dsServico"
              value={form.dsServico}
              onChange={handleChange}
              required
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm"
              placeholder="Ex: Reforma do banheiro, troca de piso..."
            />
          </div>

          {/* Grau de dificuldade */}
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Grau de dificuldade
            </label>
            <select
              name="dsGrauDificuldade"
              value={form.dsGrauDificuldade}
              onChange={handleChange}
              required
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              {GRAUS_DIFICULDADE.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Segmento */}
          <div>
            <label className="text-sm font-semibold mb-1 block">Segmento</label>
            <select
              name="dsSegmento"
              value={form.dsSegmento}
              onChange={handleChange}
              required
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              {SEGMENTOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Cliente */}
          <div>
            <label className="text-sm font-semibold mb-1 block">Cliente</label>
            <select
              name="cdCliente"
              value={form.cdCliente}
              onChange={handleChange}
              onClick={loadClientes}
              required
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm"
            >
              {carregandoClientes ? (
                <option value="">Carregando clientes...</option>
              ) : (
                <>
                  <option value="">Selecione o cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.cdCliente} value={c.cdCliente}>
                      {c.dsNome}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Contratado */}
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Profissional / Empresa
            </label>
            <select
              name="cdContratado"
              value={form.cdContratado}
              onChange={handleChange}
              onClick={loadContratados}
              required
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm"
            >
              {carregandoContratados ? (
                <option value="">Carregando contratados...</option>
              ) : (
                <>
                  <option value="">Selecione o contratado...</option>
                  {contratados.map((c) => (
                    <option key={c.cdContratado} value={c.cdContratado}>
                      {c.dsNome}
                      {c.dsEspecialidade ? ` - ${c.dsEspecialidade}` : ""}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Pagamento */}
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Forma de pagamento
            </label>
            <select
              name="cdPagamento"
              value={form.cdPagamento}
              onChange={handleChange}
              onClick={loadPagamentos}
              required
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm"
            >
              {carregandoPagamentos ? (
                <option value="">Carregando pagamentos...</option>
              ) : (
                <>
                  <option value="">Selecione o pagamento...</option>
                  {pagamentos.map((p) => (
                    <option key={p.cdPagamento} value={p.cdPagamento}>
                      {nomePagamento(p.cdPagamento)}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Feedback */}
          <div>
            <label className="text-sm font-semibold mb-1 block">Feedback</label>
            <select
              name="cdFeedback"
              value={form.cdFeedback}
              onChange={handleChange}
              onClick={loadFeedbacks}
              required
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm"
            >
              {carregandoFeedbacks ? (
                <option value="">Carregando feedbacks...</option>
              ) : (
                <>
                  <option value="">Selecione o feedback...</option>
                  {feedbacks.map((f) => (
                    <option key={f.cdFeedback} value={f.cdFeedback}>
                      {f.dsFeedback}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Datas */}
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Data de previsão
            </label>
            <input
              type="date"
              name="dtPrevisao"
              value={form.dtPrevisao}
              onChange={handleChange}
              required
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-1 block">
              Data de conclusão
            </label>
            <input
              type="date"
              name="dtConclusao"
              value={form.dtConclusao}
              onChange={handleChange}
              required
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Comentário */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-sm font-semibold mb-1 block">
              Comentário / Observações
            </label>
            <textarea
              name="dsComentario"
              value={form.dsComentario}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-sm resize-y"
              placeholder="Detalhes do serviço, combinações com o cliente, observações importantes..."
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <button
            type="submit"
            className={`flex-1 text-white font-semibold py-3 rounded-lg transition ${
              editandoId
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {editandoId ? "Atualizar Serviço" : "Salvar Serviço"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={limparFormulario}
              className="px-6 py-3 rounded-lg border border-[#444] text-sm font-semibold hover:bg-[#222]"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de serviços */}
      {mostrarLista && (
        <section className="bg-[#111] border border-[#222] rounded-2xl p-6 max-w-6xl">
          {loadingLista ? (
            <p>Carregando serviços...</p>
          ) : servicos.length === 0 ? (
            <p>Nenhum serviço cadastrado.</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="py-2 px-2 text-left">ID</th>
                  <th className="py-2 px-2 text-left">Serviço</th>
                  <th className="py-2 px-2 text-left">Cliente</th>
                  <th className="py-2 px-2 text-left">Contratado</th>
                  <th className="py-2 px-2 text-left">Segmento</th>
                  <th className="py-2 px-2 text-left">Dificuldade</th>
                  <th className="py-2 px-2 text-left">Previsão</th>
                  <th className="py-2 px-2 text-left">Conclusão</th>
                  <th className="py-2 px-2 text-left">Pagamento</th>
                  <th className="py-2 px-2 text-left">Feedback</th>
                  <th className="py-2 px-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((s) => (
                  <tr key={s.cdServico} className="border-b border-[#222]">
                    <td className="py-2 px-2">{s.cdServico}</td>
                    <td className="py-2 px-2">{s.dsServico}</td>
                    <td className="py-2 px-2">{nomeCliente(s.cdCliente)}</td>
                    <td className="py-2 px-2">{nomeContratado(s.cdContratado)}</td>
                    <td className="py-2 px-2">{s.dsSegmento}</td>
                    <td className="py-2 px-2">{s.dsGrauDificuldade}</td>
                    <td className="py-2 px-2">{s.dtPrevisao}</td>
                    <td className="py-2 px-2">{s.dtConclusao}</td>
                    <td className="py-2 px-2">{nomePagamento(s.cdPagamento)}</td>
                    <td className="py-2 px-2">{nomeFeedback(s.cdFeedback)}</td>
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleEdit(s)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(s.cdServico)}
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

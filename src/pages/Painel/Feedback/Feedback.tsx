import { useEffect, useState, FormEvent } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type Feedback = {
  cdFeedback?: number;
  dsFeedback: string;
  dsComentario: string;
  dtEnvio: string;
  cdServico: number | string;
};

type Servico = {
  cdServico: number;
  dsServico: string;
  cdCliente: number;
};

type Cliente = {
  cdCliente: number;
  dsNome: string;
};

const API_URL = "https://five63489.onrender.com/feedback";
const API_SERVICO = "https://five63489.onrender.com/servico";
const API_CLIENTE = "https://five63489.onrender.com/cliente";

export default function FeedbackPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [lista, setLista] = useState<Feedback[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [carregandoServicos, setCarregandoServicos] = useState(false);
  const [carregandoClientes, setCarregandoClientes] = useState(false);

  const [mostrarLista, setMostrarLista] = useState(false);
  const [loadingLista, setLoadingLista] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [form, setForm] = useState<Feedback>({
    dsFeedback: "",
    dsComentario: "",
    dtEnvio: "",
    cdServico: "",
  });

  useEffect(() => {
    carregarFeedbacks();
    carregarServicos();
    carregarClientes();
  }, []);

  async function carregarFeedbacks() {
    setLoadingLista(true);
    try {
      const res = await fetch(API_URL);
      if (res.ok) setLista(await res.json());
      else setLista([]);
    } catch {
      console.log("Erro ao carregar feedbacks");
    } finally {
      setLoadingLista(false);
    }
  }

  async function carregarServicos() {
    if (servicos.length || carregandoServicos) return;
    setCarregandoServicos(true);

    try {
      const res = await fetch(API_SERVICO);
      if (res.ok) setServicos(await res.json());
    } catch {
      console.log("Erro ao carregar serviços");
    } finally {
      setCarregandoServicos(false);
    }
  }

  async function carregarClientes() {
    if (clientes.length || carregandoClientes) return;
    setCarregandoClientes(true);

    try {
      const res = await fetch(API_CLIENTE);
      if (res.ok) setClientes(await res.json());
    } catch {
      console.log("Erro ao carregar clientes");
    } finally {
      setCarregandoClientes(false);
    }
  }

  function nomeCliente(id: number | string) {
    const c = clientes.find((x) => x.cdCliente === Number(id));
    return c ? c.dsNome : "-";
  }

  function nomeServicoComCliente(id: number | string) {
    const s = servicos.find((x) => x.cdServico === Number(id));
    if (!s) return `Serviço ${id}`;
    return `${s.dsServico} — Cliente: ${nomeCliente(s.cdCliente)}`;
  }

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function limparFormulario() {
    setEditandoId(null);
    setForm({
      dsFeedback: "",
      dsComentario: "",
      dtEnvio: "",
      cdServico: "",
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;

    const payload = {
      ...form,
      cdServico: Number(form.cdServico),
    };

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Erro ao salvar feedback.");
        return;
      }

      carregarFeedbacks();
      limparFormulario();
      alert(editandoId ? "Feedback atualizado!" : "Feedback cadastrado!");
    } catch {
      alert("Erro de comunicação com servidor.");
    }
  }

  function iniciarEdicao(f: Feedback) {
    setEditandoId(f.cdFeedback ?? null);
    setForm({
      dsFeedback: f.dsFeedback,
      dsComentario: f.dsComentario,
      dtEnvio: f.dtEnvio,
      cdServico: f.cdServico,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirFeedback(id?: number) {
    if (!id) return;
    if (!confirm("Deseja realmente excluir este feedback?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.status === 204) carregarFeedbacks();
    } catch {
      alert("Erro ao excluir.");
    }
  }

  return (
    <main className="p-8 flex flex-col gap-8">

      {/* TÍTULO */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#ff6600]">Feedbacks</h1>

        <button
          onClick={() => {
            const novo = !mostrarLista;
            setMostrarLista(novo);
            if (novo) carregarFeedbacks();
          }}
          className="bg-[#ff6600] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#ff8533]"
        >
          {mostrarLista ? "Ocultar Lista" : "Listar Feedbacks"}
        </button>
      </div>

      {/* FORMULÁRIO */}
      <form
        onSubmit={handleSubmit}
        className={`border p-8 rounded-2xl shadow-lg flex flex-col gap-6 max-w-5xl ${
          isDark ? "bg-[#111] border-[#222]" : "bg-white border-gray-300"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex flex-col">
            <label className="font-semibold">Título</label>
            <input
              name="dsFeedback"
              value={form.dsFeedback}
              onChange={handleChange}
              required
              placeholder="Ex: Atendimento excelente!"
              className={`p-3 rounded border ${
                isDark ? "bg-[#181818] border-[#333]" : "bg-gray-100"
              }`}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Data de Envio</label>
            <input
              type="date"
              name="dtEnvio"
              value={form.dtEnvio}
              onChange={handleChange}
              required
              className={`p-3 rounded border ${
                isDark ? "bg-[#181818] border-[#333]" : "bg-gray-100"
              }`}
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold">Comentário</label>
            <textarea
              name="dsComentario"
              value={form.dsComentario}
              onChange={handleChange}
              required
              className={`p-3 rounded border h-28 ${
                isDark ? "bg-[#181818] border-[#333]" : "bg-gray-100"
              }`}
              placeholder="Descreva sua experiência..."
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Serviço</label>
            <select
              name="cdServico"
              value={form.cdServico}
              onChange={handleChange}
              onClick={() => {
                carregarServicos();
                carregarClientes();
              }}
              required
              className={`p-3 rounded border ${
                isDark ? "bg-[#181818] border-[#333]" : "bg-gray-100"
              }`}
            >
              {carregandoServicos || carregandoClientes ? (
                <option value="">Carregando Serviços...</option>
              ) : (
                <>
                  <option value="">Selecione o Serviço e o Cliente...</option>
                  {servicos.map((s) => (
                    <option key={s.cdServico} value={s.cdServico}>
                      {s.dsServico} — Cliente: {nomeCliente(s.cdCliente)}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

        </div>

        <button
          type="submit"
          className={`w-full text-white font-bold py-3 rounded-lg mt-4 ${
            editandoId
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {editandoId ? "Salvar Alterações" : "Salvar Feedback"}
        </button>
      </form>

      {/* LISTA */}
      {mostrarLista && (
        <section
          className={`rounded-2xl p-6 max-w-6xl border ${
            isDark ? "bg-[#111] border-[#222]" : "bg-gray-100 border-gray-300"
          }`}
        >
          {loadingLista ? (
            <p className={isDark ? "text-white" : "text-black"}>
              Carregando feedbacks...
            </p>
          ) : lista.length === 0 ? (
            <p className={isDark ? "text-white" : "text-black"}>
              Nenhum feedback cadastrado.
            </p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr
                  className={`border-b ${
                    isDark ? "border-[#333] text-white" : "border-gray-500 text-black"
                  }`}
                >
                  <th className="py-2">ID</th>
                  <th className="py-2">Avaliação</th>
                  <th className="py-2">Comentário</th>
                  <th className="py-2">Data</th>
                  <th className="py-2">Serviço / Cliente</th>
                  <th className="py-2 text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {lista.map((f) => (
                  <tr
                    key={f.cdFeedback}
                    className={`border-b ${
                      isDark
                        ? "border-[#222] text-white hover:bg-[#1a1a1a]"
                        : "border-gray-300 text-black hover:bg-gray-200"
                    }`}
                  >
                    <td className="py-2">{f.cdFeedback}</td>
                    <td className="py-2">{f.dsFeedback}</td>
                    <td className="py-2">{f.dsComentario}</td>
                    <td className="py-2">{f.dtEnvio}</td>
                    <td className="py-2">{nomeServicoComCliente(f.cdServico)}</td>

                    <td className="py-2 text-center space-x-2">
                      <button
                        onClick={() => iniciarEdicao(f)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black rounded"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => excluirFeedback(f.cdFeedback)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
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

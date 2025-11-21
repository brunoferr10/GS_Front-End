import { useEffect, useState, FormEvent } from "react";

// Tipo
type Contratado = {
  cdContratado?: number;
  nmCnpj: string;
  dsNome: string;
  nmTelefone: string;
  dsRegiao: string;
  dsCidade: string;
  dsEspecialidade: string;
  dsEstrelas: number;
};

// API
const API_URL = "https://five63489.onrender.com/contratado";

// Selects padrão
const REGIOES = ["Zona Norte", "Zona Sul", "Zona Leste", "Zona Oeste", "Centro"];
const CIDADES = ["São Paulo", "Guarulhos", "Santo André", "Osasco", "Barueri"];
const ESPECIALIDADES = [
  "Pedreiro",
  "Pintura",
  "Elétrica",
  "Hidráulica",
  "Marcenaria",
  "Reformas Gerais",
];

export default function Contratados() {
  const [contratados, setContratados] = useState<Contratado[]>([]);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Form
  const [form, setForm] = useState<Contratado>({
    nmCnpj: "",
    dsNome: "",
    nmTelefone: "",
    dsRegiao: "",
    dsCidade: "",
    dsEspecialidade: "",
    dsEstrelas: 0,
  });

  // Carregar dados iniciais
  useEffect(() => {
    carregarContratados();
  }, []);

  async function carregarContratados() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) return setContratados([]);
      const data = await res.json();
      setContratados(data);
    } catch {
      console.log("Erro ao carregar contratados");
    }
  }

  // Máscara inteligente do telefone
  const formatarTelefone = (valor: string) => {
    valor = valor.replace(/\D/g, "");
    if (valor.length <= 10) {
      return valor
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return valor
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
  };

  function handleChange(e: any) {
    const { name, value } = e.target;

    if (name === "nmTelefone") {
      setForm((prev) => ({ ...prev, nmTelefone: formatarTelefone(value) }));
      return;
    }

    if (name === "dsEstrelas") {
      setForm((prev) => ({ ...prev, dsEstrelas: Number(value) }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function limparFormulario() {
    setEditandoId(null);
    setForm({
      nmCnpj: "",
      dsNome: "",
      nmTelefone: "",
      dsRegiao: "",
      dsCidade: "",
      dsEspecialidade: "",
      dsEstrelas: 0,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;

    const payload = {
      ...form,
      dsEstrelas: Number(form.dsEstrelas),
    };

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Erro ao salvar contratado");
      return;
    }

    await carregarContratados();
    limparFormulario();
    alert(editandoId ? "Atualizado com sucesso!" : "Cadastrado com sucesso!");
  }

  function iniciarEdicao(c: Contratado) {
    setEditandoId(c.cdContratado ?? null);
    setForm({
      nmCnpj: c.nmCnpj,
      dsNome: c.dsNome,
      nmTelefone: c.nmTelefone,
      dsRegiao: c.dsRegiao,
      dsCidade: c.dsCidade,
      dsEspecialidade: c.dsEspecialidade,
      dsEstrelas: c.dsEstrelas,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirContratado(id?: number) {
    if (!id) return;
    if (!confirm("Deseja realmente excluir?")) return;

    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.status === 204) carregarContratados();
  }

  return (
    <main className="p-8 flex flex-col gap-8">

      {/* Título + botão listar */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#ff6600]">Contratados</h1>

        <button
          onClick={() => setMostrarLista(!mostrarLista)}
          className="bg-[#ff6600] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#ff8533] transition"
        >
          {mostrarLista ? "Ocultar Lista" : "Listar Contratados"}
        </button>
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#111] border border-gray-300 dark:border-[#222] p-8 rounded-2xl shadow-lg flex flex-col gap-6 max-w-5xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex flex-col">
            <label className="font-semibold">Nome da Empresa</label>
            <input
              name="dsNome"
              value={form.dsNome}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">CNPJ</label>
            <input
              name="nmCnpj"
              value={form.nmCnpj}
              onChange={handleChange}
              required
              maxLength={14}
              className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Telefone</label>
            <input
              name="nmTelefone"
              value={form.nmTelefone}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Região</label>
            <select
              name="dsRegiao"
              value={form.dsRegiao}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
            >
              <option value="">Selecione...</option>
              {REGIOES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Cidade</label>
            <select
              name="dsCidade"
              value={form.dsCidade}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
            >
              <option value="">Selecione...</option>
              {CIDADES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Especialidade</label>
            <select
              name="dsEspecialidade"
              value={form.dsEspecialidade}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
            >
              <option value="">Selecione...</option>
              {ESPECIALIDADES.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Estrelas</label>
            <select
              name="dsEstrelas"
              value={form.dsEstrelas}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-[#181818] border dark:border-[#333]"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Botão salvar */}
        <button
          type="submit"
          className={`w-full text-white font-bold py-3 rounded-lg mt-4 transition ${
            editandoId
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {editandoId ? "Salvar Alterações" : "Salvar Contratado"}
        </button>
      </form>

      {/* Lista */}
      {mostrarLista && (
        <section className="bg-[#111] border border-[#222] rounded-2xl p-6 max-w-6xl mt-6">
          {contratados.length === 0 ? (
            <p className="text-white">Nenhum contratado encontrado.</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#333] text-white">
                  <th className="py-2 px-2">ID</th>
                  <th className="py-2 px-2">Empresa</th>
                  <th className="py-2 px-2">CNPJ</th>
                  <th className="py-2 px-2">Telefone</th>
                  <th className="py-2 px-2">Região</th>
                  <th className="py-2 px-2">Cidade</th>
                  <th className="py-2 px-2">Especialidade</th>
                  <th className="py-2 px-2">Estrelas</th>
                  <th className="py-2 px-2 text-center">Ações</th>
                </tr>
              </thead>

              <tbody>
                {contratados.map((c) => (
                  <tr
                    key={c.cdContratado}
                    className="border-b border-[#222] hover:bg-[#1a1a1a] transition"
                  >
                    <td className="py-2 px-2 text-white">{c.cdContratado}</td>
                    <td className="py-2 px-2 text-white">{c.dsNome}</td>
                    <td className="py-2 px-2 text-white">{c.nmCnpj}</td>
                    <td className="py-2 px-2 text-white">{c.nmTelefone}</td>
                    <td className="py-2 px-2 text-white">{c.dsRegiao}</td>
                    <td className="py-2 px-2 text-white">{c.dsCidade}</td>
                    <td className="py-2 px-2 text-white">{c.dsEspecialidade}</td>
                    <td className="py-2 px-2 text-white">{c.dsEstrelas}</td>

                    <td className="py-2 px-2 text-center space-x-2">
                      <button
                        onClick={() => iniciarEdicao(c)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black rounded font-semibold"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => excluirContratado(c.cdContratado)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
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

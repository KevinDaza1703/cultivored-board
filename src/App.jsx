import { useState, useRef, useEffect } from "react";

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const STORAGE_KEY = "cultivored_tablero_v8"; // v8 para la nueva estructura Kanban

// ─── EDITABLE FIELD ───────────────────────────────────────────────────────────
function EditField({ value, onChange, placeholder = "✏️...", multiline = false, bgFocused = "#fffef7", bgBlur = "#faf8f2" }) {
  const [focused, setFocused] = useState(false);
  const base = {
    width: "100%", boxSizing: "border-box",
    background: focused ? bgFocused : bgBlur,
    border: `1.5px dashed ${focused ? "#52B788" : "transparent"}`,
    borderRadius: 6, padding: "6px 8px",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
    color: value ? "#1c1c1c" : "#9a9485",
    outline: "none", minHeight: multiline ? 44 : 28,
    transition: "border-color 0.2s, background 0.2s",
    lineHeight: 1.4, resize: multiline ? "vertical" : "none",
  };
  return multiline
    ? <textarea style={base} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    : <input style={base} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
}

// ─── COMPONENTES UI COMPARTIDOS ────────────────────────────────────────────────
function Block({ num, tag, title, subtitle, accent, bg, children, fullWidth }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      overflow: "hidden", display: "flex", flexDirection: "column",
      gridColumn: fullWidth ? "1 / -1" : undefined,
    }}>
      <div style={{ background: bg, padding: "16px 22px 12px", borderBottom: `2px solid ${accent}`, display: "flex", alignItems: "center", gap: 12 }}>
        {num && <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "2rem", fontWeight: 800, color: accent, opacity: 0.18, lineHeight: 1 }}>{num}</span>}
        <div>
          <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: accent, opacity: 0.85 }}>{tag}</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.96rem", color: accent, lineHeight: 1.2, marginTop: 2 }}>{title}</div>
          {subtitle && <div style={{ fontSize: "0.7rem", color: "#6b6459", fontStyle: "italic", marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ padding: "18px 22px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#7a7265", marginBottom: 3 }}>{children}</div>;
}

function CardList({ list = [], setList, placeholder, bgField = "#faf8f2" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {list.map((item, i) => (
        <EditField key={i} value={item || ""} multiline bgBlur={bgField}
          onChange={val => setList(list.map((e, j) => j === i ? val : e))} 
          placeholder={placeholder} />
      ))}
      <button onClick={() => setList([...list, ""])}
        style={{ fontSize: "0.68rem", color: "#6b6459", background: "none", border: "1px dashed #c8c2b4", borderRadius: 6, padding: "4px 8px", cursor: "pointer", opacity: 0.8, marginTop: 2 }}>
        + Agregar ítem
      </button>
    </div>
  );
}

// ─── ESTADO INICIAL ───────────────────────────────────────────────────────────
const INITIAL = {
  territorio: "", duracion: "8 semanas",
  vision: "CultivoRED es una plataforma híbrida, social y transaccional, basada en confianza territorial, que conecta emprendedores, clientes y mercados para generar valor económico y social sostenible.",
  objetivo: "Validar el journey, la propuesta de valor y el modelo de captación de CultivoRED, testeando un Nodo Territorial en la Fase 2.",
  exito: ["", "", "", ""],
  hips: [
    { enunciado: "Podemos definir y mapear el 'journey' de cada cliente (Descubrir → Registrarse → Validar → Conectar → Crecer) para entender sus dolores y expectativas reales.", valida: "Taller UX + Mapa de empatía", indicador: "Journey Map documentado" },
    { enunciado: "Podemos definir una propuesta de valor clara y diferenciada para cada segmento (Ej: Semilla vs Raíz) que resuelva problemas específicos en su etapa actual.", valida: "Value Proposition Canvas", indicador: "Propuestas de valor consolidadas" },
    { enunciado: "Podemos diseñar metodologías de captación efectivas basadas exclusivamente en el journey y la propuesta de valor para atraer nuevos emprendedores.", valida: "Estrategia de expectativa inicial", indicador: "Tasa de respuesta/interés" },
  ],
  semanaExtras: [[], [], [], []],
  tareas: [
    { texto: "T1a — ¿Qué vamos a ofrecer a los emprendedores que se registren? (Definir Propuesta de Valor).", responsable: "Equipo", fecha: "Viernes", status: "todo" },
    { texto: "T1b — ¿Cómo vamos a definir el 'journey' de cada cliente? (Diseño de experiencia).", responsable: "Kevin + Moni Molano", fecha: "Taller UX", status: "todo" },
    { texto: "T1c — ¿Qué metodologías utilizaremos para captar nuevos emprendedores rurales?", responsable: "Equipo", fecha: "Viernes", status: "todo" },
    { texto: "T2 — Definir roadmap con sprints una vez definidas las propuestas de valor.", responsable: "Kevin", fecha: "Por definir", status: "todo" },
    { texto: "T3 — Activar chats de CultivoRED y empezar estrategia de expectativa.", responsable: "Equipo", fecha: "Viernes", status: "todo" },
  ],
  empatia: {
    piensaSiente: ["¿Cuáles son sus mayores preocupaciones?", "¿Qué aspiraciones tiene con su negocio rural?"],
    ve: ["¿Cómo es su entorno?", "¿Qué ofertas o problemas ve en el campo?"],
    diceHace: ["¿Cómo se comporta ante la tecnología?", "¿Qué actitud tiene hacia el cambio?"],
    escucha: ["¿Qué dicen sus amigos/familia?", "¿Qué le dicen otros productores o clientes?"],
    dolores: ["Falta de acceso a mercados directos", "Dificultad con la tecnología"],
    ganancias: ["Aumentar sus ingresos sin intermediarios", "Aprender a usar herramientas digitales"],
  },
  valueProp: {
    tareas: ["Vender sus productos a buen precio", "Encontrar clientes recurrentes"],
    doloresC: ["Muchos intermediarios que bajan sus ganancias", "Falta de educación financiera"],
    gananciasC: ["Precios justos", "Reconocimiento de su trabajo"],
    productos: ["Plataforma CultivoRED", "Chatbot Juli AI", "Sello de Origen"],
    aliviadores: ["Conexión directa con clientes finales", "Asesoría paso a paso por WhatsApp"],
    creadores: ["Visibilidad garantizada ante clientes ancla", "Pertenecer a una red de confianza"],
  },
  bmc: {
    aliados: ["Medios de comunicación", "Cámaras de comercio", "Cajas de compensación", "Universidades", "Centros de Investigación", "SENA", "Alcaldías locales", "Cooperación: GIZ, PNUD"],
    recursos: ["Contenido educativo", "Plataforma Digital CultivoRED - Juli AI", "Comunidad WhatsApp", "Kits territoriales", "Nodos territoriales formados", "Datos georreferenciados"],
    propuesta: ["Acceso a conocimiento y tecnología", "Conexión para aumentar transacciones", "Apoyo en formalización", "Visibilidad con clientes ideales", "Sello de Origen MásPorTIC"],
    canales: ["Plataforma CultivoRED / Juli AI", "Eventos promovidos por nodos", "Gremio Agtech y Redes Sociales", "Ferias y encuentros", "SECOP II licitaciones"],
    segmentos: ["Emprendedores rurales", "Agricultores", "Proveedores de insumos", "Turismo comunitario", "Hipermercados (Ley 30%)", "Empresas transformadoras"],
    monetizacion: ["Contratos con el Estado", "Cobro de plan a proveedores", "Porcentaje por conectar", "Servicio por experiencias", "Suscripción por niveles"],
  }
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function CultivoRED() {
  const [s, setS] = useState(() => {
    try {
      const guardado = window.localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        return {
          ...INITIAL,
          ...parsed,
          empatia: { ...INITIAL.empatia, ...(parsed.empatia || {}) },
          valueProp: { ...INITIAL.valueProp, ...(parsed.valueProp || {}) },
          bmc: { ...INITIAL.bmc, ...(parsed.bmc || {}) }
        };
      }
      return INITIAL;
    } catch (error) { return INITIAL; }
  });

  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);
  
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } 
    catch (e) { console.error("No se guardó", e); }
  }, [s]);

  const upd = (key, val) => setS(p => ({ ...p, [key]: val }));
  const updObj = (key, i, field, val) => setS(p => ({ ...p, [key]: p[key].map((e, j) => j === i ? { ...e, [field]: val } : e) }));
  const updNested = (parent, key, val) => setS(p => ({ ...p, [parent]: { ...p[parent], [key]: val } }));

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3500); };

  // ── LÓGICA KANBAN ──
  const onDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    e.preventDefault(); 
  };

  const onDrop = (e, statusDestino) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;
    
    const nuevasTareas = [...s.tareas];
    nuevasTareas[draggedItemIndex].status = statusDestino;
    upd("tareas", nuevasTareas);
    setDraggedItemIndex(null);
  };

  const exportar = () => {
    try {
      const payload = JSON.stringify({ _version: "v8", _fecha: new Date().toISOString(), ...s }, null, 2);
      const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `cultivored-v8-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      showToast("✅ Tablero exportado");
    } catch (e) { showToast("❌ Error al exportar", false); }
  };

  const importar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const { _version, _fecha, ...datos } = parsed;
        setS({
          ...INITIAL,
          ...datos,
          empatia: { ...INITIAL.empatia, ...(datos.empatia || {}) },
          valueProp: { ...INITIAL.valueProp, ...(datos.valueProp || {}) },
          bmc: { ...INITIAL.bmc, ...(datos.bmc || {}) }
        });
        showToast("✅ Tablero restaurado");
      } catch (err) { showToast("❌ Archivo inválido", false); }
    };
    reader.readAsText(file); e.target.value = "";
  };

  const renderTab = (id, icon, label) => {
    const active = activeTab === id;
    return (
      <button onClick={() => setActiveTab(id)}
        style={{
          background: active ? "#fff" : "transparent", color: active ? "#2d6a4f" : "#fff",
          border: "none", padding: "10px 18px", borderRadius: "8px 8px 0 0", cursor: "pointer",
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem",
          display: "flex", alignItems: "center", gap: 8, transition: "0.2s", opacity: active ? 1 : 0.7
        }}>
        <span>{icon}</span> {label}
      </button>
    );
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#fefdf8", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; } textarea, input { font-family: 'DM Sans', sans-serif; }
      `}</style>
      
      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: toast.ok ? "#2d6a4f" : "#c0392b", color: "#fff", padding: "10px 22px", borderRadius: 10, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.82rem", zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>{toast.msg}</div>
      )}

      {/* ── HEADER ── */}
      <div style={{ background: "#2d6a4f", padding: "32px 44px 0", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>Cultivo<span style={{ color: "#95d5b2" }}>RED</span></div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.84rem", marginTop: 5 }}>Plataforma social y territorial de emprendimiento rural</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={exportar} style={{ background: "#fbbf24", color: "#1c1c1c", border: "none", padding: "8px 16px", borderRadius: 8, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer" }}>⬇️ Exportar JSON</button>
            <button onClick={() => fileRef.current && fileRef.current.click()} style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px", borderRadius: 8, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer" }}>⬆️ Importar JSON</button>
            <input ref={fileRef} type="file" accept=".json" onChange={importar} style={{ display: "none" }} />
          </div>
        </div>

        {/* MENÚ DE PESTAÑAS */}
        <div style={{ display: "flex", gap: 6, borderBottom: "2px solid #fff" }}>
          {renderTab("dashboard", "🎛️", "Tablero de Control")}
          {renderTab("empatia", "🧠", "Mapa de Empatía")}
          {renderTab("valueProp", "🎁", "Propuesta de Valor")}
          {renderTab("bmc", "🌱", "Semilla de mi Negocio")}
        </div>
      </div>

      <div style={{ padding: "26px 44px 60px" }}>
        
        {/* ────────────────────────────────────────────────────────────────────────
            PESTAÑA 1: TABLERO GENERAL (DASHBOARD)
            ──────────────────────────────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Block num="01" tag="🎯 Estratégico" title="Norte del Piloto" accent="#2d6a4f" bg="#f0faf5">
              <Label>Objetivo de esta fase</Label>
              <EditField value={s.objetivo} onChange={v => upd("objetivo", v)} multiline />
            </Block>

            <Block num="02" tag="🔬 Lean Startup" title="Hipótesis a Validar (T1)" accent="#92400e" bg="#fffbeb">
              {["H1 — (T1b) Journey", "H2 — (T1a) Valor", "H3 — (T1c) Captación"].map((label, i) => (
                <div key={i} style={{ background: "#fffbeb", borderRadius: 8, borderLeft: `4px solid #f6ad55`, padding: "12px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.73rem", fontWeight: 700, color: "#92400e" }}>{label}</div>
                  <EditField value={s.hips?.[i]?.enunciado || ""} onChange={v => updObj("hips", i, "enunciado", v)} multiline />
                </div>
              ))}
            </Block>

            <Block num="03" tag="⚡ Ejecución" title="Ruta del piloto" subtitle="Foco: Validación y Fase 2" accent="#5b21b6" bg="#f5f3ff" fullWidth>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                {[
                  ["Semanas 1–2", "DISEÑO", ["📍 Construcción Journey", "🎁 Definición Propuesta Valor", "👥 Diseño Captación"], 0],
                  ["Semanas 3–4", "TESTEO", ["✅ Pitch validado", "🗺️ Roadmap Fase 2", "📣 Estrategia expectativa"], 1],
                  ["Semanas 5–6", "ACTIVACIÓN", ["🎉 Activación chats", "🏘️ Testeo Primer Nodo", "🌱 Captación primeros"], 2],
                  ["Semanas 7–8", "MEDIR", ["📊 Encuestas revisadas", "🤝 Primer cliente ancla", "🔁 Iteración"], 3],
                ].map(([semana, fase, items, idx]) => (
                  <div key={fase} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ background: "#1c1c1c", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                      <div style={{ fontSize: "0.58rem", fontWeight: 700, color: "#95d5b2" }}>{semana}</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.8rem", color: "#fff" }}>{fase}</div>
                    </div>
                    {items.map((it, i) => <div key={i} style={{ background: "#fff", border: "1px solid #ede9e0", borderRadius: 6, padding: "7px 10px", fontSize: "0.76rem" }}>{it}</div>)}
                    {s.semanaExtras?.[idx]?.map((ex, i) => <EditField key={i} value={ex} onChange={v => upd("semanaExtras", s.semanaExtras.map((e, j) => j === idx ? s.semanaExtras[idx].map((old, k) => k===i ? v : old) : e))} />)}
                    <button onClick={() => upd("semanaExtras", s.semanaExtras.map((e, j) => j === idx ? [...e, ""] : e))} style={{ fontSize: "0.68rem", color: "#5b21b6", background: "none", border: "1px dashed #5b21b6", borderRadius: 6, cursor: "pointer" }}>+ Hito</button>
                  </div>
                ))}
              </div>
            </Block>

            {/* ── B4: NUEVO TABLERO KANBAN DE TAREAS ── */}
            <Block num="04" tag="📌 Acuerdos" title="Tablero de Tareas Kanban" subtitle="Arrastra las tarjetas para cambiar su estado" accent="#b7791f" bg="#fffbeb" fullWidth>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                {[
                  { id: "todo", title: "📝 Por hacer", bg: "#fef3c7", border: "#f59e0b" },
                  { id: "doing", title: "⏳ En proceso", bg: "#e0e7ff", border: "#6366f1" },
                  { id: "done", title: "✅ Completadas", bg: "#dcfce7", border: "#22c55e" }
                ].map(columna => (
                  <div 
                    key={columna.id}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, columna.id)}
                    style={{ background: "#faf8f2", borderRadius: 10, padding: 12, minHeight: 300, display: "flex", flexDirection: "column", gap: 10, border: "1px solid #ede9e0" }}
                  >
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1c1c1c", borderBottom: `2px solid ${columna.border}`, paddingBottom: 8, marginBottom: 4 }}>
                      {columna.title}
                    </div>
                    {s.tareas.map((t, i) => {
                      if (t.status !== columna.id) return null;
                      return (
                        <div 
                          key={i} 
                          draggable 
                          onDragStart={(e) => onDragStart(e, i)}
                          style={{ background: columna.bg, borderRadius: 8, padding: 10, border: `1px solid ${columna.border}`, boxShadow: "0 2px 4px rgba(0,0,0,0.05)", cursor: "grab", display: "flex", flexDirection: "column", gap: 6 }}
                        >
                          <EditField value={t.texto} onChange={v => updObj("tareas", i, "texto", v)} multiline placeholder="Descripción de la tarea..." bgBlur="transparent" bgFocused="#fff" />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                            <EditField value={t.responsable} onChange={v => updObj("tareas", i, "responsable", v)} placeholder="👤 Resp..." bgBlur="transparent" bgFocused="#fff" />
                            <EditField value={t.fecha} onChange={v => updObj("tareas", i, "fecha", v)} placeholder="📅 Fecha..." bgBlur="transparent" bgFocused="#fff" />
                          </div>
                        </div>
                      );
                    })}
                    {columna.id === "todo" && (
                      <button 
                        onClick={() => upd("tareas", [...s.tareas, { texto: "", responsable: "", fecha: "", status: "todo" }])}
                        style={{ background: "transparent", border: "1px dashed #c8c2b4", borderRadius: 8, padding: "8px", color: "#6b6459", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", marginTop: "auto" }}
                      >
                        + Nueva tarea
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Block>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────────
            PESTAÑA 2: MAPA DE EMPATÍA
            ──────────────────────────────────────────────────────────────────────── */}
        {activeTab === "empatia" && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 30, boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", margin: 0, color: "#1c1c1c", fontSize: "1.8rem" }}>Mapa de Empatía</h2>
              <p style={{ color: "#6b6459", fontSize: "0.85rem", margin: "5px 0 0" }}>Para entender al Emprendedor Rural antes de diseñar la propuesta.</p>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <div style={{ background: "#fef3c7", padding: 20, borderRadius: 12, border: "2px solid #fcd34d" }}>
                <Label>🤔 ¿Qué piensa y siente?</Label>
                <CardList list={s.empatia?.piensaSiente} setList={v => updNested("empatia", "piensaSiente", v)} bgField="#fff" />
              </div>
              <div style={{ background: "#e0e7ff", padding: 20, borderRadius: 12, border: "2px solid #a5b4fc" }}>
                <Label>👀 ¿Qué ve?</Label>
                <CardList list={s.empatia?.ve} setList={v => updNested("empatia", "ve", v)} bgField="#fff" />
              </div>
              <div style={{ background: "#dcfce7", padding: 20, borderRadius: 12, border: "2px solid #86efac" }}>
                <Label>🗣️ ¿Qué dice y hace?</Label>
                <CardList list={s.empatia?.diceHace} setList={v => updNested("empatia", "diceHace", v)} bgField="#fff" />
              </div>
              <div style={{ background: "#fee2e2", padding: 20, borderRadius: 12, border: "2px solid #fca5a5" }}>
                <Label>👂 ¿Qué escucha?</Label>
                <CardList list={s.empatia?.escucha} setList={v => updNested("empatia", "escucha", v)} bgField="#fff" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "#faf8f2", padding: 20, borderRadius: 12, borderTop: "4px solid #ef4444" }}>
                <Label>❌ Esfuerzos / Dolores</Label>
                <CardList list={s.empatia?.dolores} setList={v => updNested("empatia", "dolores", v)} bgField="#fff" />
              </div>
              <div style={{ background: "#faf8f2", padding: 20, borderRadius: 12, borderTop: "4px solid #22c55e" }}>
                <Label>✅ Resultados / Ganancias</Label>
                <CardList list={s.empatia?.ganancias} setList={v => updNested("empatia", "ganancias", v)} bgField="#fff" />
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────────
            PESTAÑA 3: VALUE PROPOSITION CANVAS
            ──────────────────────────────────────────────────────────────────────── */}
        {activeTab === "valueProp" && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 30, boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", margin: 0, color: "#1c1c1c", fontSize: "1.8rem" }}>Value Proposition Canvas</h2>
              <p style={{ color: "#6b6459", fontSize: "0.85rem", margin: "5px 0 0" }}>El encaje entre lo que el cliente necesita y lo que CultivoRED ofrece.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
              <div style={{ border: "2px dashed #95d5b2", borderRadius: 12, padding: 24, position: "relative", background: "#f0faf5" }}>
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#2d6a4f", color: "#fff", padding: "4px 14px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700 }}>🎁 TU PROPUESTA DE VALOR</div>
                
                <div style={{ marginBottom: 20, marginTop: 10 }}>
                  <Label>📦 Productos y Servicios</Label>
                  <CardList list={s.valueProp?.productos} setList={v => updNested("valueProp", "productos", v)} bgField="#fff" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <Label>💊 Creadores de Ganancias</Label>
                    <CardList list={s.valueProp?.creadores} setList={v => updNested("valueProp", "creadores", v)} bgField="#fff" />
                  </div>
                  <div>
                    <Label>🩹 Aliviadores de Dolores</Label>
                    <CardList list={s.valueProp?.aliviadores} setList={v => updNested("valueProp", "aliviadores", v)} bgField="#fff" />
                  </div>
                </div>
              </div>

              <div style={{ border: "2px dashed #fca5a5", borderRadius: "100px", padding: "40px 30px", position: "relative", background: "#fff5f5", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#dc2626", color: "#fff", padding: "4px 14px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700 }}>👤 SEGMENTO DE CLIENTE</div>
                
                <div style={{ marginBottom: 20 }}>
                  <Label>📝 Tareas del Cliente (Jobs to be done)</Label>
                  <CardList list={s.valueProp?.tareas} setList={v => updNested("valueProp", "tareas", v)} bgField="#fff" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <Label>🤩 Ganancias Esperadas</Label>
                    <CardList list={s.valueProp?.gananciasC} setList={v => updNested("valueProp", "gananciasC", v)} bgField="#fff" />
                  </div>
                  <div>
                    <Label>😫 Dolores</Label>
                    <CardList list={s.valueProp?.doloresC} setList={v => updNested("valueProp", "doloresC", v)} bgField="#fff" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────────
            PESTAÑA 4: SEMILLA DE MI NEGOCIO (BMC)
            ──────────────────────────────────────────────────────────────────────── */}
        {activeTab === "bmc" && (
          <div style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, borderBottom: "3px solid #166534", paddingBottom: 10 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", margin: 0, color: "#166534", fontSize: "1.8rem", flex: 1 }}>Semilla de mi negocio</h2>
              <span style={{ fontSize: "1.5rem" }}>🌱</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, alignItems: "start" }}>
              <div style={{ background: "#bfdbfe", padding: 14, borderRadius: 8, minHeight: 400 }}>
                <div style={{ fontWeight: 800, color: "#1e3a8a", fontSize: "0.8rem", marginBottom: 10 }}>🤝 ALIADOS CLAVE<br/><span style={{fontWeight:400, fontSize:"0.65rem"}}>¿Quién te puede ayudar?</span></div>
                <CardList list={s.bmc?.aliados} setList={v => updNested("bmc", "aliados", v)} bgField="#fff" />
              </div>
              <div style={{ background: "#60a5fa", padding: 14, borderRadius: 8, minHeight: 400 }}>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.8rem", marginBottom: 10 }}>🔧 RECURSOS CLAVE<br/><span style={{fontWeight:400, fontSize:"0.65rem"}}>¿Qué necesitas?</span></div>
                <CardList list={s.bmc?.recursos} setList={v => updNested("bmc", "recursos", v)} bgField="#fff" />
              </div>
              <div style={{ background: "#f87171", padding: 14, borderRadius: 8, minHeight: 400 }}>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.8rem", marginBottom: 10 }}>🎁 PROPUESTA DE VALOR<br/><span style={{fontWeight:400, fontSize:"0.65rem"}}>¿Qué haces diferente?</span></div>
                <CardList list={s.bmc?.propuesta} setList={v => updNested("bmc", "propuesta", v)} bgField="#fff" />
              </div>
              <div style={{ background: "#f87171", padding: 14, borderRadius: 8, minHeight: 400, position:"relative", overflow:"hidden" }}>
                <div style={{position:"absolute", top:0, left:0, right:0, height:"30%", background:"#dc2626", zIndex:0}}></div>
                <div style={{position:"relative", zIndex:1}}>
                  <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.8rem", marginBottom: 10 }}>📣 CANALES<br/><span style={{fontWeight:400, fontSize:"0.65rem"}}>¿Cómo llegas a los clientes?</span></div>
                  <CardList list={s.bmc?.canales} setList={v => updNested("bmc", "canales", v)} bgField="#fff" />
                </div>
              </div>
              <div style={{ background: "#fde047", padding: 14, borderRadius: 8, minHeight: 400 }}>
                <div style={{ fontWeight: 800, color: "#854d0e", fontSize: "0.8rem", marginBottom: 10 }}>👤 CLIENTES - SEGMENTOS</div>
                <CardList list={s.bmc?.segmentos} setList={v => updNested("bmc", "segmentos", v)} bgField="#fff" />
              </div>
            </div>

            <div style={{ background: "#10b981", padding: 14, borderRadius: 8, marginTop: 12 }}>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.8rem", marginBottom: 10 }}>💰 MONETIZACIÓN - FUENTE DE INGRESOS <span style={{fontWeight:400, fontSize:"0.65rem"}}>¿Cuántos ingresos tendrás?</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <CardList list={s.bmc?.monetizacion} setList={v => updNested("bmc", "monetizacion", v)} bgField="#fff" />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
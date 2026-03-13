import { useState, useRef, useEffect } from "react";

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const STORAGE_KEY = "cultivored_tablero_v4";

// ─── EDITABLE FIELD ───────────────────────────────────────────────────────────
function EditField({ value, onChange, placeholder = "✏️ Completar...", multiline = false }) {
  const [focused, setFocused] = useState(false);
  const base = {
    width: "100%", boxSizing: "border-box",
    background: focused ? "#fffef7" : "#faf8f2",
    border: `1.5px dashed ${focused ? "#52B788" : "#c8c2b4"}`,
    borderRadius: 6, padding: "6px 10px",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
    color: value ? "#1c1c1c" : "#9a9485",
    outline: "none", minHeight: multiline ? 52 : 32,
    transition: "border-color 0.2s, background 0.2s",
    lineHeight: 1.5, resize: multiline ? "vertical" : "none",
  };
  return multiline
    ? <textarea style={base} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    : <input style={base} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
}

// ─── BLOCK ────────────────────────────────────────────────────────────────────
function Block({ num, tag, title, subtitle, accent, bg, children, fullWidth }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      overflow: "hidden", display: "flex", flexDirection: "column",
      gridColumn: fullWidth ? "1 / -1" : undefined,
    }}>
      <div style={{ background: bg, padding: "16px 22px 12px", borderBottom: `2px solid ${accent}`, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "2rem", fontWeight: 800, color: accent, opacity: 0.18, lineHeight: 1 }}>{num}</span>
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
function Divider() { return <div style={{ height: 1, background: "#ede9e0", margin: "2px 0" }} />; }

// ─── HIP CARD ─────────────────────────────────────────────────────────────────
function HipCard({ label, enunciado, onEnunciado, valida, onValida, indicador, onIndicador, faded }) {
  return (
    <div style={{ background: faded ? "#faf8f2" : "#fffbeb", borderRadius: 8, borderLeft: `4px solid ${faded ? "#c8c2b4" : "#f6ad55"}`, padding: "12px 14px", opacity: faded ? 0.7 : 1, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.73rem", fontWeight: 700, color: "#92400e" }}>{label}</div>
      <EditField value={enunciado} onChange={onEnunciado} multiline placeholder="✏️ Escribí el enunciado de la hipótesis..." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <div style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#7a7265", marginBottom: 3 }}>¿Cómo la validamos?</div>
          <EditField value={valida} onChange={onValida} multiline placeholder="✏️ Método de validación..." />
        </div>
        <div>
          <div style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#7a7265", marginBottom: 3 }}>¿Qué nos dice que jala?</div>
          <EditField value={indicador} onChange={onIndicador} multiline placeholder="✏️ Indicador de éxito..." />
        </div>
      </div>
    </div>
  );
}

// ─── COMP ROW ─────────────────────────────────────────────────────────────────
function CompRow({ icon, nombre, desc, lider, setLider, last }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: last ? "none" : "1px solid #ede9e0" }}>
      <div style={{ width: 30, height: 30, borderRadius: 7, background: "#bee3f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1c1c1c" }}>{nombre}</div>
        <div style={{ fontSize: "0.72rem", color: "#6b6459", marginTop: 1 }}>{desc}</div>
      </div>
      <div style={{ minWidth: 120 }}>
        <EditField value={lider} onChange={setLider} placeholder="Líder territorial..." />
      </div>
    </div>
  );
}

// ─── ASSET ITEM ───────────────────────────────────────────────────────────────
function AssetItem({ icon, label, estado }) {
  const c = estado === "listo"
    ? { bg: "#d1fae5", text: "#065f46", lbl: "Listo ✅" }
    : { bg: "#fef3c7", text: "#92400e", lbl: "En desarrollo ⚠️" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid #ede9e0", fontSize: "0.83rem" }}>
      <span style={{ fontSize: "1rem" }}>{icon}</span>
      <span style={{ flex: 1, color: "#1c1c1c" }}>{label}</span>
      <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: c.bg, color: c.text, whiteSpace: "nowrap" }}>{c.lbl}</span>
    </div>
  );
}

// ─── BRECHA ROW ───────────────────────────────────────────────────────────────
function BrechaRow({ icon, nombre, onNombre, sol, setSol, resp, setResp, editable }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.3fr", gap: 8, padding: "8px 0", borderBottom: "1px solid #ede9e0", alignItems: "start" }}>
      {editable
        ? <EditField value={nombre} onChange={onNombre} placeholder="✏️ Brecha..." />
        : <div style={{ fontSize: "0.81rem", fontWeight: 500, color: "#1c1c1c", display: "flex", gap: 6, paddingTop: 4 }}><span>{icon}</span><span>{nombre}</span></div>
      }
      <EditField value={sol} onChange={setSol} placeholder="✏️ ¿Cómo la resolvemos?" />
      <EditField value={resp} onChange={setResp} placeholder="✏️ Responsable" />
    </div>
  );
}

// ─── TAREA ITEM ───────────────────────────────────────────────────────────────
function TareaItem({ texto, onTexto, responsable, onResponsable, fecha, onFecha, done, onDone }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: "1px solid #ede9e0", alignItems: "flex-start", opacity: done ? 0.45 : 1 }}>
      <div onClick={() => onDone(!done)}
        style={{ width: 20, height: 20, borderRadius: 4, border: "2px solid #52b788", background: done ? "#52b788" : "transparent", cursor: "pointer", flexShrink: 0, marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {done && <span style={{ color: "#fff", fontSize: "0.7rem" }}>✓</span>}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <EditField value={texto} onChange={onTexto} multiline placeholder="✏️ Descripción de la tarea..." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <EditField value={responsable} onChange={onResponsable} placeholder="👤 Responsable..." />
          <EditField value={fecha} onChange={onFecha} placeholder="📅 Fecha..." />
        </div>
      </div>
    </div>
  );
}

// ─── SEMANA COL ───────────────────────────────────────────────────────────────
function SemanaCol({ semana, fase, items, extras, setExtras }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ background: "#1c1c1c", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
        <div style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#95d5b2" }}>{semana}</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#fff", marginTop: 2 }}>{fase}</div>
      </div>
      {items.map((it, i) => (
        <div key={i} style={{ background: "#fff", border: "1px solid #ede9e0", borderRadius: 6, padding: "7px 10px", fontSize: "0.76rem", color: "#1c1c1c", lineHeight: 1.4 }}>{it}</div>
      ))}
      {extras.map((ex, i) => (
        <EditField key={i} value={ex}
          onChange={v => setExtras(extras.map((e, j) => j === i ? v : e))}
          placeholder="✏️ Agregar hito..." />
      ))}
      <button onClick={() => setExtras([...extras, ""])}
        style={{ fontSize: "0.68rem", color: "#5b21b6", background: "none", border: "1px dashed #5b21b6", borderRadius: 6, padding: "4px 8px", cursor: "pointer", opacity: 0.65 }}>
        + Hito
      </button>
    </div>
  );
}

// ─── META CARD ────────────────────────────────────────────────────────────────
function MetaCard({ label, val, setVal }) {
  return (
    <div style={{ background: "#faf8f2", borderRadius: 10, padding: "14px 12px", textAlign: "center", border: "1px solid #ede9e0", display: "flex", flexDirection: "column", gap: 6 }}>
      <input value={val} onChange={e => setVal(e.target.value)} placeholder="✏️"
        style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.7rem", fontWeight: 800, color: val ? "#2d6a4f" : "#c8c2b4", background: "none", border: "none", outline: "none", textAlign: "center", width: "100%" }} />
      <div style={{ fontSize: "0.68rem", color: "#7a7265", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ─── NODO PANEL ───────────────────────────────────────────────────────────────
function NodoPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#f0faf5", borderRadius: 8, border: "1px solid #52b788", overflow: "hidden" }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: "10px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#2d6a4f" }}>📖 Definición de Nodo Territorial</span>
        <span style={{ color: "#52b788", fontSize: "0.8rem" }}>{open ? "▲ cerrar" : "▼ ver"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 14px 14px", fontSize: "0.78rem", color: "#1c1c1c", lineHeight: 1.6 }}>
          <p style={{ marginBottom: 8 }}>Un <strong>Nodo Territorial</strong> es el punto de presencia física y humana de CultivoRED. Es donde la plataforma deja de ser digital y se convierte en confianza real: se registran emprendedores, se valida la oferta, se activan eventos y se construyen relaciones.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
            {[["🔥 Activa", "Identifica emprendedores y los incorpora con su nivel de madurez (Semilla → Raíz)"],
              ["✅ Valida", "Verifica la oferta, emite el Sello de Origen y garantiza estándares de calidad"],
              ["🔗 Conecta", "Enlaza emprendedores con aliados, patrocinadores y el Hub Central de MásPorTIC"]
            ].map(([t, d]) => (
              <div key={t} style={{ background: "#fff", borderRadius: 7, padding: "10px 12px", border: "1px solid #95d5b2" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#2d6a4f", marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: "0.72rem", color: "#4a4a4a", lineHeight: 1.45 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ESTADO INICIAL ───────────────────────────────────────────────────────────
const INITIAL = {
  territorio: "", duracion: "8 semanas",
  vision: "CultivoRED es una plataforma híbrida, social y transaccional, basada en confianza territorial, que conecta emprendedores, aliados y mercados para generar valor económico y social sostenible.",
  objetivo: "Consolidar CultivoRED como la plataforma de fortalecimiento del emprendimiento rural y un área con estructura y equipo en MásPorTIC.",
  exito: ["", "", "", ""],
  hips: [
    { enunciado: "Los emprendedores rurales se registran y perfilan con apoyo del Líder Territorial usando WhatsApp como canal primario en menos de 1 semana.", valida: "", indicador: "" },
    { enunciado: "El Líder Territorial puede verificar y publicar una oferta con Sello de Origen en menos de 1 semana desde el registro.", valida: "", indicador: "" },
    { enunciado: "Un aliado institucional o patrocinador confía en la oferta verificada y se vincula formalmente a la red dentro del periodo del piloto.", valida: "", indicador: "" },
    { enunciado: "", valida: "", indicador: "" },
  ],
  metaEmp: "", metaNodos: "", metaSem: "",
  lideres: ["", "", "", "", "", ""],
  assetExtra: "",
  brechas: [
    { icon: "🗺️", nombre: "Propuestas de valor definidas y testeadas", sol: "", resp: "" },
    { icon: "🧭", nombre: "Journey del emprendedor diseñado", sol: "", resp: "" },
    { icon: "📣", nombre: "Metodologías de captación definidas", sol: "", resp: "" },
    { icon: "📍", nombre: "Territorio piloto definido", sol: "", resp: "" },
    { icon: "👤", nombre: "Líder Territorial del nodo asignado", sol: "", resp: "" },
    { icon: "🤝", nombre: "Aliado institucional o patrocinador confirmado", sol: "", resp: "" },
    { icon: "🌿", nombre: "Vitrina del Agro funcional", sol: "", resp: "" },
    { icon: "🤖", nombre: "Juli AI (por desarrollar)", sol: "", resp: "" },
    { icon: "📋", nombre: "Protocolos de validación y Sello de Origen", sol: "", resp: "" },
    { icon: "🔄", nombre: "Flujos operativos documentados", sol: "", resp: "" },
    { icon: "💰", nombre: "Presupuesto de activación", sol: "", resp: "" },
  ],
  brechasExtra: [],
  tareas: [
    { texto: "T1a — Definir qué vamos a ofrecer a los emprendedores que se registren (propuesta de valor)", responsable: "Equipo", fecha: "Viernes", done: false },
    { texto: "T1b — Diseñar el journey de cada tipo de cliente/emprendedor en CultivoRED", responsable: "Kevin + Moni Molano", fecha: "Taller UX — marzo", done: false },
    { texto: "T1c — Definir metodologías para captar nuevos emprendedores rurales", responsable: "Equipo", fecha: "Viernes", done: false },
    { texto: "T2 — Construir roadmap con sprints una vez definidas las propuestas de valor (objetivo: activar primer Nodo Territorial)", responsable: "Kevin", fecha: "Después del viernes", done: false },
    { texto: "T3 — Definir actividades para activar los chats de CultivoRED y arrancar estrategia de expectativa con la comunidad activa", responsable: "Equipo", fecha: "Viernes — primer día de activación", done: false },
    { texto: "Elegir invitados para validar pitch de CultivoRED", responsable: "Eliana", fecha: "", done: false },
    { texto: "Crear encuestas para estudios de mercado y validar la propuesta de valor", responsable: "", fecha: "", done: false },
    { texto: "Crear pitch de CultivoRED para cada propuesta de valor", responsable: "Kevin", fecha: "", done: false },
    { texto: "Crear visuales del pitch para CultivoRED", responsable: "Equipo de comunicaciones y marketing", fecha: "", done: false },
    { texto: "Taller de experiencia de usuario para el desarrollo — primera semana de marzo", responsable: "Kevin y Moni Molano", fecha: "Primera semana de marzo", done: false },
    { texto: "Mapeo de actores (sale del taller del miércoles — montar en unidad compartida CultivoRED)", responsable: "", fecha: "", done: false },
  ],
  tareasExtra: [],
  semanaExtras: [[], [], [], []],
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function CultivoRED() {
  // 1. Cargamos el estado inicial desde el navegador (si existe) o usamos INITIAL
  const [s, setS] = useState(() => {
    try {
      const guardado = window.localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : INITIAL;
    } catch (error) {
      return INITIAL;
    }
  });

  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);

  // 2. Autoguardado: Cada vez que el estado 's' cambia, lo guardamos en el navegador
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (e) {
      console.error("No se pudo guardar localmente", e);
    }
  }, [s]);

  const upd = (key, val) => setS(p => ({ ...p, [key]: val }));
  const updArr = (key, i, val) => setS(p => ({ ...p, [key]: p[key].map((e, j) => j === i ? val : e) }));
  const updObj = (key, i, field, val) => setS(p => ({ ...p, [key]: p[key].map((e, j) => j === i ? { ...e, [field]: val } : e) }));

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // ── EXPORTAR ──────────────────────────────────────────────────────────────
  const exportar = () => {
    try {
      const payload = JSON.stringify({ _version: "v4", _fecha: new Date().toISOString(), ...s }, null, 2);
      const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cultivored-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast("✅ Tablero exportado — revisá tu carpeta de Descargas");
    } catch (e) {
      showToast("❌ Error al exportar: " + e.message, false);
    }
  };

  // ── IMPORTAR ──────────────────────────────────────────────────────────────
  const importar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const raw = ev.target.result;
        const parsed = JSON.parse(raw);
        // limpiar campos de versión antes de mergear
        const { _version, _fecha, ...datos } = parsed;
        // merge con estado inicial para no perder claves nuevas
        setS(prev => ({ ...INITIAL, ...datos }));
        showToast("✅ Tablero restaurado correctamente");
      } catch (err) {
        showToast("❌ Archivo inválido — asegurate de usar un JSON exportado desde este tablero", false);
      }
    };
    reader.onerror = () => showToast("❌ No se pudo leer el archivo", false);
    reader.readAsText(file);
    // reset para permitir reimportar el mismo archivo
    e.target.value = "";
  };

  const btnStyle = (primary) => ({
    fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.72rem",
    padding: "8px 16px", borderRadius: 8, cursor: "pointer", letterSpacing: "0.5px",
    display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.15s",
    background: primary ? "#fbbf24" : "rgba(255,255,255,0.12)",
    color: primary ? "#1c1c1c" : "#fff",
    border: primary ? "none" : "1.5px solid rgba(255,255,255,0.3)",
  });

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#fefdf8", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; }
        textarea, input { font-family: 'DM Sans', sans-serif; }
        button:hover { opacity: 0.85; }
      `}</style>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: toast.ok ? "#2d6a4f" : "#c0392b", color: "#fff",
          padding: "10px 22px", borderRadius: 10,
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.82rem",
          zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", whiteSpace: "nowrap",
          animation: "fadeIn 0.2s ease",
        }}>
          {toast.msg}
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>

      {/* ── HEADER ── */}
      <div style={{ background: "#2d6a4f", padding: "32px 44px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "#52b788", borderRadius: "50%", opacity: 0.18 }} />
        <div style={{ position: "absolute", bottom: -60, left: "42%", width: 160, height: 160, background: "#95d5b2", borderRadius: "50%", opacity: 0.13 }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: -0.5 }}>
              Cultivo<span style={{ color: "#95d5b2" }}>RED</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.84rem", marginTop: 5, fontWeight: 300 }}>
              Plataforma social y territorial de emprendimiento rural — MásPorTIC
            </div>
          </div>

          {/* GUARDAR / CARGAR */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={exportar} style={btnStyle(true)}>⬇️ Exportar JSON</button>
            <button onClick={() => fileRef.current && fileRef.current.click()} style={btnStyle(false)}>⬆️ Importar JSON</button>
            <input ref={fileRef} type="file" accept=".json,application/json" onChange={importar} style={{ display: "none" }} />
            <div style={{ background: "#fbbf24", color: "#1c1c1c", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.68rem", padding: "6px 14px", borderRadius: 20, letterSpacing: 1, textTransform: "uppercase" }}>🌱 Piloto</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, marginTop: 18, position: "relative", zIndex: 1, flexWrap: "wrap" }}>
          {[["Territorio", "territorio", "Por definir..."], ["Duración", "duracion", "ej. 8 semanas"]].map(([lbl, key, ph]) => (
            <div key={key}>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 500 }}>{lbl}</div>
              <input value={s[key]} onChange={e => upd(key, e.target.value)} placeholder={ph}
                style={{ background: "none", border: "none", borderBottom: "1px dashed rgba(149,213,178,0.45)", color: "#95d5b2", fontSize: "0.88rem", fontFamily: "'DM Sans',sans-serif", outline: "none", marginTop: 2, width: 160 }} />
            </div>
          ))}
          <div>
            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 500 }}>Versión</div>
            <div style={{ color: "#fff", fontSize: "0.88rem", marginTop: 2 }}>v4 — Co-creación</div>
          </div>
        </div>
      </div>

      {/* ── INSTRUCCIONES ── */}
      <div style={{ background: "#1a4731", padding: "9px 44px", display: "flex", alignItems: "center", gap: 10 }}>
        <span>💾</span>
        <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.65)" }}>
          <strong style={{ color: "#95d5b2" }}>Autoguardado activado:</strong> Tus cambios se guardan solos en este navegador. Usá
          <strong style={{ color: "#fbbf24" }}> Exportar JSON </strong> para descargar una copia de seguridad o compartirla con el equipo.
        </span>
      </div>

      {/* ── STRIP MÉTODO ── */}
      <div style={{ background: "#1c1c1c", padding: "11px 44px", display: "flex", alignItems: "center", overflowX: "auto", gap: 0 }}>
        {["ESTRATEGIA", "HIPÓTESIS", "DISEÑO DEL PILOTO", "ACTIVOS", "BRECHAS", "RUTA", "TAREAS"].map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#52b788", color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 6 }}>{i + 1}</div>
            <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.6)" }}>{label}</span>
            {i < 6 && <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 10px" }}>→</span>}
          </div>
        ))}
      </div>

      {/* ── GRID ── */}
      <div style={{ padding: "26px 44px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* B1 */}
        <Block num="01" tag="🎯 Estratégico" title="¿Hacia dónde va CultivoRED?" subtitle="Norte social, misión y criterios de éxito" accent="#2d6a4f" bg="#f0faf5">
          <div style={{ background: "linear-gradient(135deg,#2d6a4f,#1a4731)", borderRadius: 8, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -8, left: 6, fontSize: "5rem", fontFamily: "'Syne',sans-serif", color: "rgba(255,255,255,0.05)", lineHeight: 1 }}>"</div>
            <div style={{ fontSize: "0.58rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "#95d5b2", fontWeight: 700, marginBottom: 6 }}>Visión</div>
            <textarea value={s.vision} onChange={e => upd("vision", e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.86rem", lineHeight: 1.55, width: "100%", resize: "none", fontFamily: "'DM Sans',sans-serif", minHeight: 72, position: "relative", zIndex: 1 }} />
          </div>
          <div>
            <Label>Objetivo del piloto</Label>
            <EditField value={s.objetivo} onChange={v => upd("objetivo", v)} multiline />
          </div>
          <div>
            <Label>Criterios mínimos de éxito</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["Emprendedores vinculados", 0], ["Aliados activados", 1], ["Nodos operando", 2], ["Semanas del piloto", 3]].map(([lbl, idx]) => (
                <div key={lbl} style={{ background: "#ecfdf5", borderRadius: 7, padding: "9px 10px", borderLeft: "3px solid #52b788" }}>
                  <div style={{ fontSize: "0.58rem", color: "#2d6a4f", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{lbl}</div>
                  <EditField value={s.exito[idx]} onChange={v => updArr("exito", idx, v)} placeholder="✏️ Definir..." />
                </div>
              ))}
            </div>
          </div>
          <NodoPanel />
        </Block>

        {/* B2 */}
        <Block num="02" tag="🔬 Lean Startup" title="Hipótesis a validar" subtitle="¿Qué creemos que es verdad? ¿Cómo lo demostramos?" accent="#92400e" bg="#fffbeb">
          {["H1 — Registro y perfilamiento", "H2 — Validación de oferta y Sello de Origen", "H3 — Vinculación de aliado institucional", "H4 — (El equipo agrega)"].map((label, i) => (
            <HipCard key={i} label={label} faded={i === 3}
              enunciado={s.hips[i].enunciado} onEnunciado={v => updObj("hips", i, "enunciado", v)}
              valida={s.hips[i].valida} onValida={v => updObj("hips", i, "valida", v)}
              indicador={s.hips[i].indicador} onIndicador={v => updObj("hips", i, "indicador", v)} />
          ))}
        </Block>

        {/* B3 */}
        <Block num="03" tag="🗺️ Diseño del Piloto" title="¿Qué vamos a hacer exactamente?" subtitle="Componentes operativos, meta mínima y líderes territoriales" accent="#2b6cb0" bg="#eff6ff" fullWidth>
          <div>
            <Label>Meta mínima de éxito (MVP del piloto)</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 4 }}>
              <MetaCard label="Emprendedores vinculados" val={s.metaEmp} setVal={v => upd("metaEmp", v)} />
              <MetaCard label="Nodos operando" val={s.metaNodos} setVal={v => upd("metaNodos", v)} />
              <MetaCard label="Semanas de duración" val={s.metaSem} setVal={v => upd("metaSem", v)} />
            </div>
          </div>
          <Divider />
          <Label>Componentes operativos del piloto</Label>
          {[
            ["🏘️", "Nodo Territorial", "Espacio físico-digital con Líder Territorial asignado", 0],
            ["📋", "Registro y Perfilamiento", "Líder Territorial + WhatsApp como canal primario", 1],
            ["✅", "Validación de Oferta", "Protocolo del Líder + Sello de Origen", 2],
            ["🌿", "Vitrina del Agro", "Publicación de oferta verificada para aliados", 3],
            ["🤝", "Aliado o Patrocinador", "Organización que se vincula formalmente a la red", 4],
            ["🎉", "Evento de Activación", "Lanzamiento presencial del nodo territorial", 5],
          ].map(([ic, nom, desc, idx], i, arr) => (
            <CompRow key={nom} icon={ic} nombre={nom} desc={desc}
              lider={s.lideres[idx]} setLider={v => updArr("lideres", idx, v)} last={i === arr.length - 1} />
          ))}
        </Block>

        {/* B4 */}
        <Block num="04" tag="✅ Inventario" title="Lo que ya tenemos" subtitle="No arrancamos de cero — disponible hoy" accent="#166534" bg="#f0fdf4">
          {[
            ["📊", 'BMC "Semilla de mi negocio" definido', "listo"],
            ["🌱", "Sistema de niveles (Semilla → Raíz)", "listo"],
            ["🤝", "Red de aliados MásPorTIC (CRAV, GIZ, programas activos)", "listo"],
            ["🎯", "Segmentos y propuesta de valor definidos", "listo"],
            ["📡", "Canales identificados por segmento", "listo"],
            ["📖", "Definición de Nodo Territorial construida", "listo"],
            ["👥", "Comunidad activa lista para registrar", "listo"],
            ["🤖", "Juli AI — plataforma digital de registro", "dev"],
            ["🌿", "Vitrina del Agro", "dev"],
          ].map(([icon, label, estado]) => <AssetItem key={label} icon={icon} label={label} estado={estado} />)}
          <div style={{ marginTop: 4 }}>
            <Label>¿Qué más tiene el equipo? (el equipo agrega)</Label>
            <EditField value={s.assetExtra} onChange={v => upd("assetExtra", v)} multiline placeholder="✏️ Agregá activos adicionales..." />
          </div>
        </Block>

        {/* B5 */}
        <Block num="05" tag="❌ Diagnóstico" title="Lo que nos falta" subtitle="Brechas críticas para arrancar el piloto" accent="#c0392b" bg="#fff5f5">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.3fr", gap: 8, paddingBottom: 7, borderBottom: "1px solid #ede9e0" }}>
            {["Brecha", "¿Cómo la resolvemos?", "Responsable"].map(h => (
              <div key={h} style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#7a7265" }}>{h}</div>
            ))}
          </div>
          {s.brechas.map((br, i) => (
            <BrechaRow key={i} editable={false} icon={br.icon} nombre={br.nombre}
              sol={br.sol} setSol={v => updObj("brechas", i, "sol", v)}
              resp={br.resp} setResp={v => updObj("brechas", i, "resp", v)} />
          ))}
          {s.brechasExtra.map((br, i) => (
            <BrechaRow key={"ex" + i} editable nombre={br.nombre}
              onNombre={v => updObj("brechasExtra", i, "nombre", v)}
              sol={br.sol} setSol={v => updObj("brechasExtra", i, "sol", v)}
              resp={br.resp} setResp={v => updObj("brechasExtra", i, "resp", v)} />
          ))}
          <button onClick={() => upd("brechasExtra", [...s.brechasExtra, { icon: "➕", nombre: "", sol: "", resp: "" }])}
            style={{ fontSize: "0.72rem", color: "#c0392b", background: "none", border: "1px dashed #c0392b", borderRadius: 6, padding: "6px 12px", cursor: "pointer", marginTop: 4, opacity: 0.7 }}>
            + Agregar brecha
          </button>
        </Block>

        {/* B6 */}
        <Block num="06" tag="⚡ Ejecución" title="Ruta del piloto — 8 semanas" subtitle="Las fechas exactas se definen en la sesión de co-creación" accent="#5b21b6" bg="#f5f3ff" fullWidth>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {[
              ["Semanas 1–2", "DEFINIR", ["📍 Territorio piloto seleccionado", "🤝 Aliado o patrocinador identificado", "👤 Líder Territorial asignado", "🗺️ Propuestas de valor definidas"], 0],
              ["Semanas 3–4", "PREPARAR", ["✅ Protocolos de validación diseñados", "🌿 Vitrina mínima funcional", "📋 Flujos documentados", "📣 Estrategia de expectativa lanzada"], 1],
              ["Semanas 5–6", "ACTIVAR", ["🎉 Evento de lanzamiento del nodo", "🌱 Primeros emprendedores vinculados", "🏷️ Kit territorial listo", "🤖 Juli AI en desarrollo (paralelo)"], 2],
              ["Semanas 7–8", "MEDIR", ["📦 Primeras ofertas validadas", "🤝 Primera vinculación de aliado", "📊 Métricas del piloto revisadas", "🔁 Decisión: ¿escalamos?"], 3],
            ].map(([semana, fase, items, idx]) => (
              <SemanaCol key={fase} semana={semana} fase={fase} items={items}
                extras={s.semanaExtras[idx]}
                setExtras={v => upd("semanaExtras", s.semanaExtras.map((e, j) => j === idx ? v : e))} />
            ))}
          </div>
        </Block>

        {/* B7 */}
        <Block num="07" tag="📌 Acuerdos del equipo" title="Tareas pendientes" subtitle="Clic en ✓ para marcar como listo — todo editable" accent="#b7791f" bg="#fffbeb" fullWidth>
          <div style={{ background: "#fef3c7", borderRadius: 8, padding: "12px 16px", border: "1px solid #f6ad55", marginBottom: 4 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.78rem", fontWeight: 700, color: "#92400e", marginBottom: 6 }}>🗓️ Próximo hito: Viernes — primer día de activación de CultivoRED</div>
            <div style={{ fontSize: "0.76rem", color: "#1c1c1c", lineHeight: 1.55 }}>
              "El viernes les traigo un avance sobre los tres puntos de la Tarea 1, y espero ese sea el primer día en el que arranquemos la activación de CultivoRED."
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8, paddingBottom: 7, borderBottom: "1px solid #ede9e0" }}>
            {["Tarea", "Responsable", "Fecha"].map(h => (
              <div key={h} style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#7a7265" }}>{h}</div>
            ))}
          </div>
          {s.tareas.map((t, i) => (
            <TareaItem key={i}
              texto={t.texto} onTexto={v => updObj("tareas", i, "texto", v)}
              responsable={t.responsable} onResponsable={v => updObj("tareas", i, "responsable", v)}
              fecha={t.fecha} onFecha={v => updObj("tareas", i, "fecha", v)}
              done={t.done} onDone={v => updObj("tareas", i, "done", v)} />
          ))}
          {s.tareasExtra.map((t, i) => (
            <TareaItem key={"ex" + i}
              texto={t.texto} onTexto={v => updObj("tareasExtra", i, "texto", v)}
              responsable={t.responsable} onResponsable={v => updObj("tareasExtra", i, "responsable", v)}
              fecha={t.fecha} onFecha={v => updObj("tareasExtra", i, "fecha", v)}
              done={t.done} onDone={v => updObj("tareasExtra", i, "done", v)} />
          ))}
          <button onClick={() => upd("tareasExtra", [...s.tareasExtra, { texto: "", responsable: "", fecha: "", done: false }])}
            style={{ fontSize: "0.72rem", color: "#b7791f", background: "none", border: "1px dashed #b7791f", borderRadius: 6, padding: "6px 12px", cursor: "pointer", marginTop: 4, opacity: 0.7 }}>
            + Agregar tarea
          </button>
        </Block>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: "#1c1c1c", margin: "0 44px 48px", borderRadius: 12, padding: "16px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: "1.4rem" }}>💾</span>
        <p style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.55, margin: 0 }}>
          <strong style={{ color: "#95d5b2" }}>Flujo de guardado:</strong> Editá cualquier campo →
          <strong style={{ color: "#fbbf24" }}> Exportar JSON </strong>(botón arriba, descarga el archivo) →
          próxima sesión abrí el tablero y usá <strong style={{ color: "#fff" }}>Importar JSON</strong> para restaurar el 100% del contenido.
        </p>
      </div>
    </div>
  );
}
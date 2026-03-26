import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── 🔑 CREDENCIALES SUPABASE ─────────────────────────────────────────────────
const SUPABASE_URL = "https://dgbajcrlotqsqdzstcdk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnYmFqY3Jsb3Rxc3FkenN0Y2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MTY1OTAsImV4cCI6MjA4ODk5MjU5MH0.3Mx9lIPjiVwKdpXJqtoiiFlIhjsaRzH89byXGPGKfSo";
// ─────────────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const DB_ID = "cultivored_v10";

// ─── EDITABLE FIELD (Auto-expandible) ─────────────────────────────────────────
function EditField({ value, onChange, placeholder = "✏️...", multiline = false, bgFocused = "#fffef7", bgBlur = "#faf8f2", textColor = "#1c1c1c" }) {
  const [focused, setFocused] = useState(false);
  const isWhiteText = textColor === "#ffffff";
  const textareaRef = useRef(null);

  useEffect(() => {
    if (multiline && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value, multiline]);

  const base = {
    width: "100%", boxSizing: "border-box",
    background: focused ? bgFocused : bgBlur,
    border: `1.5px dashed ${focused ? (isWhiteText ? "rgba(255,255,255,0.6)" : "#52B788") : "transparent"}`,
    borderRadius: 6, padding: "8px 10px",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
    color: value ? textColor : (isWhiteText ? "rgba(255,255,255,0.7)" : "#9a9485"),
    outline: "none", minHeight: multiline ? 44 : 28,
    transition: "border-color 0.2s, background 0.2s",
    lineHeight: 1.45, resize: "none", overflow: "hidden",
  };

  return multiline
    ? <textarea ref={textareaRef} style={base} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    : <input style={base} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
}

// ─── COMPONENTES UI ───────────────────────────────────────────────────────────
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
        <EditField key={i} value={item || ""} multiline bgBlur={bgField} bgFocused="#fff"
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

const PALETTE = [
  { bg: "#ffffff", textC: "#1c1c1c" },
  { bg: "#6b21a8", textC: "#ffffff" },
  { bg: "#059669", textC: "#ffffff" },
  { bg: "#d1d5db", textC: "#1c1c1c" },
  { bg: "#f87171", textC: "#1c1c1c" },
  { bg: "#fb923c", textC: "#1c1c1c" },
  { bg: "#bbf7d0", textC: "#1c1c1c" },
];

function ColorCardList({ list = [], setList, placeholder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {list.map((item, i) => (
        <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${item.bg === "#ffffff" ? "#e5e7eb" : item.bg}`, background: item.bg || "#ffffff" }}>
          <EditField
            value={item.text || ""} multiline bgBlur="transparent" bgFocused="rgba(0,0,0,0.05)"
            textColor={item.textC || "#1c1c1c"}
            onChange={val => { const n = [...list]; n[i] = { ...n[i], text: val }; setList(n); }}
            placeholder={placeholder} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 5, padding: "0 8px 8px", opacity: 0.8 }}>
            {PALETTE.map((c, cIdx) => (
              <div key={cIdx}
                onClick={() => { const n = [...list]; n[i] = { ...n[i], bg: c.bg, textC: c.textC }; setList(n); }}
                style={{ width: 14, height: 14, borderRadius: "50%", background: c.bg, border: "1px solid rgba(0,0,0,0.2)", cursor: "pointer" }} />
            ))}
            <div onClick={() => setList(list.filter((_, j) => j !== i))} style={{ fontSize: "11px", cursor: "pointer", marginLeft: 6 }}>❌</div>
          </div>
        </div>
      ))}
      <button onClick={() => setList([...list, { text: "", bg: "#ffffff", textC: "#1c1c1c" }])}
        style={{ fontSize: "0.68rem", color: "#6b6459", background: "none", border: "1px dashed #c8c2b4", borderRadius: 6, padding: "6px", cursor: "pointer", opacity: 0.8, marginTop: 2 }}>
        + Agregar bloque
      </button>
    </div>
  );
}

function PVSegmentos({ s, upd }) {
  const dolorRow = (txt, color) => (
    <div style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"7px 10px", borderRadius:7, background:`${color}12`, borderLeft:`3px solid ${color}`, fontSize:"0.76rem", color:"#1c1c1c", lineHeight:1.45 }}>
      <span style={{ color, fontWeight:800, flexShrink:0, marginTop:1 }}>✓</span>{txt}
    </div>
  );
  const rowLabel = { fontSize:"0.58rem", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color:"#7a7265", marginBottom:4 };
  const ta = (borderColor, color = "#1c1c1c", minH = 72) => ({
    width:"100%", boxSizing:"border-box", background:"#fffef7",
    border:`1.5px dashed ${borderColor}`, borderRadius:6, padding:"8px 10px",
    fontFamily:"'DM Sans',sans-serif", fontSize:"0.8rem", color,
    outline:"none", minHeight:minH, lineHeight:1.55, resize:"vertical",
  });
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18, marginBottom:32 }}>
      <div style={{ background:"linear-gradient(135deg,#1a4731,#2d6a4f)", borderRadius:12, padding:"18px 24px", display:"flex", alignItems:"center", gap:14 }}>
        <span style={{ fontSize:"1.8rem" }}>🎯</span>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1rem", color:"#fff", marginBottom:3 }}>Propuestas de Valor por Segmento — Piloto Bucaramanga T1</div>
          <div style={{ fontSize:"0.73rem", color:"rgba(149,213,178,0.85)", lineHeight:1.4 }}>Encaje entre lo que necesita el emprendedor rural y lo que CultivoRED ofrece. Editá los campos directamente.</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>

        {/* SEMILLA */}
        <div style={{ background:"#f0faf5", borderRadius:14, border:"2px solid #b7e4c7", padding:"22px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#52b788", color:"#fff", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"0.72rem", letterSpacing:"1.5px", textTransform:"uppercase", padding:"5px 14px", borderRadius:20, marginBottom:4 }}>🌱 Semilla</div>
            <div style={{ fontSize:"0.7rem", color:"#2d6a4f", fontWeight:500, marginTop:2 }}>Emprendedor rural que apenas empieza</div>
          </div>
          <div>
            <div style={rowLabel}>💬 Job to be done</div>
            <div style={{ background:"#fffbeb", border:"1px dashed #f6ad55", borderRadius:8, padding:"10px 12px", fontSize:"0.77rem", color:"#92400e", lineHeight:1.55, fontStyle:"italic" }}>"{s.pvSemillaJob}"</div>
          </div>
          <div>
            <div style={rowLabel}>🎁 Declaración de propuesta de valor</div>
            <textarea value={s.pvSemillaDeclaracion || ""} onChange={e => upd("pvSemillaDeclaracion", e.target.value)} placeholder="✏️ Declaración PV Semilla..." style={ta("#52b788")} />
          </div>
          <div>
            <div style={rowLabel}>❌ Dolores que resuelve → cómo</div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {dolorRow("No sabe usar herramientas digitales → Todo por WhatsApp + Juli AI con lenguaje sencillo", "#52b788")}
              {dolorRow("Desconfianza institucional → Acompañamiento humano del Líder Territorial en campo", "#52b788")}
              {dolorRow("Sin marca ni diferenciación → Sello de Origen + perfil digital en 1 sesión", "#52b788")}
              {dolorRow("No sabe a quién venderle → Red CultivoRED conecta su oferta con compradores verificados", "#52b788")}
            </div>
          </div>
          <div>
            <div style={rowLabel}>✅ Ganancia concreta al terminar las 8 semanas</div>
            <div style={{ background:"#d8f3dc", borderRadius:8, padding:"2px 4px", border:"1px solid #74c69d" }}>
              <textarea value={s.pvSemillaPromesa || ""} onChange={e => upd("pvSemillaPromesa", e.target.value)} placeholder="✏️ ¿Qué tiene el emprendedor al terminar?" style={{ ...ta("transparent","#1b4332",52), background:"transparent", border:"none" }} />
            </div>
          </div>
        </div>

        {/* RAÍZ */}
        <div style={{ background:"#fffbf0", borderRadius:14, border:"2px solid #f6d860", padding:"22px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#b7791f", color:"#fff", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"0.72rem", letterSpacing:"1.5px", textTransform:"uppercase", padding:"5px 14px", borderRadius:20, marginBottom:4 }}>🌳 Raíz</div>
            <div style={{ fontSize:"0.7rem", color:"#92400e", fontWeight:500, marginTop:2 }}>Emprendedor rural con negocio ya funcionando</div>
          </div>
          <div>
            <div style={rowLabel}>💬 Job to be done</div>
            <div style={{ background:"#fffbeb", border:"1px dashed #f6ad55", borderRadius:8, padding:"10px 12px", fontSize:"0.77rem", color:"#92400e", lineHeight:1.55, fontStyle:"italic" }}>"{s.pvRaizJob}"</div>
          </div>
          <div>
            <div style={rowLabel}>🎁 Declaración de propuesta de valor</div>
            <textarea value={s.pvRaizDeclaracion || ""} onChange={e => upd("pvRaizDeclaracion", e.target.value)} placeholder="✏️ Declaración PV Raíz..." style={ta("#b7791f")} />
          </div>
          <div>
            <div style={rowLabel}>❌ Dolores que resuelve → cómo</div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {dolorRow("Ingresos inestables por temporada → Clientes recurrentes vía red CultivoRED", "#b7791f")}
              {dolorRow("Dependencia de intermediarios → Venta directa con precio justo negociado por el Nodo Territorial", "#b7791f")}
              {dolorRow("Productos sin diferenciación → Sello de Origen + historia del producto (branding de origen)", "#b7791f")}
              {dolorRow("Sin acceso a mercados grandes → Alianzas activas con compradores verificados en la red", "#b7791f")}
            </div>
          </div>
          <div>
            <div style={rowLabel}>✅ Ganancia concreta al terminar las 8 semanas</div>
            <div style={{ background:"#fef3c7", borderRadius:8, padding:"2px 4px", border:"1px solid #f6ad55" }}>
              <textarea value={s.pvRaizPromesa || ""} onChange={e => upd("pvRaizPromesa", e.target.value)} placeholder="✏️ ¿Qué tiene el emprendedor al terminar?" style={{ ...ta("transparent","#92400e",52), background:"transparent", border:"none" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ flex:1, height:1, background:"#ede9e0" }} />
        <span style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:"#9a9485", whiteSpace:"nowrap" }}>Value Proposition Canvas — Detalle completo</span>
        <div style={{ flex:1, height:1, background:"#ede9e0" }} />
      </div>
    </div>
  );
}

// ─── ESTADO INICIAL ───────────────────────────────────────────────────────────
const INITIAL = {
  nodoTerritorial: "",
  liderTerritorial: "",
  replicador: "",
  semanasPiloto: "8 semanas",
  accionesValidar: "",
  pvSemillaDeclaracion: "CultivoRED es tu primer paso para vender directamente. Desde WhatsApp, con Juli AI y acompañamiento del Líder Territorial, construís tu perfil, encontrás compradores y generás ingresos reales en 8 semanas — sin salir de tu territorio ni necesitar ser experto en tecnología.",
  pvSemillaJob: "Quiero vender lo que produzco sin depender de intermediarios, pero no sé cómo ni por dónde empezar sin que me estafen o me pierda.",
  pvSemillaPromesa: "Después de 8 semanas tenés: perfil digital activo, al menos 1 contacto comprador real y claridad de precio justo para tu producto.",
  pvRaizDeclaracion: "CultivoRED te conecta directamente con hipermercados, empresas y agencias. Con el Sello de Origen y precio justo negociado por el Nodo Territorial, escalás tus ventas con clientes recurrentes — sin intermediarios que se queden con tu ganancia.",
  pvRaizJob: "Yo ya sé producir y vender, pero mis ingresos dependen de la temporada y no tengo cómo llegar a compradores más grandes sin que alguien se quede con la ganancia.",
  pvRaizPromesa: "Después de 8 semanas tenés: al menos 1 acuerdo activo con un comprador verificado, precio justo documentado y visibilidad en la red CultivoRED.",
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
    aliados: [{ text: "• Medios de comunicación alternativos como tradicionales...\n• Cámaras de comercio\n• Cajas de compensación familiar\n• Universidades - Prácticas...\n• Centros de investigación\n• SENA\n• Quienes ofrezcan cursos...\n• Alcaldía locales y de ciudades\n• Compañías de redes sociales, apps...\n• Programas de emprendimiento...\n• Tigo - Millicom\n• Aliados y clientes de MásPorTIC...\n• Cooperación: GIZ, PNUD...\n• Organizadores de ferias", bg: "#ffffff", textC: "#1c1c1c" }],
    recursos: [{ text: "• Contenido educativo para todos los públicos...\n• La plataforma Digital de CultivoRED - Juli IA\n• Comunidad de emprendedores rurales - whatsapp\n• Kits (pendón, afiches, folletos...)\n• Nodos territoriales formados\n• Personas de acercamiento comercial\n• Equipo para despliegue de eventos...\n• Gestionar las comunicaciones - redes sociales\n• Planeación financiera y priorización...\n• Datos georreferenciados y reportes\n• Acuerdo formales firmados...\n• Gestión de la comunidad de cultivoRED\n• Producción audiovisual constante\n• Relacionistas públicos...\n• Formación y capacitación - canal de entrega", bg: "#ffffff", textC: "#1c1c1c" }],
    propuesta: [
      { text: "Acceso a conocimiento\nConexión para aumentar sus transacciones generar dinero\nAcceso a tecnología - Chatbot asesoría\nManera de mejorar su proceso de producción y servicio\nVisibilidad de sus productos y servicios\nApoyo en su formalización y asociatividad - digitalización\nFortalecimiento de capacidades - liderazgo", bg: "#6b21a8", textC: "#ffffff" },
      { text: "Acceso a su segmento de clientes ideales para tener una visibilidad de su servicio o producto.\nEntender a su cliente.\nPilotear nuevos productos que quieran sacar al mercado", bg: "#059669", textC: "#ffffff" },
      { text: "Cumplir la ley que exige la compra de productos frescos al campesino - conectado a su estrategia de responsabilidad social. (beneficios tributarios)\nAcceso a productores con buenas prácticas y reconocidos por MásPorTIC (sello)...", bg: "#d1d5db", textC: "#1c1c1c" },
      { text: "Alianzas de valor con acompañamiento y entrenamiento...\nCumplimiento de planes de desarrollo, Implementación...\nFacilitar ejercicios participativos - codiseño\nIdentificar oportunidades en el campo, diagnóstico...\nCumplimiento de metas especialmente con temas de sostenibilidad...\nPilotos y experimentación para proyectos nuevos.\nCapacitación y apropiación digital a sus beneficiarios...", bg: "#f87171", textC: "#1c1c1c" },
      { text: "Acceso de confianza a vivir experiencias inmersivas, turismo productivo o visitas guiadas en la zona rural de comunidades activas con MásPorTIC para estudiantes, empleados u otros.", bg: "#bbf7d0", textC: "#1c1c1c" },
      { text: "Conectar\nRelacionamiento entre todos los actores\nConfianza en el relacionamiento", bg: "#ffffff", textC: "#1c1c1c" }
    ],
    canales: [
      { text: "Plataforma CultivoRED (Whatsapp comunidades) Juli IA\nEventos promovidos por los nodos territoriales\nDesde los de todos los programas de MásPorTIC como 1,2,3xMiNegocio\nOrganizaciones Ancla que sus proveedores son rurales\nEntidades territoriales, CC, secretarías de desarrollo...\nFacebook - tiktok", bg: "#6b21a8", textC: "#ffffff" },
      { text: "CultivoRed (plataforma), redes sociales\nGremio Agtech\nEventos propios Agro - encuentros, ferias.\nLinkedIN", bg: "#059669", textC: "#ffffff" },
      { text: "Redes sociales, ferias (ANATO, agroferias), eventos presenciales.\nCanal propio vitrina pública (Juli IA plataforma)\nReuniones uno a uno comerciales con portafolio\nNodos regionales MásPorTIC (replicadores - semillas)", bg: "#d1d5db", textC: "#1c1c1c" },
      { text: "SECOP II licitaciones asociadas\nPlataformas de publicación de convocatorias y grants\nConstrucción de propuestas a la medida.\nReportes de impacto sobre realidad rural...\nEventos virtuales, presenciales - networking\nFerias o invitaciones especificas\nReuniones de conexión con entidades.", bg: "#f87171", textC: "#1c1c1c" },
      { text: "Universidades y Colegios: Redes sociales (instagram)\nCorreo electrónico para enviar propuestas y ofrecer\nPlataformas especializadas de turismo y pasadía...\nVoz a voz reuniones virtuales y presenciales\nGremios del sector educativo\nJuli IA plataforma tenga la forma de solicitar el servicio\nPlataformas como Airbnb - experiencias", bg: "#bbf7d0", textC: "#1c1c1c" }
    ],
    segmentos: [
      { text: "Emprendedores rurales\nAgricultores - productores materias primas\nAsociaciones\nPersona/organización que ofrece servicios turismo en zona rural (turismo comunitario)\nPersonas de la zona rural de cualquier edad de desean emprender y tienen una idea", bg: "#6b21a8", textC: "#ffffff" },
      { text: "Proveedores de insumos en el sector rural\nAgtechs al sector rural ofrecen productos y servicios al sector rurales", bg: "#059669", textC: "#ffffff" },
      { text: "Hipermercados que deben comprar el 30% de toda su vitrina de ventas por compra directa a campesinos de Colombia", bg: "#d1d5db", textC: "#1c1c1c" },
      { text: "Megafruvers grandes que son potenciales compradores al productor - campesino\nEmpresas transformadoras que requieren insumos. Y otras empresas como Alquería, Nutresa, Alpina ...\nCooperativas, empresas que tienen comunidades productivas rurales", bg: "#f87171", textC: "#1c1c1c" },
      { text: "Agencias de viaje\nAgencias de cooperación internacional buscando emprendedores de impacto. Ejemplo FAO\nGobiernos, entidades territoriales", bg: "#fb923c", textC: "#1c1c1c" },
      { text: "Personas u organizaciones de la zona urbana interesadas en experiencias rurales", bg: "#bbf7d0", textC: "#1c1c1c" }
    ],
    monetizacion: [
      { text: "• Contratos con el Estado y convocatorias ganadas\n• Cobro plan a proveedores de insumos por marketing digital, visibilización\n• Porcentaje por conectar con proveedores y gestionar sus proveedores\n• Servicio por las experiencias rurales\n• Suscripción por tipos de usuarios emprendedores rurales según los servicios, acceso, según los niveles...", bg: "#ffffff", textC: "#1c1c1c" }
    ],
  }
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function CultivoRED() {
  const [s, setS] = useState(INITIAL);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [syncStatus, setSyncStatus] = useState("cargando");
  const fileRef = useRef(null);
  const saveTimer = useRef(null);
  const isLoading = useRef(true);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // ── CARGAR DESDE SUPABASE AL INICIAR ──────────────────────────────────────
  useEffect(() => {
    async function cargar() {
      setSyncStatus("cargando");
      try {
        const { data, error } = await supabase
          .from("tablero")
          .select("data")
          .eq("id", DB_ID)
          .single();

        if (!error && data?.data && Object.keys(data.data).length > 0) {
          const d = data.data;
          setS({
            ...INITIAL, ...d,
            empatia: { ...INITIAL.empatia, ...(d.empatia || {}) },
            valueProp: { ...INITIAL.valueProp, ...(d.valueProp || {}) },
            bmc: d.bmc || INITIAL.bmc,
          });
        }
      } catch (e) {
        console.error("Error cargando:", e);
        setSyncStatus("error");
        isLoading.current = false;
        return;
      }
      setSyncStatus("guardado");
      isLoading.current = false;
    }
    cargar();
  }, []);

  // ── GUARDAR EN SUPABASE (debounce 1.5s) ───────────────────────────────────
  const guardarEnNube = useCallback(async (estado) => {
    setSyncStatus("guardando");
    try {
      const { error } = await supabase
        .from("tablero")
        .upsert({ id: DB_ID, data: estado, updated_at: new Date().toISOString() });
      setSyncStatus(error ? "error" : "guardado");
      if (error) console.error("Error guardando:", error);
    } catch (e) {
      console.error("Error guardando:", e);
      setSyncStatus("error");
    }
  }, []);

  useEffect(() => {
    if (isLoading.current) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => guardarEnNube(s), 1500);
    return () => clearTimeout(saveTimer.current);
  }, [s, guardarEnNube]);

  const upd = (key, val) => setS(p => ({ ...p, [key]: val }));
  const updObj = (key, i, field, val) => setS(p => ({ ...p, [key]: p[key].map((e, j) => j === i ? { ...e, [field]: val } : e) }));
  const updNested = (parent, key, val) => setS(p => ({ ...p, [parent]: { ...p[parent], [key]: val } }));

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3500); };

  const onDragStart = (e, index) => { setDraggedItemIndex(index); e.dataTransfer.effectAllowed = "move"; };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e, statusDestino) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;
    const nuevas = [...s.tareas];
    nuevas[draggedItemIndex].status = statusDestino;
    upd("tareas", nuevas);
    setDraggedItemIndex(null);
  };

  const exportar = () => {
    try {
      const payload = JSON.stringify({ _version: "v10-supabase", _fecha: new Date().toISOString(), ...s }, null, 2);
      const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `cultivored-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast("✅ Backup descargado");
    } catch (e) { showToast("❌ Error al exportar", false); }
  };

  const importar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const { _version, _fecha, ...datos } = JSON.parse(ev.target.result);
        isLoading.current = false;
        setS({
          ...INITIAL, ...datos,
          empatia: { ...INITIAL.empatia, ...(datos.empatia || {}) },
          valueProp: { ...INITIAL.valueProp, ...(datos.valueProp || {}) },
          bmc: datos.bmc || INITIAL.bmc,
        });
        showToast("✅ Datos importados y sincronizando...");
      } catch { showToast("❌ Archivo inválido", false); }
    };
    reader.readAsText(file); e.target.value = "";
  };

  const syncInfo = {
    cargando: { color: "#f6ad55", text: "⏳ Cargando..." },
    guardando: { color: "#52b788", text: "💾 Guardando..." },
    guardado:  { color: "#95d5b2", text: "☁️ Guardado en la nube" },
    error:     { color: "#fc8181", text: "❌ Sin conexión" },
  }[syncStatus];

  const renderTab = (id, icon, label) => {
    const active = activeTab === id;
    return (
      <button onClick={() => setActiveTab(id)}
        style={{
          background: active ? "#fff" : "transparent", color: active ? "#2d6a4f" : "#fff",
          border: "none", padding: "10px 18px", borderRadius: "8px 8px 0 0", cursor: "pointer",
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.85rem",
          display: "flex", alignItems: "center", gap: 8, transition: "0.2s", opacity: active ? 1 : 0.7,
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
        button:hover { opacity: 0.85; }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: toast.ok ? "#2d6a4f" : "#c0392b", color: "#fff", padding: "10px 22px", borderRadius: 10, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.82rem", zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
          {toast.msg}
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{ background: "#2d6a4f", padding: "32px 44px 0", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
              Cultivo<span style={{ color: "#95d5b2" }}>RED</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.84rem", marginTop: 5 }}>
              Plataforma social y territorial de emprendimiento rural — MásPorTIC
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: "0.7rem", color: syncInfo.color, fontFamily: "'Syne',sans-serif", fontWeight: 600, padding: "6px 12px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>
              {syncInfo.text}
            </div>
            <button onClick={exportar} style={{ background: "#fbbf24", color: "#1c1c1c", border: "none", padding: "8px 16px", borderRadius: 8, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer" }}>⬇️ Backup JSON</button>
            <button onClick={() => fileRef.current && fileRef.current.click()} style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px", borderRadius: 8, fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer" }}>⬆️ Importar JSON</button>
            <input ref={fileRef} type="file" accept=".json" onChange={importar} style={{ display: "none" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, borderBottom: "2px solid #fff" }}>
          {renderTab("dashboard", "🎛️", "Tablero de Control")}
          {renderTab("empatia", "🧠", "Mapa de Empatía")}
          {renderTab("valueProp", "🎁", "Propuesta de Valor")}
          {renderTab("bmc", "🌱", "Semilla de mi Negocio")}
        </div>
      </div>

      <div style={{ padding: "26px 44px 60px" }}>

        {/* ══ PESTAÑA 1: TABLERO ══ */}
        {activeTab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Block num="01" tag="🎯 Estratégico" title="Norte del Piloto" accent="#2d6a4f" bg="#f0faf5">
              <div style={{ background: "#e6f4ea", padding: "14px 18px", borderRadius: 8 }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#1a4731", fontSize: "0.85rem", fontFamily: "'Syne', sans-serif" }}>¿Qué es CultivoRED?</h4>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#2d6a4f", lineHeight: 1.5 }}>Es una plataforma híbrida, social y transaccional, basada en confianza territorial, que conecta emprendedores, clientes y mercados para generar valor económico y social sostenible.</p>
              </div>
              <div style={{ background: "#e6f4ea", padding: "14px 18px", borderRadius: 8 }}>
                <h4 style={{ margin: "0 0 6px 0", color: "#1a4731", fontSize: "0.85rem", fontFamily: "'Syne', sans-serif" }}>¿Qué es un Nodo Territorial?</h4>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#2d6a4f", lineHeight: 1.5 }}>Es el punto de presencia física y humana de CultivoRED. Donde la plataforma deja de ser digital y se convierte en confianza real: se registran emprendedores, se valida oferta, se activan eventos y se construyen relaciones.</p>
              </div>
              <Label>Variables de Validación (Fase 2)</Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  ["📍 Nodo territorial", "nodoTerritorial", "Ej. El Carmen de Viboral"],
                  ["👤 Líder Territorial", "liderTerritorial", "Nombre del líder..."],
                  ["🌱 Replicador", "replicador", "Nombre del replicador..."],
                  ["⏳ Semanas del piloto", "semanasPiloto", "Ej. 8 semanas"],
                ].map(([lbl, key, ph]) => (
                  <div key={key} style={{ background: "#ecfdf5", borderRadius: 7, padding: "9px 10px", borderLeft: "3px solid #52b788" }}>
                    <div style={{ fontSize: "0.58rem", color: "#2d6a4f", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{lbl}</div>
                    <EditField value={s[key] || ""} onChange={v => upd(key, v)} placeholder={ph} />
                  </div>
                ))}
                <div style={{ gridColumn: "1 / -1", background: "#ecfdf5", borderRadius: 7, padding: "9px 10px", borderLeft: "3px solid #52b788" }}>
                  <div style={{ fontSize: "0.58rem", color: "#2d6a4f", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>✅ Acciones a validar</div>
                  <EditField value={s.accionesValidar || ""} onChange={v => upd("accionesValidar", v)} multiline placeholder="¿Qué vamos a validar exactamente en este Nodo?" />
                </div>
              </div>
            </Block>

            <Block num="02" tag="🔬 Lean Startup" title="Hipótesis a Validar (T1)" accent="#92400e" bg="#fffbeb">
              {["H1 — (T1b) Journey", "H2 — (T1a) Valor", "H3 — (T1c) Captación"].map((label, i) => (
                <div key={i} style={{ background: "#fffbeb", borderRadius: 8, borderLeft: "4px solid #f6ad55", padding: "12px", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "0.73rem", fontWeight: 700, color: "#92400e" }}>{label}</div>
                  <EditField value={s.hips?.[i]?.enunciado || ""} onChange={v => updObj("hips", i, "enunciado", v)} multiline />
                </div>
              ))}
            </Block>

            <Block num="03" tag="⚡ Ejecución" title="Ruta del piloto" subtitle="Foco: Validación y Fase 2" accent="#5b21b6" bg="#f5f3ff" fullWidth>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
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
                    {s.semanaExtras?.[idx]?.map((ex, i) => (
                      <EditField key={i} value={ex}
                        onChange={v => upd("semanaExtras", s.semanaExtras.map((e, j) => j === idx ? s.semanaExtras[idx].map((old, k) => k === i ? v : old) : e))} />
                    ))}
                    <button onClick={() => upd("semanaExtras", s.semanaExtras.map((e, j) => j === idx ? [...e, ""] : e))}
                      style={{ fontSize: "0.68rem", color: "#5b21b6", background: "none", border: "1px dashed #5b21b6", borderRadius: 6, cursor: "pointer", padding: "4px" }}>+ Hito</button>
                  </div>
                ))}
              </div>
            </Block>

            <Block num="04" tag="📌 Acuerdos" title="Tablero de Tareas Kanban" subtitle="Arrastra las tarjetas para cambiar su estado" accent="#b7791f" bg="#fffbeb" fullWidth>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
                {[
                  { id: "todo", title: "📝 Por hacer", bg: "#fef3c7", border: "#f59e0b" },
                  { id: "doing", title: "⏳ En proceso", bg: "#e0e7ff", border: "#6366f1" },
                  { id: "done", title: "✅ Completadas", bg: "#dcfce7", border: "#22c55e" },
                ].map(columna => (
                  <div key={columna.id} onDragOver={onDragOver} onDrop={(e) => onDrop(e, columna.id)}
                    style={{ background: "#faf8f2", borderRadius: 10, padding: 12, minHeight: 300, display: "flex", flexDirection: "column", gap: 10, border: "1px solid #ede9e0" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1c1c1c", borderBottom: `2px solid ${columna.border}`, paddingBottom: 8, marginBottom: 4 }}>{columna.title}</div>
                    {s.tareas.map((t, i) => {
                      if (t.status !== columna.id) return null;
                      return (
                        <div key={i} draggable onDragStart={(e) => onDragStart(e, i)}
                          style={{ background: columna.bg, borderRadius: 8, padding: 10, border: `1px solid ${columna.border}`, boxShadow: "0 2px 4px rgba(0,0,0,0.05)", cursor: "grab", display: "flex", flexDirection: "column", gap: 6 }}>
                          <EditField value={t.texto} onChange={v => updObj("tareas", i, "texto", v)} multiline placeholder="Descripción..." bgBlur="transparent" bgFocused="#fff" />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                            <EditField value={t.responsable} onChange={v => updObj("tareas", i, "responsable", v)} placeholder="👤 Resp..." bgBlur="transparent" bgFocused="#fff" />
                            <EditField value={t.fecha} onChange={v => updObj("tareas", i, "fecha", v)} placeholder="📅 Fecha..." bgBlur="transparent" bgFocused="#fff" />
                          </div>
                        </div>
                      );
                    })}
                    {columna.id === "todo" && (
                      <button onClick={() => upd("tareas", [...s.tareas, { texto: "", responsable: "", fecha: "", status: "todo" }])}
                        style={{ background: "transparent", border: "1px dashed #c8c2b4", borderRadius: 8, padding: "8px", color: "#6b6459", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", marginTop: "auto" }}>
                        + Nueva tarea
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Block>
          </div>
        )}

        {/* ══ PESTAÑA 2: MAPA DE EMPATÍA ══ */}
        {activeTab === "empatia" && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 30, boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", margin: 0, color: "#1c1c1c", fontSize: "1.8rem" }}>Mapa de Empatía</h2>
              <p style={{ color: "#6b6459", fontSize: "0.85rem", margin: "5px 0 0" }}>Para entender al Emprendedor Rural antes de diseñar la propuesta.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {[
                ["🤔 ¿Qué piensa y siente?", "piensaSiente", "#fef3c7", "#fcd34d"],
                ["👀 ¿Qué ve?", "ve", "#e0e7ff", "#a5b4fc"],
                ["🗣️ ¿Qué dice y hace?", "diceHace", "#dcfce7", "#86efac"],
                ["👂 ¿Qué escucha?", "escucha", "#fee2e2", "#fca5a5"],
              ].map(([lbl, key, bg, border]) => (
                <div key={key} style={{ background: bg, padding: 20, borderRadius: 12, border: `2px solid ${border}` }}>
                  <Label>{lbl}</Label>
                  <CardList list={s.empatia?.[key]} setList={v => updNested("empatia", key, v)} bgField="#fff" />
                </div>
              ))}
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

        {/* ══ PESTAÑA 3: VALUE PROPOSITION CANVAS ══ */}
        {activeTab === "valueProp" && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 30, boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
            <PVSegmentos s={s} upd={upd} />
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", margin: 0, color: "#1c1c1c", fontSize: "1.8rem" }}>Value Proposition Canvas</h2>
              <p style={{ color: "#6b6459", fontSize: "0.85rem", margin: "5px 0 0" }}>El encaje entre lo que el cliente necesita y lo que CultivoRED ofrece.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
              <div style={{ border: "2px dashed #95d5b2", borderRadius: 12, padding: 24, position: "relative", background: "#f0faf5" }}>
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#2d6a4f", color: "#fff", padding: "4px 14px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap" }}>🎁 TU PROPUESTA DE VALOR</div>
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
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#dc2626", color: "#fff", padding: "4px 14px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap" }}>👤 SEGMENTO DE CLIENTE</div>
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

        {/* ══ PESTAÑA 4: SEMILLA DE MI NEGOCIO (BMC) ══ */}
        {activeTab === "bmc" && (
          <div style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, borderBottom: "3px solid #166534", paddingBottom: 10 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", margin: 0, color: "#166534", fontSize: "1.8rem", flex: 1 }}>Semilla de mi negocio</h2>
              <span style={{ fontSize: "1.5rem" }}>🌱</span>
            </div>
            <div style={{ overflowX: "auto", paddingBottom: "10px" }}>
              <div style={{ minWidth: 1100 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 12, alignItems: "start" }}>
                  <div style={{ background: "#bfdbfe", padding: 14, borderRadius: 8, minHeight: 400 }}>
                    <div style={{ fontWeight: 800, color: "#1e3a8a", fontSize: "0.8rem", marginBottom: 10 }}>🤝 ALIADOS CLAVE</div>
                    <ColorCardList list={s.bmc?.aliados} setList={v => updNested("bmc", "aliados", v)} placeholder="Escribe el aliado..." />
                  </div>
                  <div style={{ background: "#60a5fa", padding: 14, borderRadius: 8, minHeight: 400 }}>
                    <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.8rem", marginBottom: 10 }}>🔧 RECURSOS CLAVE</div>
                    <ColorCardList list={s.bmc?.recursos} setList={v => updNested("bmc", "recursos", v)} placeholder="Escribe el recurso..." />
                  </div>
                  <div style={{ background: "#f87171", padding: 14, borderRadius: 8, minHeight: 400 }}>
                    <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.8rem", marginBottom: 10 }}>🎁 PROPUESTA DE VALOR</div>
                    <ColorCardList list={s.bmc?.propuesta} setList={v => updNested("bmc", "propuesta", v)} placeholder="Escribe la propuesta..." />
                  </div>
                  <div style={{ background: "#f87171", padding: 14, borderRadius: 8, minHeight: 400 }}>
                    <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.8rem", marginBottom: 10 }}>📣 CANALES</div>
                    <ColorCardList list={s.bmc?.canales} setList={v => updNested("bmc", "canales", v)} placeholder="Escribe el canal..." />
                  </div>
                  <div style={{ background: "#fde047", padding: 14, borderRadius: 8, minHeight: 400 }}>
                    <div style={{ fontWeight: 800, color: "#854d0e", fontSize: "0.8rem", marginBottom: 10 }}>👤 CLIENTES - SEGMENTOS</div>
                    <ColorCardList list={s.bmc?.segmentos} setList={v => updNested("bmc", "segmentos", v)} placeholder="Escribe el segmento..." />
                  </div>
                </div>
                <div style={{ background: "#10b981", padding: 14, borderRadius: 8, marginTop: 12 }}>
                  <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.8rem", marginBottom: 10 }}>💰 MONETIZACIÓN - FUENTE DE INGRESOS</div>
                  <ColorCardList list={s.bmc?.monetizacion} setList={v => updNested("bmc", "monetizacion", v)} placeholder="Escribe la fuente de ingresos..." />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: "#1c1c1c", margin: "0 44px 48px", borderRadius: 12, padding: "14px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: "1.2rem" }}>☁️</span>
        <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0 }}>
          <strong style={{ color: "#95d5b2" }}>v10 — Guardado en la nube:</strong> Todo el equipo de MásPorTIC comparte los mismos datos al abrir el link.
          Usá <strong style={{ color: "#fbbf24" }}>Backup JSON</strong> para guardar una copia local.
        </p>
      </div>
    </div>
  );
}
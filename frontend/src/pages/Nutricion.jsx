import { Utensils, Lightbulb, CheckCircle2, Clock, Droplets, Scale, Activity, BookOpen, Info } from 'lucide-react';

const categorias = [
  {
    nivel: 'low',
    ig: '< 55',
    label: 'Recomendados',
    emoji: '🟢',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    tagBg: '#d1fae5',
    tagColor: '#065f46',
    grupos: [
      { nombre: 'Legumbres', items: ['Lentejas', 'Garbanzos', 'Frijoles', 'Edamame'] },
      { nombre: 'Verduras', items: ['Brócoli', 'Espinaca', 'Lechuga', 'Pepino', 'Zanahoria'] },
      { nombre: 'Frutas', items: ['Manzana', 'Pera', 'Naranja', 'Durazno', 'Cerezas'] },
      { nombre: 'Cereales', items: ['Avena', 'Cebada', 'Pasta al dente'] },
      { nombre: 'Lácteos', items: ['Yogur natural', 'Leche descremada'] },
      { nombre: 'Semillas', items: ['Almendras', 'Chía', 'Nueces', 'Linaza'] },
    ],
  },
  {
    nivel: 'med',
    ig: '55–70',
    label: 'Con moderación',
    emoji: '🟡',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    tagBg: '#fef3c7',
    tagColor: '#78350f',
    grupos: [
      { nombre: 'Cereales', items: ['Arroz integral', 'Cuscús', 'Pan centeno'] },
      { nombre: 'Frutas', items: ['Plátano maduro', 'Uvas', 'Kiwi', 'Mango'] },
      { nombre: 'Otros', items: ['Papas cocidas', 'Maíz', 'Remolacha', 'Miel'] },
    ],
  },
  {
    nivel: 'high',
    ig: '> 70',
    label: 'Evitar o limitar',
    emoji: '🔴',
    color: '#dc2626',
    bg: '#fff1f2',
    border: '#fecdd3',
    tagBg: '#fee2e2',
    tagColor: '#9f1239',
    grupos: [
      { nombre: 'Harinas', items: ['Pan blanco', 'Arroz blanco', 'Baguette'] },
      { nombre: 'Azúcares', items: ['Gaseosas', 'Jugos industriales', 'Dulces', 'Pasteles'] },
      { nombre: 'Snacks', items: ['Papas fritas', 'Chips', 'Cereales azucarados'] },
    ],
  },
];

const consejos = [
  { icon: <Clock size={18} />, color: '#2563eb', bg: '#dbeafe', titulo: 'Divide tus comidas', texto: 'Haz 5–6 comidas pequeñas al día en lugar de 3 grandes para evitar picos de glucosa.' },
  { icon: <Utensils size={18} />, color: '#059669', bg: '#d1fae5', titulo: 'Fibra primero', texto: 'Come verduras y proteínas antes de los carbohidratos para ralentizar la absorción de glucosa.' },
  { icon: <Droplets size={18} />, color: '#0ea5e9', bg: '#e0f2fe', titulo: 'Hidratación constante', texto: 'Bebe al menos 8 vasos de agua al día. La deshidratación puede elevar la glucosa.' },
  { icon: <Scale size={18} />, color: '#7c3aed', bg: '#ede9fe', titulo: 'Controla las porciones', texto: 'Mitad del plato: verduras. Un cuarto: proteína magra. Un cuarto: carbohidratos integrales.' },
  { icon: <Activity size={18} />, color: '#d97706', bg: '#fef3c7', titulo: 'Ejercicio post-comida', texto: 'Caminar 10–15 min después de comer ayuda a estabilizar la glucosa postprandial.' },
  { icon: <BookOpen size={18} />, color: '#db2777', bg: '#fce7f3', titulo: 'Lee las etiquetas', texto: 'Revisa el contenido de azúcar y carbohidratos por porción en todos los alimentos envasados.' },
];

export default function Nutricion() {
  return (
    <div>
      <div className="page-header">
        <h2>Guía Nutricional</h2>
        <p>Orientación alimentaria para el control de glucosa</p>
      </div>

      {/* ── Escala de IG visual ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Utensils size={16} color="var(--primary)" /> Escala de Índice Glucémico (IG)
        </div>
        <div style={{ display: 'flex', borderRadius: 999, overflow: 'hidden', height: 10, marginBottom: 10 }}>
          <div style={{ flex: 1, background: 'linear-gradient(90deg,#059669,#10b981)' }} />
          <div style={{ flex: 1, background: 'linear-gradient(90deg,#d97706,#f59e0b)' }} />
          <div style={{ flex: 1, background: 'linear-gradient(90deg,#dc2626,#ef4444)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>🟢 Bajo &lt;55</span>
          <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>🟡 Medio 55–70</span>
          <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700 }}>🔴 Alto &gt;70</span>
        </div>
      </div>

      {/* ── Categorías de alimentos ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, marginBottom: 28 }}>
        {categorias.map((cat) => (
          <div key={cat.nivel} style={{
            background: cat.bg, border: `1px solid ${cat.border}`,
            borderRadius: 'var(--radius)', padding: 22,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: cat.color }}>{cat.emoji} IG {cat.ig}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: cat.color, opacity: 0.8, marginTop: 2 }}>{cat.label}</div>
              </div>
            </div>

            {/* Grupos de alimentos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cat.grupos.map((grupo) => (
                <div key={grupo.nombre}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    {grupo.nombre}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {grupo.items.map((item) => (
                      <span key={item} style={{
                        background: cat.tagBg, color: cat.tagColor,
                        border: `1px solid ${cat.border}`,
                        borderRadius: 999, padding: '4px 10px',
                        fontSize: '0.78rem', fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        <CheckCircle2 size={11} color={cat.color} />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Consejos ── */}
      <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Lightbulb size={17} color="var(--amber)" /> Consejos prácticos
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14, marginBottom: 22 }}>
        {consejos.map((c, i) => (
          <div key={c.titulo} className="card" style={{ display: 'flex', gap: 14, padding: 18 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: c.bg, color: c.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 5 }}>{c.titulo}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{c.texto}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Aviso médico ── */}
      <div style={{ display: 'flex', gap: 12, padding: '14px 18px', background: 'var(--blue-bg)', border: '1px solid #bfdbfe', borderRadius: 'var(--radius)' }}>
        <Info size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: '0.84rem', color: 'var(--primary)', lineHeight: 1.6 }}>
          <strong>Aviso médico:</strong> Esta guía es informativa y no reemplaza la orientación de tu médico o nutricionista. Los rangos y recomendaciones pueden variar según tu tipo de diabetes, medicación y condición específica.
        </p>
      </div>
    </div>
  );
}

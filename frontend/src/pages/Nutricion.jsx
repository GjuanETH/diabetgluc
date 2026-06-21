import { Apple, Lightbulb } from 'lucide-react';

const categorias = [
  {
    nivel: 'low',
    titulo: 'Índice Glucémico Bajo (< 55) — Recomendados',
    alimentos: [
      'Legumbres: lentejas, garbanzos, frijoles negros',
      'Verduras: brócoli, espinaca, lechuga, pepino',
      'Frutas: manzana, pera, naranja, durazno',
      'Cereales integrales: avena en hojuelas, cebada',
      'Lácteos: yogur natural sin azúcar, leche descremada',
      'Nueces y semillas: almendras, chía, linaza',
      'Pasta al dente (porción controlada)',
    ],
  },
  {
    nivel: 'med',
    titulo: 'Índice Glucémico Medio (55–70) — Moderación',
    alimentos: [
      'Arroz integral, cuscús',
      'Pan de centeno, pita integral',
      'Papas cocinadas y enfriadas',
      'Plátano maduro, uvas, kiwi',
      'Jugo de naranja natural (sin azúcar añadida)',
      'Maíz dulce, remolacha',
      'Miel (pequeñas cantidades)',
    ],
  },
  {
    nivel: 'high',
    titulo: 'Índice Glucémico Alto (> 70) — Evitar o limitar',
    alimentos: [
      'Pan blanco, baguette, arroz blanco',
      'Cereales de caja azucarados',
      'Bebidas azucaradas: gaseosas, jugos industriales',
      'Dulces, pasteles, galletas con azúcar',
      'Papas fritas, chips',
      'Cerveza, alcohol destilado con mezcla',
      'Sandía, melón (en grandes cantidades)',
    ],
  },
];

const consejos = [
  { titulo: 'Divide tus comidas', texto: 'Haz 5-6 comidas pequeñas al día en lugar de 3 grandes para evitar picos de glucosa.' },
  { titulo: 'Fibra primero', texto: 'Empieza tus comidas con verduras y proteínas antes de los carbohidratos para ralentizar la absorción de glucosa.' },
  { titulo: 'Hidratación constante', texto: 'Bebe al menos 8 vasos de agua al día. La deshidratación puede elevar la glucosa en sangre.' },
  { titulo: 'Controla las porciones', texto: 'Usa un plato más pequeño. La mitad verduras, un cuarto proteína magra, un cuarto carbohidratos integrales.' },
  { titulo: 'Ejercicio post-comida', texto: 'Caminar 10-15 minutos después de comer ayuda a estabilizar la glucosa postprandial.' },
  { titulo: 'Lee las etiquetas', texto: 'Revisa el contenido de azúcar total y carbohidratos por porción en todos los alimentos envasados.' },
];

export default function Nutricion() {
  return (
    <div>
      <div className="page-header">
        <h2>Guía Nutricional</h2>
        <p>Orientación alimentaria para el control de glucosa</p>
      </div>

      <h3 style={{ fontWeight:700, marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
        <Apple size={18} /> Alimentos por índice glucémico
      </h3>
      <div className="nutrition-grid" style={{ marginBottom:28 }}>
        {categorias.map((c) => (
          <div key={c.nivel} className={`nutrition-card ${c.nivel}`}>
            <h3>{c.titulo}</h3>
            <ul className="nutrition-list">
              {c.alimentos.map((a) => <li key={a}>• {a}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <h3 style={{ fontWeight:700, marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
        <Lightbulb size={18} /> Consejos prácticos diarios
      </h3>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:16 }}>
        {consejos.map((c) => (
          <div key={c.titulo} className="card">
            <div style={{ fontWeight:700, marginBottom:6, color:'var(--primary)' }}>{c.titulo}</div>
            <div style={{ fontSize:'0.875rem', color:'var(--text-muted)', lineHeight:1.6 }}>{c.texto}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop:20, background:'#eff6ff', borderColor:'#bfdbfe' }}>
        <div style={{ fontWeight:700, color:'#1d4ed8', marginBottom:6 }}>Aviso médico</div>
        <p style={{ fontSize:'0.875rem', color:'#1e40af', lineHeight:1.6 }}>
          Esta guía es informativa y no reemplaza la orientación de tu médico o nutricionista.
          Los rangos y recomendaciones pueden variar según tu tipo de diabetes, medicación y condición específica.
          Siempre consulta a tu equipo médico antes de hacer cambios significativos en tu dieta.
        </p>
      </div>
    </div>
  );
}

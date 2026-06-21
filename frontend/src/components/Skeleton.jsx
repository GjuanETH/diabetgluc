export function Skeleton({ height = 20, width = '100%', radius = 6, style = {} }) {
  return <div className="skeleton" style={{ height, width, borderRadius: radius, ...style }} />;
}

export function SkeletonCard({ lines = 2 }) {
  return (
    <div className="card">
      <Skeleton height={14} width="50%" style={{ marginBottom: 12 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={i === 0 ? 36 : 14} width={i === 0 ? '60%' : '40%'} style={{ marginBottom: 8 }} />
      ))}
    </div>
  );
}

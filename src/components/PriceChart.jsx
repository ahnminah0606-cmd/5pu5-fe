import { providerColors } from '../services/data.js';
export function historyChanges(rows, contract, range) {
  const key = contract === 'all' ? 'onDemand' : contract;
  const cutoff = Math.max(1, 30 - range + 1);
  return rows
    .flatMap((row) => {
      const ratio = row[key] / row.onDemand;
      return row.history
        .slice(1)
        .map((p, i) => ({
          provider: row.provider,
          date: p.date,
          from: row.history[i].value * ratio,
          to: p.value * ratio,
        }))
        .filter((p) => Number(p.date.split('/')[1]) >= cutoff);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
export default function PriceChart({ rows, contract, range }) {
  if (!rows.length)
    return (
      <text x="380" y="150" textAnchor="middle" className="axis-label">
        표시할 가격 이력이 없습니다.
      </text>
    );
  const key = contract === 'all' ? 'onDemand' : contract;
  const series = rows.map((row) => {
    const all = row.history.map((p) => ({
      ...p,
      value: (p.value * row[key]) / row.onDemand,
    }));
    const points = all.filter(
      (p) => Number(p.date.split('/')[1]) >= Math.max(1, 30 - range + 1),
    );
    return { ...row, points: points.length ? points : [all.at(-1)] };
  });
  const values = series.flatMap((row) => row.points.map((p) => p.value));
  const min = Math.floor((Math.min(...values) - 0.2) * 10) / 10,
    max = Math.ceil((Math.max(...values) + 0.2) * 10) / 10;
  const xMap = {
    '10/01': 70,
    '10/10': 285,
    '10/15': 400,
    '10/20': 520,
    '10/30': 700,
  };
  const x = (date) =>
    xMap[date] || 70 + ((Number(date.split('/')[1]) - 1) / 29) * 630;
  const y = (value) => 245 - ((value - min) / (max - min || 1)) * 185;
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <line
            x1="70"
            y1={60 + (i * 185) / 4}
            x2="710"
            y2={60 + (i * 185) / 4}
            className="grid-line"
          />
          <text
            x="58"
            y={64 + (i * 185) / 4}
            textAnchor="end"
            className="axis-label"
          >
            {(max - (i * (max - min)) / 4).toFixed(1)}
          </text>
        </g>
      ))}
      {Object.keys(xMap).map((date) => (
        <text
          key={date}
          x={x(date)}
          y="270"
          textAnchor="middle"
          className="axis-label"
        >
          {date}
        </text>
      ))}
      <line x1="70" y1="245" x2="710" y2="245" className="axis-line" />
      {series.map((row) => (
        <g key={row.provider}>
          <path
            d={`M ${x(row.points[0].date)} ${y(row.points[0].value)}${row.points
              .slice(1)
              .map((p) => ` H ${x(p.date)} V ${y(p.value)}`)
              .join('')} H 710`}
            className="chart-line"
            stroke={providerColors[row.provider]}
          />
          {row.points.map((p, i) => (
            <g key={p.date}>
              <circle
                cx={x(p.date)}
                cy={y(p.value)}
                r="5"
                fill={providerColors[row.provider]}
                className="chart-point"
              />
              <text
                x={x(p.date) + 8}
                y={y(p.value) - 10}
                fill={providerColors[row.provider]}
                className="chart-price"
              >
                {p.value.toFixed(2)}
              </text>
              {i > 0 && (
                <text
                  x={x(p.date) + 8}
                  y={y(p.value) + 17}
                  fill={providerColors[row.provider]}
                  className="change-label"
                >
                  {((p.value / row.points[i - 1].value - 1) * 100).toFixed(1)}%
                </text>
              )}
            </g>
          ))}
        </g>
      ))}
    </>
  );
}

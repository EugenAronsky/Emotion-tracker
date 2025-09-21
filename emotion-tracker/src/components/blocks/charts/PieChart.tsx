import { Cell, Pie, PieChart } from "recharts";

const data = [
  { name: "😡", value: 400 },
  { name: "😢", value: 300 },
  { name: "🤨", value: 300 },
  { name: "😊", value: 200 },
  { name: "😍", value: 100 },
];
const COLORS = ["#ff5c5c", "#5c6cff", "#fff761", "#7efc6a", "#d061ff"];

export default function Example() {
  return (
    <PieChart width={300} height={160}>
      <Pie
        cy={110}
        data={data}
        endAngle={-20}
        startAngle={200}
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
        fill="#8884d8"
        label={({ name, value, percent, x, y }) => (
          <text
            x={x}
            y={y}
            fill="#111"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={26}
          >
            {name}
          </text>
        )}
      >
        {data.map((entry, index) => (
          <Cell
            onClick={() => console.log("some")}
            key={`cell-${entry.name}`}
            fill={COLORS[index % COLORS.length]}
            className="focus:brightness-90"
          />
        ))}
      </Pie>
    </PieChart>
  );
}

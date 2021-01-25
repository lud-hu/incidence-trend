import { formatDate } from "./formatter";

const CustomizedAxisTick = (props: any) => {
  // eslint-disable-next-line
  const { x, y, stroke, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
      >
        {formatDate(payload.value)}
      </text>
    </g>
  );
};

export default CustomizedAxisTick;

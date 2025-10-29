/** @jsx createElement */
import { createElement, VNode, ComponentProps } from './jsx-runtime';
import { DataPoint, drawPieSlice, CHART_COLORS } from './data-service';

export interface ChartProps extends ComponentProps {
  data: DataPoint[];
  type: 'bar' | 'line' | 'pie';
}

/* --- Canvas Drawing Functions --- */
// (These functions remain largely the same as they deal with Canvas API)

function drawBarChart(ctx: CanvasRenderingContext2D, data: DataPoint[]) {
  const { width, height } = ctx.canvas;
  if (!data || data.length === 0) return;
  const barWidth = Math.max(10, width / data.length * 0.6);
  const maxValue = Math.max(0, ...data.map(d => d.value));
  const textMargin = 25;
  const chartHeight = height - textMargin;
  const labelMargin = 5;

  data.forEach((d, i) => {
    const barHeight = maxValue === 0 ? 0 : (d.value / maxValue) * (chartHeight - labelMargin);
    const x = (width / data.length) * i + (width / data.length - barWidth) / 2;
    const y = chartHeight - barHeight;

    ctx.fillStyle = CHART_COLORS[i % CHART_COLORS.length];
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText(d.label, x + barWidth / 2, height - labelMargin);
  });
}

function drawLineChart(ctx: CanvasRenderingContext2D, data: DataPoint[]) {
  const { width, height } = ctx.canvas;
  if (!data || data.length < 2) return;

  // Ensure data is sorted by date for line charts
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const maxValue = Math.max(0, ...sortedData.map(d => d.value));
  const padding = 30;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const getCoords = (d: DataPoint, i: number) => {
    const x = (i / (sortedData.length - 1)) * chartWidth + padding;
    const yValue = maxValue === 0 ? chartHeight : chartHeight - (d.value / maxValue) * chartHeight;
    const y = yValue + padding;
    return { x, y };
  };

  ctx.strokeStyle = CHART_COLORS[1];
  ctx.lineWidth = 2;
  ctx.beginPath();
  sortedData.forEach((d, i) => {
    const { x, y } = getCoords(d, i);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = CHART_COLORS[1];
  sortedData.forEach((d, i) => {
    const { x, y } = getCoords(d, i);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function drawPieChart(ctx: CanvasRenderingContext2D, data: DataPoint[]) {
  const { width, height } = ctx.canvas;
  if (!data || data.length === 0) return;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 * 0.8;
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  if (totalValue === 0) return;

  let startAngle = -0.5 * Math.PI;

  data.forEach((d, i) => {
    const sliceAngle = (d.value / totalValue) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;
    drawPieSlice(
      ctx, centerX, centerY, radius, startAngle, endAngle,
      CHART_COLORS[i % CHART_COLORS.length]
    );
    startAngle = endAngle;
  });
}


/* --- Chart Component --- */
export const Chart = ({ data, type }: ChartProps): VNode => {

  // Ref callback to get the canvas element and draw on it
  const canvasRef = (canvasEl: Node | null) => {
    if (canvasEl instanceof HTMLCanvasElement) {
      const ctx = canvasEl.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height); // Clear canvas
        ctx.font = '12px Arial'; // Set default font

        // Select the appropriate drawing function based on type
        const draw = { bar: drawBarChart, line: drawLineChart, pie: drawPieChart }[type];
        if (draw) {
          draw(ctx, data);
        }
      }
    }
  };

  return (
    <canvas
      className="chart-canvas"
      width="600"
      height="350"
      ref={canvasRef} // Use the ref callback
    >
      Canvas not supported by your browser.
    </canvas>
  );
};
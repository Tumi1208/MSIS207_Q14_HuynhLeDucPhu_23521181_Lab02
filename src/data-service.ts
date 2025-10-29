// src/data-service.ts - Manages mock data for the dashboard

// --- Interfaces & Constants ---
export interface DataPoint {
  label: string;
  value: number;
  category: string;
  date: string; // ISO format string
}
export interface DataFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
}

export const CATEGORIES = ['Electronics', 'Groceries', 'Apparel', 'Books'];
export const CHART_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

// --- Helper Functions ---
const getRandomCategory = (): string => CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

const getRandomDateISO = (): string => {
  const end = new Date();
  const start = new Date();
  start.setMonth(end.getMonth() - 6); // Up to 6 months ago
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString();
};

// --- DataService Class ---
export class DataService {
  // Generates an initial set of mock data
  generateMockData(count: number = 5): DataPoint[] {
    return Array.from({ length: count }, (_, i) => ({
      label: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 900) + 100, // Values between 100 and 1000
      category: getRandomCategory(),
      date: getRandomDateISO(),
    }));
  }

  // Filters data based on category and date range
  filterData(data: DataPoint[], filters: DataFilters): DataPoint[] {
    return data.filter(point => {
      const categoryMatch = !filters.category || filters.category === 'all' || point.category === filters.category;
      const startDateMatch = !filters.startDate || point.date >= filters.startDate;
      const endDateMatch = !filters.endDate || point.date <= filters.endDate;
      return categoryMatch && startDateMatch && endDateMatch;
    });
  }

  // Generates a single new data point for real-time updates
  generateSingleUpdate(currentIndex: number): DataPoint {
    return {
      label: `Item ${currentIndex + 1}`,
      value: Math.floor(Math.random() * 900) + 100,
      category: getRandomCategory(),
      date: new Date().toISOString(), // New data uses current date
    };
  }
}

// Utility function for drawing pie chart slices (can stay here)
export function drawPieSlice(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();
}
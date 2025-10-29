/** @jsx createElement */
import { createElement, useState, VNode } from './jsx-runtime';
import { DataPoint, DataService, DataFilters, CATEGORIES } from './data-service';
import { Chart } from './chart';
import { Card, Input } from './components'; // Use our custom components

export const DashboardApp = (): VNode => {
  const dataService = new DataService(); // Instance for data methods

  // --- State Hooks ---
  const [data, setData] = useState<DataPoint[]>(() => dataService.generateMockData(5));
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [filters, setFilters] = useState<DataFilters>({ category: 'all', startDate: '', endDate: '' });

  // --- Event Handlers ---
  const handleChartTypeChange = (e: Event) => setChartType((e.target as HTMLSelectElement).value as any);
  const handleFilterChange = (field: keyof DataFilters) => (e: Event) => {
    setFilters(currentFilters => ({
      ...currentFilters,
      [field]: (e.target as HTMLInputElement | HTMLSelectElement).value
    }));
  };
  const addDataPoint = () => setData(currentData => [...currentData, dataService.generateSingleUpdate(currentData.length)]);
  const removeLastDataPoint = () => setData(currentData => currentData.slice(0, -1));

  // --- Derived Data ---
  const filteredData = dataService.filterData(data(), filters());
  const totalValue = filteredData.reduce((sum, d) => sum + d.value, 0);

  // --- Render ---
  return (
    <div className="dashboard-app app-widget">
      <header className="dashboard-header"><h1>Dashboard</h1></header>

      <Card title="Controls" className="dashboard-controls">
        {/* Controls for chart type, filters, and data manipulation */}
        <div>
          <label for="chartType">Chart Type: </label>
          <select id="chartType" value={chartType()} onChange={handleChartTypeChange}>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </div>
        <div>
          <label for="categoryFilter">Category: </label>
          <select id="categoryFilter" value={filters().category} onChange={handleFilterChange('category')}>
            <option value="all">All</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
           <label for="startDate">Start Date: </label>
           <Input id="startDate" type="date" value={filters().startDate} onChange={handleFilterChange('startDate')} />
        </div>
         <div>
           <label for="endDate">End Date: </label>
           <Input id="endDate" type="date" value={filters().endDate} onChange={handleFilterChange('endDate')} />
        </div>
        <button onClick={addDataPoint}>Add Data</button>
        <button onClick={removeLastDataPoint} disabled={data().length === 0}>Remove Last</button>
      </Card>

      <Card title={`Data Visualization (Total: ${totalValue.toFixed(0)})`} className="chart-card">
        {/* Render the chart component with filtered data */}
        <Chart data={filteredData} type={chartType()} />
      </Card>
    </div>
  );
};
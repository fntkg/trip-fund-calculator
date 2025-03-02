import Head from 'next/head';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [baseCost, setBaseCost] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    const base = parseFloat(baseCost);
    const savings = parseFloat(currentSavings);
    const deposit = parseFloat(monthlyDeposit);

    if (isNaN(base) || isNaN(savings) || isNaN(deposit) || deposit <= 0) {
      setResult('Please enter valid numeric values and ensure deposit is greater than 0.');
      return;
    }

    const totalCost = base * 1.5;
    if (savings >= totalCost) {
      setResult(`You can already travel! (Total trip cost: $${totalCost.toFixed(2)})`);
    } else {
      const monthsNeeded = Math.ceil((totalCost - savings) / deposit);
      setResult(`You need ${monthsNeeded} month(s) to travel. (Total trip cost: $${totalCost.toFixed(2)})`);
    }
  };

  // Función para generar los datos de la gráfica
  const computeChartData = () => {
    const base = parseFloat(baseCost);
    const savings = parseFloat(currentSavings);
    const deposit = parseFloat(monthlyDeposit);
    if (isNaN(base) || isNaN(savings) || isNaN(deposit) || deposit <= 0) return null;
    const totalCost = base * 1.5;
    const monthsNeeded = Math.ceil((totalCost - savings) / deposit);
    const months = [];
    const budget = [];
    for (let i = 0; i <= monthsNeeded; i++) {
      months.push(`M${i}`);
      budget.push(savings + deposit * i);
    }
    return {
      labels: months,
      datasets: [
        {
          label: 'Budget Evolution ($)',
          data: budget,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'Target ($)',
          data: Array(months.length).fill(totalCost),
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          borderDash: [5, 5],
          tension: 0.1,
        },
      ],
    };
  };

  const chartData = computeChartData();

  return (
    <>
      <Head>
        <title>Trip Fund Calculator | Vacation Calculator</title>
        <meta
          name="description"
          content="Calculate when you can afford your next vacation by adding 50% to the base trip cost. Save smart and travel sooner!"
        />
        <meta
          name="keywords"
          content="vacation, calculator, trip, savings, travel, trip fund, budgeting, travel planning"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
        <h1 className="text-4xl font-bold text-center mt-8 mb-4">Vacation Calculator</h1>
        <p className="max-w-xl text-center text-gray-600 mb-6">
          As a general rule, it is a good idea to add 50% to the base trip cost to ensure you have enough funds during your trip and avoid any issues. This calculator will show you when you can afford a trip based on your available funds and saving pace.
        </p>

        {/* Grid container for calculator and side advertisements on large screens */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left advertisement: visible only on large screens */}
          <div className="hidden lg:block">
            <div className="bg-gray-200 border border-gray-300 text-center py-3 rounded h-full flex items-center justify-center">
              Advertisement
            </div>
          </div>

          {/* Calculator and Chart in the center */}
          <div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Base Trip Cost ($)</label>
                <input
                  type="number"
                  placeholder="e.g., 1000"
                  value={baseCost}
                  onChange={(e) => setBaseCost(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Current Savings ($)</label>
                <input
                  type="number"
                  placeholder="e.g., 500"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Monthly Deposit ($)</label>
                <input
                  type="number"
                  placeholder="e.g., 200"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={calculate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-200"
              >
                Calculate
              </button>
              <div className="mt-6 text-center">
                <h4 className="text-xl font-semibold">Result:</h4>
                <p className="mt-2 text-gray-800">{result}</p>
              </div>
            </div>
            {/* Gráfica: Se muestra solo si hay datos válidos */}
            {chartData && (
              <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Budget Evolution Over Time' },
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Right advertisement: visible only on large screens */}
          <div className="hidden lg:block">
            <div className="bg-gray-200 border border-gray-300 text-center py-3 rounded h-full flex items-center justify-center">
              Advertisement
            </div>
          </div>
        </div>

        {/* Advertisement for small screens: visible only on small screens, below the calculator */}
        <div className="w-full max-w-6xl mt-4 lg:hidden">
          <div className="bg-gray-200 border border-gray-300 text-center py-3 rounded">
            Advertisement
          </div>
        </div>
      </div>
    </>
  );
}

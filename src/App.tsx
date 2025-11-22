import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "./App.css";

// ---------- Types ----------

type SummaryMetrics = {
  totalTrips: number;
  totalRevenue: number;
  avgFare: number;
  avgTipPct: number; // 0.18 = 18%
};

type DailyRevenuePoint = {
  trip_date: string; // "2023-01-01"
  trips: number;
  total_revenue: number;
};

type HourlyTripsPoint = {
  pickup_hour: number; // 0–23
  trips: number;
  avg_distance: number;
};

type TipByPaymentPoint = {
  payment_type: string;
  trips: number;
  tip_pct: number; // 0.20 = 20%
};

// ---------- Helper: simple fetch wrapper ----------

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json() as Promise<T>;
}

// ---------- Main App ----------

const App: React.FC = () => {
  // date range – adjust defaults to whatever your data has
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-01-31");

  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [daily, setDaily] = useState<DailyRevenuePoint[]>([]);
  const [hourly, setHourly] = useState<HourlyTripsPoint[]>([]);
  const [tips, setTips] = useState<TipByPaymentPoint[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = `?start=${startDate}&end=${endDate}`;
      const [summaryRes, dailyRes, hourlyRes, tipsRes] = await Promise.all([
        fetchJSON<SummaryMetrics>(`/api/metrics/summary${qs}`),
        fetchJSON<DailyRevenuePoint[]>(`/api/metrics/daily_revenue${qs}`),
        fetchJSON<HourlyTripsPoint[]>(`/api/metrics/hourly_trips${qs}`),
        fetchJSON<TipByPaymentPoint[]>(`/api/metrics/tip_by_payment${qs}`),
      ]);

      setSummary(summaryRes);
      setDaily(dailyRes);
      setHourly(hourlyRes);
      setTips(tipsRes);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load metrics");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initial load

  const handleApplyFilters = () => {
    loadData();
  };

  return (
    <div className="app-root">
      <header className="header">
        <div>
          <h1>NYC Taxi Insights</h1>
          <p className="subtitle">
            Daily revenue, demand, and tipping behavior powered by
            Airflow → Postgres → dbt pipeline.
          </p>
        </div>
      </header>

      <section className="filters">
        <div className="filter-group">
          <label>
            Start date
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End date
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <button className="primary-btn" onClick={handleApplyFilters}>
          Apply
        </button>
      </section>

      {loading && <div className="status status-loading">Loading…</div>}
      {error && <div className="status status-error">Error: {error}</div>}

      {summary && (
        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Total trips</span>
            <span className="kpi-value">
              {summary.totalTrips.toLocaleString()}
            </span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Total revenue</span>
            <span className="kpi-value">
              $
              {summary.totalRevenue.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Avg fare / trip</span>
            <span className="kpi-value">
              ${summary.avgFare.toFixed(2)}
            </span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Avg tip %</span>
            <span className="kpi-value">
              {(summary.avgTipPct * 100).toFixed(1)}%
            </span>
          </div>
        </section>
      )}

      <main className="charts-grid">
        {/* Daily revenue & trips */}
        <section className="chart-card">
          <h2>Daily revenue & trips</h2>
          <p className="chart-subtitle">
            How busy and profitable were taxis on each day?
          </p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trip_date" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) =>
                    `$${(v / 1_000_000).toFixed(1)}M`
                  }
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "total_revenue") {
                      const num = typeof value === "number" ? value : Number(value);
                      return [
                        `$${num.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}`,
                        "Revenue",
                      ];
                    }
                    if (name === "trips") {
                      const num = typeof value === "number" ? value : Number(value);
                      return [num.toLocaleString(), "Trips"];
                    }
                    return [String(value), name];
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="total_revenue"
                  name="Revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="trips"
                  name="Trips"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Trips by hour */}
        <section className="chart-card">
          <h2>Trips by hour of day</h2>
          <p className="chart-subtitle">
            When is demand for taxis highest?
          </p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="pickup_hour"
                  tickFormatter={(h) => `${h}:00`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "trips") {
                      const num = typeof value === "number" ? value : Number(value);
                      return [num.toLocaleString(), "Trips"];
                    }
                    if (name === "avg_distance") {
                      const num = typeof value === "number" ? value : Number(value);
                      return [`${num.toFixed(2)} mi`, "Avg distance"];
                    }
                    return [String(value), name];
                  }}
                  labelFormatter={(label) => `Hour: ${label}:00`}
                />
                <Legend />
                <Bar dataKey="trips" name="Trips" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Tip % by payment type */}
        <section className="chart-card">
          <h2>Tip % by payment type</h2>
          <p className="chart-subtitle">
            How do tipping behaviors vary across payment methods?
          </p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tips}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="payment_type" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "tip_pct") {
                      const num = typeof value === "number" ? value : Number(value);
                      return [`${(num * 100).toFixed(1)}%`, "Tip %"];
                    }
                    if (name === "trips") {
                      const num = typeof value === "number" ? value : Number(value);
                      return [num.toLocaleString(), "Trips"];
                    }
                    return [String(value), name];
                  }}
                />
                <Legend />
                <Bar dataKey="tip_pct" name="Tip %" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Built on Airflow • Postgres • dbt • React • Recharts</span>
      </footer>
    </div>
  );
};

export default App;

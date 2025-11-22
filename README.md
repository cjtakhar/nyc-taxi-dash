Here is a **styled, polished, drop-in README.md** designed to look great directly inside VS Code or GitHub.
It includes emojis, headings, badges, code blocks, and section dividers.

You can paste this **exactly as-is** into `README.md`.

---

```markdown
# 🚕 NYC Taxi Analytics Platform  
### **End-to-End Data Engineering + API + Frontend Dashboard**  
*(Airflow • Postgres • FastAPI • Docker • React)*

---

<div align="center">

📊 **Modern Data Stack Project** • 🛠 **Production-grade Architecture** • 🌐 **Full-Stack Analytics**

</div>

---

## 🌟 Overview

This project is a **complete analytics platform** that ingests NYC TLC taxi trip data, pipelines it through Airflow, stores it in a Postgres warehouse, exposes analytical endpoints through FastAPI, and visualizes insights via a React dashboard.

It combines **data engineering**, **backend API development**, and **frontend data visualization** into one cohesive, containerized system.

---

## 🧱 Architecture

```

```
            ┌─────────────────────┐
            │  NYC Taxi Parquet    │
            └─────────┬────────────┘
                      │
                      ▼
            ┌─────────────────────┐
            │       Airflow       │
            │ Extract → Load →    │
            │ Raw Postgres Table  │
            └─────────┬───────────┘
                      │
                      ▼
        ┌────────────────────────────┐
        │  Postgres Warehouse        │
        │ Table: raw_nyc_taxi_trips  │
        └─────────┬──────────────────┘
                  │
                  ▼
    ┌─────────────────────────┐
    │      FastAPI Service    │
    │  /api/metrics/*         │
    └──────────┬──────────────┘
               │
               ▼
  ┌────────────────────────────┐
  │      React Dashboard       │
  │ Charts • KPIs • Insights   │
  └────────────────────────────┘
```

```

---

## 📁 Project Structure

```

nyc-taxi/
│
├── docker-compose.yml
│
├── airflow/
│   ├── dags/
│   ├── logs/
│   ├── scripts/
│   └── plugins/
│
├── api/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
└── frontend/
├── src/
└── vite.config.js

````

---

# 🚀 Getting Started

## 1️⃣ Clone the Repo

```bash
git clone https://github.com/cjtakhar/nyc-taxi-dash
cd nyc-taxi
````

---

## 2️⃣ Start the Full Stack (Airflow + Postgres + API)

```bash
docker compose up -d --build
```

This will start:

* Airflow scheduler
* Airflow webserver
* Airflow metadata DB
* Postgres warehouse (NYC taxi data)
* FastAPI backend

---

## 3️⃣ Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard will be available at:

👉 **[http://localhost:3000](http://localhost:3000)**

---

# 🔗 Accessing the Services

| Service                | URL                                                      |
| ---------------------- | -------------------------------------------------------- |
| **Airflow UI**         | [http://localhost:8080](http://localhost:8080)           |
| **FastAPI Docs**       | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **Frontend Dashboard** | [http://localhost:3000](http://localhost:3000)           |
| **Warehouse Postgres** | localhost:5433                                           |

Airflow login:

```
admin / admin
```

---

# 🏗️ Data Pipeline (Airflow)

The Airflow DAG:

* Loads NYC Yellow Taxi Parquet files
* Cleans & normalizes columns
* Bulk loads the data using `COPY` into Postgres

Raw table produced:

```
raw_nyc_taxi_trips
```

This table drives all analytics.

---

# 🌐 Backend Service (FastAPI)

FastAPI exposes analytical endpoints that query the warehouse.

### Endpoints

#### 📌 `/api/metrics/summary`

Returns total trips, revenue, avg fare, and avg tip %.

#### 📌 `/api/metrics/daily_revenue`

Returns daily revenue + trip counts.

#### 📌 `/api/metrics/hourly_trips`

Trips per hour of day + avg distance.

#### 📌 `/api/metrics/tip_by_payment`

Tip % broken down by payment method.

Example request:

```bash
curl "http://localhost:8000/api/metrics/summary?start=2023-01-01&end=2023-01-31"
```

---

# 🎨 Frontend Dashboard (React)

The frontend visualizes all metrics using:

* KPI cards
* Time-series charts
* Revenue analytics
* Hourly breakdown
* Payment-type tip analysis

It calls the FastAPI backend using fetch/axios.

---

# 🧪 Testing the API

Visit:

👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

or use curl:

```bash
curl "http://localhost:8000/api/metrics/daily_revenue?start=2023-01-01&end=2023-01-31"
```

---

# 🏭 Deployment

This project is fully containerized and can be deployed to:

* AWS ECS / Fargate
* Azure Container Apps
* Google Cloud Run
* DigitalOcean
* Kubernetes

---

# 🧠 Skills Demonstrated

### ✔ Data Engineering (Airflow, ETL)

### ✔ SQL + Data Modeling

### ✔ Backend Microservices (FastAPI)

### ✔ Full-Stack Visualization (React)

### ✔ Docker & Container Architecture

### ✔ Modern Data Stack Practices


---

# 📜 License

MIT License.

---

# 🙌 Author

Built by CJ Takhar
# 🏠 Apartment Environment Backend

A Node.js backend that **simulates temperature & humidity data** for rooms and stores it in **PostgreSQL** every 5 seconds.  
This data can be visualized using **Grafana**.

---

## 🚀 Features
- Simulates Room 1 & Room 2 data (temperature & humidity)
- Inserts data into PostgreSQL every 5 seconds
- REST API to fetch recent readings
- Configurable with `.env` file
- Ready for Grafana integration

---

## ⚙️ Tech Stack

Backend: Node.js, Express.js
Database: PostgreSQL
ORM: Sequelize

---

## 📡 API Endpoints

Rooms

- GET /api/rooms → Fetch all rooms
- POST /api/rooms → Create a new room
- PUT /api/rooms/:id   → Update a room by ID
- DELETE /api/rooms/:id   → Delete a room by ID
- GET /api/rooms/:id/sensors   → Fetch all sensors linked to a specific room

Sensors

- GET /api/sensors → Fetch all sensors
- POST /api/sensors → Create a new sensor
- PUT /api/sensors/:id   → Update a sensor by ID
- DELETE /api/sensors/:id   → Delete a sensor by ID

---

##

### 1. Clone the Repository

```
git clone https://github.com/Ruturajm4/Smart_Apartment-Assignment-.git
cd Smart_Apartment-Assignment-
```

### 2. Install Dependencies
```
npm install
```

### 3. Setup Envionment Variables
```
cp .env.example .env
```  
### 4. Seed master data (Room 1/2 + sensors)
```
npm run seed
```
### 5. Start API (auto-syncs DB)
```
npm run dev

```
Base URL → http://localhost:4000


### 6. Run simulator (in another terminal)
```
npm run simulate
```

  







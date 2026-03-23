# kubernetes_project
# 🚀 Kubernetes Microservices Project with Istio & Redis

## 📌 Overview

This project demonstrates a **production-like microservices architecture** deployed on Kubernetes with:

* 🌐 Frontend (HTML + Nginx)
* ⚙️ Backend (Node.js + Express)
* 🧠 Redis (Caching Layer)
* 🚦 Istio (Service Mesh for routing & traffic control)

The system showcases **service communication, caching, and traffic routing** in a real-world DevOps setup.

---

## 🏗️ Architecture

```
User (Browser)
      ↓
Istio Ingress Gateway
      ↓
Virtual Service Routing
      ↓
Frontend Service (Nginx)
      ↓
Backend Service (Node.js)
      ↓
Redis (Cache)
```

---

## ⚡ Features

* ✅ Microservices architecture
* ✅ Istio-based traffic routing
* ✅ Redis caching implementation
* ✅ REST API integration
* ✅ Kubernetes deployments & services
* ✅ Dynamic + Cached responses
* ✅ Port-forward & Ingress access

---

## 🧠 How It Works

### 🔹 1. Visitor Counter (`/count`)

* Increments visitor count
* Stored in Redis
* Demonstrates **state management**

---

### 🔹 2. Greeting API (`/greet`)

* Accepts user input
* Returns dynamic response
* Example:

  ```json
  {
    "message": "Hello Nandhish, welcome!"
  }
  ```

---

### 🔹 3. Cached Data (`/data`)

* First request → Backend generates data
* Stored in Redis
* Next requests → Served from cache ⚡

Example:

```json
{
  "source": "backend",
  "data": "🚀 Fresh data from backend"
}
```

Later:

```json
{
  "source": "cache",
  "data": "🚀 Fresh data from backend"
}
```

---

### 🔹 4. Reset Cache (`/reset`)

* Clears cached data from Redis
* Forces regeneration

---

## 🛠️ Tech Stack

* **Frontend**: HTML, CSS, Nginx
* **Backend**: Node.js, Express
* **Cache**: Redis
* **Containerization**: Docker
* **Orchestration**: Kubernetes (Minikube)
* **Service Mesh**: Istio

---

## 📂 Project Structure

```
kubernetes_project/
│
├── backend/
│   ├── app.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── app.html
│   └── Dockerfile
│
├── kubernetes/
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── redis-deployment.yaml
│   └── services.yaml
│
├── istio/
│   ├── gateway.yaml
│   └── virtualservice.yaml
│
└── README.md
```

---

## 🚀 Setup Instructions

### 1️⃣ Start Minikube

```bash
minikube start
```

---

### 2️⃣ Install Istio

```bash
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled
```

---

### 3️⃣ Deploy Application

```bash
kubectl apply -f kubernetes/
```

---

### 4️⃣ Apply Istio Config

```bash
kubectl apply -f istio/
```

---

### 5️⃣ Access Application

#### Option 1: Port Forward

```bash
kubectl port-forward svc/istio-ingress 8081:80 -n istio-system
```

Open:

```
http://localhost:8081
```

---

#### Option 2: Minikube Service

```bash
minikube service istio-ingress -n istio-system
```

---

## 🧪 Testing APIs

```bash
# Visitor count
curl http://localhost:8081/count

# Cached data
curl http://localhost:8081/data

# Reset cache
curl http://localhost:8081/reset

# Greet (POST)
curl -X POST http://localhost:8081/greet \
  -H "Content-Type: application/json" \
  -d '{"name":"Nandhish"}'
```

---

## 🔥 Key Learnings

* How Istio routes traffic using Gateway & VirtualService
* Difference between **cache vs dynamic responses**
* Kubernetes service communication
* Debugging real-world issues (routing, ports, labels)
* Importance of API methods (GET vs POST)

---

## 📸 Demo

* Frontend UI with buttons
* Redis-backed caching
* Istio routing in action

---

## 🚀 Future Improvements

* 🔐 Authentication (JWT)
* 📊 Monitoring (Prometheus + Grafana)
* 🔁 CI/CD pipeline (GitHub Actions)
* 🌍 Domain + HTTPS (TLS with Istio)
* ⚖️ Canary deployments

---

## 👨‍💻 Author

**Nandhish M**

* DevOps Enthusiast 🚀
* Kubernetes | Docker | AWS | Istio

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!

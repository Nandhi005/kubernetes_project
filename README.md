# Kubernetes Microservices with Istio and Redis

A small microservices lab that packages a static Nginx frontend and a Node.js/Express API, runs them with Redis on Kubernetes, and uses Istio Gateway + VirtualService rules to route browser requests.

> **Scope:** This repository demonstrates Kubernetes deployment, service discovery, Redis-backed state/cache examples and Istio ingress routing. It is a learning project, not a hardened production platform.

## Architecture

```text
Browser
  |
  v
Istio Ingress Gateway :80
  |
  v
Istio VirtualService
  |-------------------------------|
  | /count, /greet, /data, /reset |
  |                               v
  |                         backend-service :3000
  |                               |
  |                               v
  |                         redis-service :6379
  |
  | / (default)
  v
frontend-service :80
  |
  v
Nginx serving frontend/index.html
```

## Features demonstrated

- Frontend served by Nginx.
- Node.js + Express backend with REST endpoints.
- Redis visitor counter and short-lived cached response.
- Kubernetes Deployments and ClusterIP Services.
- Istio Gateway and VirtualService path-based routing.
- Container images built separately for frontend and backend.

## Technology stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript, Nginx |
| Backend | Node.js, Express |
| Cache | Redis |
| Containerization | Docker |
| Orchestration | Kubernetes (Minikube-compatible manifests) |
| Service mesh / ingress routing | Istio |

## Repository structure

```text
.
├── backend/
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   └── Dockerfile
├── kubernetes/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── redis.yaml
├── istio/
│   ├── gateway.yaml
│   └── virtualservice.yaml
└── README.md
```

## Prerequisites

- Docker
- kubectl
- Minikube or another Kubernetes cluster
- Istio CLI (`istioctl`)
- Access to Docker Hub if you use the image names currently referenced in the Deployments

## Build and publish the container images

The Kubernetes Deployments currently reference these image tags:

- `nandheeswaran/backend:v2`
- `nandheeswaran/frontend:v3`

Build and push matching images from the repository root:

```bash
docker build -t nandheeswaran/backend:v2 ./backend
docker build -t nandheeswaran/frontend:v3 ./frontend

docker push nandheeswaran/backend:v2
docker push nandheeswaran/frontend:v3
```

If you use a different registry or image tags, update the corresponding `image:` values in the Deployment manifests before applying them.

## Deploy to Minikube

### 1. Start the cluster

```bash
minikube start
kubectl get nodes
```

### 2. Install Istio

Install the demo profile for this lab:

```bash
istioctl install --set profile=demo -y
kubectl get pods -n istio-system
```

Enable sidecar injection in the namespace used by the manifests:

```bash
kubectl label namespace default istio-injection=enabled --overwrite
```

### 3. Apply application resources

```bash
kubectl apply -f kubernetes/
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend
kubectl rollout status deployment/redis
```

### 4. Apply Istio routing

```bash
kubectl apply -f istio/
kubectl get gateway,virtualservice
```

### 5. Verify resources

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get gateway,virtualservice
```

### 6. Access the application

Forward local port 8081 to the Istio ingress gateway:

```bash
kubectl port-forward -n istio-system svc/istio-ingressgateway 8081:80
```

Open `http://localhost:8081` in your browser.

## API examples

With the port-forward running:

**Visitor counter**
```bash
curl http://localhost:8081/count
```

**Personalized greeting**
```bash
curl -X POST http://localhost:8081/greet \
  -H "Content-Type: application/json" \
  -d '{"name":"Nandheeswaran"}'
```

**Cached response**
```bash
curl http://localhost:8081/data
```

The first request waits briefly and stores the response in Redis for 30 seconds. Subsequent requests during that period return the cached value.

**Reset cache**
```bash
curl http://localhost:8081/reset
```

## Troubleshooting

**Pods are not starting**
```bash
kubectl get pods
kubectl describe pod POD_NAME
kubectl logs deployment/backend
kubectl logs deployment/redis
```

**ImagePullBackOff**
- Confirm the image tags exist in the registry.
- Confirm the cluster can access the registry.
- Check the Deployment image name and tag.

**Frontend loads but API calls fail**
- Check that the Istio ingress gateway is running.
- Check the VirtualService routes and backend Service endpoints.
- Verify the backend can resolve and connect to `redis-service:6379`.

```bash
kubectl get endpoints backend-service frontend-service redis-service
kubectl get gateway,virtualservice
```

**Istio routing does not work**
- Confirm the Gateway selector matches the ingress gateway labels.
- Confirm the ingress gateway service is exposed and port-forwarded.
- Check that the VirtualService references the correct service names and ports.

## Cleanup

Remove the application and Istio routing resources:

```bash
kubectl delete -f istio/
kubectl delete -f kubernetes/
```

If this Minikube cluster was created only for this lab:

```bash
minikube delete
```

## Current limitations and next improvements

- Redis is a single-replica Deployment with no persistent volume; data is not durable across pod replacement.
- The backend currently connects to Redis at the in-cluster DNS name and does not expose a dedicated readiness/liveness health endpoint.
- The `/reset` endpoint changes server state using GET; change it to POST and add authorization before production use.
- Add resource requests/limits, probes, non-root containers and image scanning.
- Add authentication, TLS, NetworkPolicies and secrets management.
- Add automated tests and CI/CD for build, scan and deployment.
- Add Prometheus/Grafana dashboards and alerting.

## Author

**Nandheeswaran M** — DevOps / Kubernetes

- [GitHub](https://github.com/Nandhi005)
- [LinkedIn](https://www.linkedin.com/in/nandheeswaran-m-09a8a6244/)
- [Portfolio](https://nandhi005.github.io/Nandhe_Portfolio/)

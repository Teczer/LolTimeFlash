# 🔥 Load Testing with Artillery

This directory contains load testing scenarios for LolTimeFlash API and Socket.IO.

## 📋 Prerequisites

- Backend running on `http://localhost:8888`
- Artillery installed (`pnpm install`)

## 🚀 Running Tests

### HTTP API Load Test

Tests the REST API endpoints (health, metrics, champions).

```bash
# From root directory
pnpm load-test:http
```

**Phases:**
1. **Warm-up**: 5 users/sec for 30s
2. **Ramp-up**: 10 → 50 users/sec for 60s
3. **Sustained**: 50 users/sec for 120s
4. **Peak**: 100 users/sec for 60s

**Endpoints tested:**
- `/monitoring/health` (10% traffic)
- `/monitoring/metrics` (5% traffic)
- Mixed traffic simulation (85%)

**Thresholds:**
- P95 response time: < 200ms
- P99 response time: < 500ms
- Request rate: > 40 req/sec
- Success rate: > 95%

---

### Socket.IO Load Test

Tests WebSocket connections and real-time game events.

```bash
pnpm load-test:socket
```

**Phases:**
1. **Warm-up**: 2 connections/sec for 30s
2. **Ramp-up**: 5 → 20 connections/sec for 60s
3. **Sustained**: 20 connections/sec for 120s
4. **Peak**: 50 connections/sec for 30s

**Scenarios:**
- **Join Room & Listen** (40%): Users join and idle
- **Active Gameplay** (30%): Simulates Flash usage + item toggles
- **Flash Cancel Spam** (20%): Stress tests cancel events
- **Room Hopper** (10%): Tests room join/leave

---

### Run All Tests

```bash
pnpm load-test:all
```

Runs both HTTP and Socket.IO tests sequentially.

---

### Generate Report

```bash
pnpm load-test:report
```

Generates a JSON report in `load-tests/reports/` with timestamp.

## 📊 Reading Results

Artillery will output:

```
Summary report @ 14:30:00 (2024-11-14)
  Scenarios launched:  15000
  Scenarios completed: 14998
  Requests completed:  45000
  Mean response/sec:   50.12
  Response time (msec):
    min: 5
    max: 450
    median: 45
    p95: 180
    p99: 320
  Codes:
    200: 44850
    500: 150
```

### Key Metrics

- **Scenarios**: Virtual users created
- **Requests completed**: Total HTTP requests
- **Mean response/sec**: Throughput
- **p95/p99**: 95th/99th percentile response times
- **Codes**: HTTP status distribution

---

## 🎯 Performance Targets

| Metric                | Target     | Actual |
|-----------------------|------------|--------|
| P95 Response Time     | < 200ms    | ?      |
| P99 Response Time     | < 500ms    | ?      |
| Throughput            | > 40 req/s | ?      |
| Success Rate          | > 95%      | ?      |
| Socket Connections    | 500+       | ?      |
| Events/sec (Socket)   | 1000+      | ?      |

---

## 🔧 Customization

### Modify Load Profile

Edit `load-tests/http-api.yml`:

```yaml
phases:
  - duration: 60
    arrivalRate: 100  # Increase for higher load
    name: "Peak load"
```

### Add Custom Scenarios

Edit scenarios in `http-api.yml` or `socket-io.yml`:

```yaml
scenarios:
  - name: "My Custom Test"
    weight: 10
    flow:
      - get:
          url: "/my-endpoint"
```

### Custom Metrics

Add custom tracking in `processors/custom-metrics.js` or `processors/socket-metrics.js`.

---

## 🐛 Troubleshooting

### High Failure Rate

- Check if backend is running: `curl http://localhost:8888/monitoring/health`
- Increase backend resources (RAM, CPU)
- Lower `arrivalRate` in test config

### Slow Response Times

- Check logs: `tail -f apps/api/logs/app-*.log`
- Monitor metrics: `curl http://localhost:8888/monitoring/metrics`
- Optimize slow endpoints

### Socket.IO Errors

- Verify Socket.IO is listening: Check logs for "Socket.IO is ready"
- Test manual connection: Use a Socket.IO client
- Check CORS settings in backend

---

## 📚 Resources

- [Artillery Documentation](https://www.artillery.io/docs)
- [Socket.IO Testing Guide](https://www.artillery.io/docs/guides/guides/socketio-reference)
- [Performance Tuning](https://www.artillery.io/docs/guides/guides/performance-tuning)

---

**Last Updated**: 2024-11-14  
**Version**: 1.0.0


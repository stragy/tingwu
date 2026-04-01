# 架构演进方案

## 1. 数据库拆分方案

### 当前问题

- 所有微服务共享单一 PostgreSQL 数据库
- 服务间耦合度高，难以独立扩展
- 故障传播风险大

### 方案 A: Schema 隔离（推荐短期）

```sql
-- 为每个服务创建独立的 schema
CREATE SCHEMA auth;
CREATE SCHEMA user;
CREATE SCHEMA practice;
CREATE SCHEMA evaluation;
CREATE SCHEMA scheduling;
CREATE SCHEMA analytics;
```

- 优点: 快速实施，最小改动
- 缺点: 资源仍共享，连接数有限制

### 方案 B: 数据库拆分（中期）

- auth-service: 独立数据库
- user-service: 独立数据库
- practice/evaluation: 共享数据库（高频读写）
- scheduling/analytics: 独立数据库（分析为主）

### 方案 C: 混合存储（长期）

- PostgreSQL: 事务性数据（用户、订单）
- MongoDB: 非结构化数据（评测结果、错误模式）
- Redis: 会话、缓存
- Elasticsearch: 日志、分析查询

---

## 2. Kubernetes 迁移方案

### 阶段 1: 容器化完善

- 优化 Dockerfile（多阶段构建、缓存优化）
- 引入 Docker Compose V2
- 添加 healthcheck 到所有服务

### 阶段 2: 本地 K8s 开发

-kind 或 Minikube 本地开发环境

- Kompose 转换 docker-compose 到 K8s manifests
- 使用 Skaffold 实现热重载

### 阶段 3: 生产 K8s 部署

- Helm Charts 打包
- ArgoCD 或 Flux GitOps 部署
- Istio 服务网格
- Prometheus + Grafana 监控

### K8s 资源配置建议

```yaml
resources:
  limits:
    cpu: '500m'
    memory: '512Mi'
  requests:
    cpu: '200m'
    memory: '256Mi'
```

### 扩缩容策略

- HPA: 基于 CPU/内存自动扩缩容
- VPA: 垂直扩缩容建议
- KEDA: 基于队列深度的事件驱动扩缩容

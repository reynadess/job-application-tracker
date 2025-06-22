<p align="center">
  <a href="https://nestjs.com" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  <b>A progressive Node.js framework for building efficient, scalable, and enterprise-grade backend applications.</b>
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master" alt="Coverage" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord" /></a>
</p>

---

## 🧾 Description

This is a NestJS backend project for a **Job Application Tracker**. The backend is powered by **PostgreSQL** and containerized using **Docker** for easy local development.

---

## ⚙️ Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/reynadess/job-application-tracker.git
cd job-application-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file in the root directory

Paste the following content:

```env
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5431
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=JobApplicationTracker
PORT=3000
MODE=DEV
RUN_MIGRATIONS=true
```

---

## 🐳 Running with Docker

Make sure you have **Docker Desktop** running.

### First time setup:

```bash
docker-compose up --build
```

This will spin up two containers:

- `postgres-job-application-tracker`
- `api-job-application-tracker`

### Daily development flow (for backend devs):

You **do not** need to rebuild every time. Follow these steps instead:

1. Open Docker Desktop.
2. Stop the container: `api-job-application-tracker`
3. Ensure `postgres-job-application-tracker` is **running**.
4. Open VS Code.
5. Go to **Run & Debug**.
6. Select `Node.js` and hit **Start Debugging** (or use the command below).

---

## 🚀 Run the App

### Development

```bash
npm run start:dev
```

### Debug Mode (from VS Code or terminal)

```bash
npm run start:debug
```

### Production

```bash
npm run start:prod
```

Once running, visit:

```
http://localhost:3000/swagger
```

To access the **Swagger API documentation** and test endpoints.

---

## 🧪 Run Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 🧾 Resources

- 📘 [Official NestJS Docs](https://docs.nestjs.com)
- 🎥 [Official Courses](https://courses.nestjs.com/)
- 🧰 [NestJS Devtools](https://devtools.nestjs.com)
- ☁️ [NestJS Mau Deployment](https://mau.nestjs.com)
- 💬 [Discord Community](https://discord.gg/G7Qnnhy)
- 💼 [Job Board](https://jobs.nestjs.com)

---

## 🤝 Support

NestJS is an MIT-licensed open-source project. You can support its development via:

- [Open Collective](https://opencollective.com/nest#sponsor)
- [PayPal](https://paypal.me/kamilmysliwiec)

---

## 📬 Stay in Touch

- Author – [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Twitter – [@nestframework](https://twitter.com/nestframework)
- Website – [nestjs.com](https://nestjs.com)

---

## 📝 License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
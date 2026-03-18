# Kaash AI Powerded by Veda AI / ExamCraft AI Application

A full-stack AI application to generate and evaluate exam content.

## Architecture

This project is a monorepo consisting of:
- **Frontend**: A Next.js application built with Tailwind CSS, Zustand, and Framer Motion. 
- **Backend API**: A Node.js and Express application integrating MongoDB (via Mongoose), Redis, BullMQ, and websockets.
- **Worker**: A background worker powered by BullMQ to offload AI generation tasks via the Groq SDK.
- **Database**: MongoDB for persistent storage, Redis for queueing and caching.

## Prerequisites

- Docker
- Node.js (for local development without Docker)

## Environment Variables

Copy `.env.example` to `.env` and fill in your API key:

```bash
cp .env.example .env
```

```env
GROQ_API_KEY=your_groq_api_key_here
```

## Running the Application

The entire application stack can be spun up using Docker. This includes your MongoDB database, Redis instance, backend API server, background worker, and the Next.js frontend.

1. Ensure Docker is running.
2. In the root directory, execute:
   ```bash
   docker compose up -d --build
   ```
3. Your services will start on the following ports:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`
   - MongoDB: `localhost:27017`
   - Redis: `localhost:6379`

### Stopping the Application

To tear down the containers and free up resources:

```bash
docker compose down
```

## Project Structure

- `frontend/`: Next.js web application.
- `backend/src/`: Express server, HTTP routes, controllers, and MongoDB models.
- `backend/src/workers/`: BullMQ worker specifically handling the Anthropic AI integration for task generation.

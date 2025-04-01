# Realtime Table Project

A modern web application featuring real-time table updates using Next.js, Express, Socket.IO, and Supabase.

## Project Structure

```
.
├── client/          # Next.js frontend application
├── server/          # Express backend server
├── .prettierrc      # Prettier configuration
└── .gitignore       # Git ignore rules for dependencies, build files, and environment variables
```

## Features

- Real-time table updates using Socket.IO
- UI with Shadcn/ui components
- TypeScript support throughout the project
- Supabase integration for data management
- Redis caching support
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- Redis server
- Supabase account and credentials

## Getting Started

### Environment Setup

1. Clone the repository
2. Create `.env` files in both client and server directories
3. Install dependencies for both client and server

### Client Setup

```bash
cd client
npm install
```

Create a `.env` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Server Setup

```bash
cd server
npm install
```

Create a `.env` file with your configuration:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

PORT=3001
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
REDIS_USERNAME=your_redis_username

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

## Development

### Running the Client

```bash
cd client
npm run dev
```

The client will be available at `http://localhost:3000`

### Running the Server

```bash
cd server
npm run dev
```

The server will be available at `http://localhost:3001`

## Production Build

### Client Build

```bash
cd client
npm run build
npm start
```

### Server Build

```bash
cd server
npm run build
npm start
```

## Technologies Used

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Socket.IO Client

### Backend
- Express
- TypeScript
- Socket.IO
- Redis
- Supabase
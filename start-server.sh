#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")"

# Check if Docker daemon is running
if ! systemctl is-active --quiet docker; then
    echo "Docker daemon is not running. Starting Docker..."
    sudo systemctl start docker
    sleep 5  # Wait for Docker to fully start
fi

# Check Docker permissions
if ! docker info >/dev/null 2>&1; then
    echo "Adding current user to docker group..."
    sudo usermod -aG docker $USER
    echo "Please log out and log back in for the group changes to take effect"
    echo "Or run: newgrp docker"
    exit 1
fi

# Start the Docker services in the background
docker compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
sleep 10

# Start the backend and frontend services (without tunnel) with nohup
nohup pnpm run dev:services:no-tunnel > server.log 2>&1 &
echo $! > server.pid

# Wait for the backend and frontend to start
sleep 10

# Start the tunnel in another process
nohup pnpm dev:tunnel > tunnel.log 2>&1 &
echo $! > tunnel.pid

echo "Backend and frontend started with PID $(cat server.pid). Logs in server.log"
echo "Tunnel started with PID $(cat tunnel.pid). Logs in tunnel.log"
echo "To check tunnel URL: tail -f tunnel.log" 
#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")"

# Function to kill process using a specific port
kill_port() {
    local port=$1
    echo "Checking port $port..."
    if lsof -i ":$port" > /dev/null; then
        echo "Killing process on port $port"
        sudo kill -9 $(lsof -t -i":$port") 2>/dev/null || true
    fi
}

# Function to kill process by name
kill_process() {
    local process_name=$1
    echo "Checking for $process_name processes..."
    if pgrep -f "$process_name" > /dev/null; then
        echo "Killing $process_name processes"
        sudo pkill -f "$process_name" 2>/dev/null || true
    fi
}

# Stop the main server
if [ -f server.pid ]; then
    PID=$(cat server.pid)
    echo "Stopping main server with PID $PID"
    kill $PID 2>/dev/null || sudo kill -9 $PID 2>/dev/null
    rm server.pid
else
    echo "No main server PID file found"
fi

# Stop the tunnel
if [ -f tunnel.pid ]; then
    PID=$(cat tunnel.pid)
    echo "Stopping tunnel with PID $PID"
    kill $PID 2>/dev/null || sudo kill -9 $PID 2>/dev/null
    rm tunnel.pid
else
    echo "No tunnel PID file found"
fi

# Kill ngrok processes
kill_process "ngrok"
kill_port 4040  # ngrok admin interface port

# Force kill any processes on our ports
kill_port 8000  # Uvicorn
kill_port 3001  # Next.js alternative
kill_port 3002  # Next.js alternative
kill_port 3003  # Next.js alternative
kill_port 3004  # Next.js alternative

# Stop Docker services
docker compose -f docker-compose.dev.yml down

# Clean up any remaining nohup.out files
rm -f nohup.out

echo "All services stopped" 
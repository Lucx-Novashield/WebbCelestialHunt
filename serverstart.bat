@echo off
echo Starting Server 1...
start cmd /k "cd server1 && http-server -p 3000"

echo Starting Server 2...
start cmd /k "cd server2 && http-server -p 3001"

echo Starting Server 3...
start cmd /k "cd server3 && http-server -p 3002"

echo Starting Server 3...
start cmd /k "cd server3 && http-server -p 3003"

echo Starting Server 3...
start cmd /k "cd server3 && http-server -p 3004"

echo Starting Server 3...
start cmd /k "cd server3 && http-server -p 3005"

echo Starting Server 3...
start cmd /k "cd server3 && http-server -p 3006"

echo All servers started!
pause

# EasyStay - Backend & Frontend Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Both backend and frontend directories have `node_modules` (run `npm install` if missing)

---

## Backend Startup (Port 8000)

### Step 1: Navigate to Backend
```bash
cd BACKEND
```

### Step 2: Verify Environment Variables
Make sure `.env` file has:
```
PORT=8000
MONGODB_URL=mongodb+srv://shreyatiwari:shreya2812@shreya.mrvbqnb.mongodb.net/Easystay
ACCESS_TOKEN_SECRET=your_secret_here
REFRESH_TOKEN_SECRET=your_secret_here
CORS_ORIGIN=http://localhost:5173
```

### Step 3: Start Backend
```bash
npm run dev
```

You should see:
```
Server is running at port 8000
MongoDB connected !! DB host : shreya.mrvbqnb.mongodb.net
```

---

## Frontend Startup (Port 5173)

### Step 1: Navigate to Frontend
```bash
cd FRONTEND/frame-factory-flow-main\ \(1\)/frame-factory-flow-main
```

### Step 2: Start Frontend
```bash
npm run dev
```

You should see:
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
```

---

## Common Issues & Solutions

### ❌ "Network Error" when trying to register
**Cause**: Backend server not running  
**Solution**: 
1. Make sure backend terminal shows "Server is running at port 8000"
2. Check if MongoDB is connected

### ❌ "MONGODB connection error"
**Cause**: MongoDB URL is invalid or unreachable  
**Solution**:
1. Check your MongoDB Atlas credentials in `.env`
2. Make sure your IP is whitelisted in MongoDB Atlas
3. Check internet connection

### ❌ "Cannot find module" errors
**Cause**: Dependencies not installed  
**Solution**:
```bash
npm install
```

### ❌ Port 8000 already in use
**Cause**: Another process is using port 8000  
**Solution**:
```bash
# On Windows (in PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force

# Or change PORT in .env to 8001
```

---

## Debugging

### To see detailed logs:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try registering - you'll see detailed error messages

### Check backend logs:
Look at the backend terminal for console.log messages that show:
- Request received
- Database operations
- Errors

---

## Testing

### Test Backend Connectivity
Visit: http://localhost:8000/

You should see: "EasyStay API running 🚀"

### Test API
Visit: http://localhost:8000/api/v1/test

You should see: `{"success":true,"message":"Backend is connected"}`

---

## Registration Flow

1. Go to http://localhost:5173/register
2. Fill in:
   - Full Name
   - Email
   - Password (min 6 chars)
   - Confirm Password
   - Select Guest or Host
3. Click "Create Account"
4. Should redirect to dashboard


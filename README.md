# MERN Student Management System

Setup (needs Node.js 18+ and your MongoDB Atlas connection string):

1. `cp backend/.env.example backend/.env`   (Windows CMD: `copy backend\.env.example backend\.env`)
2. Open `backend/.env` and paste your real MONGO_URI
   (URL-encode special characters in the password: @ -> %40, # -> %23)
3. `npm run install-all`
4. `npm run dev`
5. Open http://localhost:5173

Optional: add 12 demo students ->  `npm run seed --prefix backend`

Atlas: Network Access -> Add IP Address -> Allow Access From Anywhere (0.0.0.0/0).


# 🏠 EasyStay – Rental Management System

## 📘 Overview  
**EasyStay** is a full-stack web application developed using the **MERN Stack** (MongoDB, Express.js, React with TypeScript, and Node.js).  
It simplifies the rental process by providing an all-in-one platform where **hosts** can list and manage their properties, and **guests** can explore, search, and book accommodations easily.  

---

## 🚀 Features  
- 🏡 **Property Management:** Add, update, and delete property listings with ease.  
- 🔍 **Advanced Search & Filters:** Find properties based on price, location, and amenities.  
- 👥 **User Authentication:** Secure user authentication with JWT for hosts and guests.  
- 💳 **Booking System:** Manage property bookings in real-time.  
- 🧾 **Admin Dashboard:** Monitor users, listings, and bookings efficiently.  
- 📱 **Responsive UI:** Designed with modern layouts for desktop and mobile devices.  

---

## 🧩 Tech Stack  

| Category | Technologies |
|-----------|--------------|
| **Frontend** | React.js (TypeScript), HTML5, CSS3 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JSON Web Tokens (JWT) |
| **Version Control** | Git, GitHub |
| **Tools & Others** | Postman, VS Code, npm |

---

## 🗂️ Folder Structure  
```
EasyStay/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── config/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/<your-username>/easystay.git
cd easystay
```

### 2️⃣ Install Dependencies  
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3️⃣ Configure Environment Variables  
Create a `.env` file in the **backend** folder and add:  
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Application  
```bash
# Run backend
cd backend
npm start

# Run frontend
cd ../frontend
npm start
```

---

## 🧪 API Testing (via Postman)  
| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login existing user |
| GET | /api/properties | Fetch all property listings |
| POST | /api/properties | Add a new property |

---

## 📸 Screenshots  
_Add screenshots of key pages for better presentation:_  
- Homepage  
- Property Listing Page  
- Booking Page  
- Admin Dashboard  

---

## 👨‍💻 Team Members  

| Name | Role | Contribution |
|------|------|---------------|
| **Yash Saini** | Team Lead / Full Stack Developer | Designed and implemented backend APIs and integrated frontend with TypeScript-based React |
| Member 2 | Frontend Developer | Developed responsive UI using React + TypeScript |
| Member 3 | Backend Developer | Handled MongoDB models and Express routes |
| Member 4 | Tester / Documentation | Performed testing and documentation |

---

## 🎯 Learning Outcomes  
- Gained experience in building and deploying a **MERN Stack** web application.  
- Implemented **TypeScript** with React for type safety and scalability.  
- Understood the integration of RESTful APIs with secure **JWT-based authentication**.  
- Enhanced collaboration and version control skills using Git & GitHub.  

---

## 🧠 Future Enhancements  
- Integration of payment gateway (Razorpay / Stripe).  
- Chat system between host and guest.  
- Email notifications for booking updates.  
- Cloud deployment using Render / Vercel / Netlify.  

---

## 📜 License  
This project was developed by **Yash Saini** and team as part of an **MCA academic project**.  
It is intended solely for educational purposes and not for commercial use.

---

# 🏋️‍♂️ Fitness Tracker

A modern, full-stack fitness tracking application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that helps users track their workouts, set goals, and maintain a healthy lifestyle.

![Fitness Tracker](https://img.shields.io/badge/Fitness-Tracker-blue)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### User Features
- 🔐 Secure authentication system
- 📊 Personal dashboard with workout statistics
- 🎯 Goal setting and tracking
- 💪 Workout logging and management
- 📈 Progress analytics and visualization
- 🏆 Achievement tracking
- 📱 Responsive design for all devices

### Admin Features
- 👥 User management system
- 📊 Advanced analytics dashboard
- 💡 Health tips management
- 🔄 Workout suggestions management
- 📈 System-wide statistics
- 🔒 Secure admin authentication

## 🛠️ Tech Stack

### Frontend
- React.js
- Material-UI
- Framer Motion
- Axios
- React Router
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose ODM

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/fitness-tracker.git
cd fitness-tracker
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup
```bash
# In the backend directory, create a .env file with:
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the application
```bash
# Start backend server (from backend directory)
npm start

# Start frontend development server (from frontend directory)
npm start
```

## 📁 Project Structure

```
fitness-tracker/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── contexts/
│       └── App.js
└── README.md
```

## 🔐 Authentication

The application implements a secure authentication system with:
- JWT-based authentication
- Protected routes
- Role-based access control (User/Admin)
- Secure password hashing

## 📊 Features in Detail

### User Dashboard
- Workout tracking and logging
- Goal setting and progress monitoring
- Personal statistics and analytics
- Achievement tracking

### Admin Dashboard
- User management
- System analytics
- Health tips management
- Workout suggestions
- System monitoring

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Material-UI for the beautiful components
- Framer Motion for smooth animations
- MongoDB for the database
- Express.js for the backend framework
- React.js for the frontend framework

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ by [Your Name] 
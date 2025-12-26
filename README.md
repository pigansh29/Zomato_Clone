# FlavorFeed 🍔🎥

FlavorFeed is a dynamic food blog web application that integrates a reel-based video feed for exploring culinary delights. Users can discover mouth-watering dishes through short videos and easily visit the corresponding restaurant via a direct link.

## 🌟 Features

- **Reel-Based Feed**: Explore food through an engaging, TikTok-style video scroll.
- **Visit Store Integration**: Direct links in each reel to view restaurant details.
- **Role-Based Access**:
  - **User**: View reels, like, save, and explore restaurants.
  - **Food Partner**: Register, add dishes, and upload videos to their restaurant profile.
- **Interactive UI**: Modern, responsive design with smooth animations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (Responsive & Animated)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Storage**: ImageKit (for video and image hosting)
- **Authentication**: JWT (JSON Web Tokens)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (Local or Atlas)
- ImageKit Account

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/FlavorFeed.git
cd FlavorFeed
```

#### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/flavorfeed
ACCESS_TOKEN_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/
```

Start the backend server:
```bash
npm start
```

#### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory (or use `.env.local`):
```env
VITE_API_URL=http://localhost:8000
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## 📂 Project Structure

```
FlavorFeed/
├── backend/            # Express server & API routes
│   ├── src/
│   │   ├── controllers/# Route logic
│   │   ├── models/     # Mongoose models
│   │   ├── routes/     # API endpoints
│   │   └── services/   # External services (ImageKit)
│   └── ...
└── frontend/           # React application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Application pages
    │   └── styles/     # Global & component styles
    └── ...
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the ISC License.

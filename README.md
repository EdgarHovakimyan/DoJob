
# DoJob 🧑‍💻

DoJob is an online freelance marketplace similar to UpWork. It connects clients with freelancers, allowing clients to post jobs and freelancers to apply. The platform includes user authentication, job status management, filtering, and more.

## 🚀 Technologies Used

- **Node.js** with **NestJS**
- **GraphQL** API
- **MongoDB** (via Mongoose)
- **JWT** Authentication
- **TypeScript**
- **ESLint** and **Prettier** for code quality

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/dojob.git
cd dojob
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Start the development server:
```bash
npm run start:dev
```

## 🔐 Authentication

The system uses JWT tokens for authentication. After registration or login, users receive a token, which is sent in the headers of protected requests.

## 📂 Features

- 👤 User registration and login (client & freelancer)
- 📋 Job creation and search
- 📨 Freelancers can apply to jobs
- 🔄 Job status updates
- 🔎 Filtering by category/status

## 👨‍💻 Author

- Name: Edgar  
- GitHub: [https://github.com/EdgarHovakimyan]  
- Email: [edohovakimyan555@gmail.com]

---

Feel free to star ⭐ this repo if you like the project or want to support it!

# 📚 NodeJs Project with MVC Architecture

## 🌟 Overview
This project sets up a Node.js application using the Model-View-Controller (MVC) architecture. It includes a complete structure with Controllers, Services, DAOs, Models, and DTOs for handling CRUD operations on a User resource. It also incorporates validation, basic authentication, and unit testing.

### Tech Stack
- **Node.js**
- **Express**
- **Zod** (for validation)
- **TypeScript**
- **Bun** (for fast JavaScript execution)
- **NoSQL Database** (e.g., MongoDB)
- **Vercel** (for serverless deployment)

## 🔧 Setup and Installation

### Prerequisites
- Node.js
- Bun
- MongoDB (or any NoSQL database)
- Typescript
- Jose (for jwt token verification and signing)
- Mongoose ORM

### Getting Started

1. **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-name>
    ```

2. **Install dependencies:**
    ```sh
    npm i -g bun
    bun install
    ```

3. **Run the application in development:**
    ```sh
    bun run dev
    ```

## 🗂️ Folder structure
```bash
├── api
│   └── index.ts
├── controllers
│   └── userController.ts
├── dtos
│   └── user
│       └── index.ts
├── middlewares
│   ├── auth.ts
│   ├── validator.ts
├── models
│   └── User.ts
├── routes
│   └── userRoutes.ts
├── types
│   ├── env.ts
│   └── express.d.ts
├── .env
├── .gitignore
├── bun.lockb
├── db.ts
├── package.json
├── project_structure.txt
├── README.md
├── tsconfig.json
└── vercel.json
```
## 🚀 API Endpoints

- Here is the link to the api at production:  https://workoai.vercel.app
- If you want to test the endpoints mentioned below chech out the [postman collection](https://www.postman.com/scholax/workspace/workioai/collection/12313396-120de791-377e-4bdd-b1e1-f3aa4982d258?action=share&creator=12313396&active-environment=12313396-3346455c-e757-4a9c-b7f9-8bfa5e4b10d8)

### User Resource: `/worko/user`

- **GET** `/worko/user` - List users
- **GET** `/worko/user/:userId` - Get user details
- **POST** `/worko/user` - Create user
- **PUT** `/worko/user/:userId` - Update user
- **PATCH** `/worko/user/:userId` - Update user
- **DELETE** `/worko/user/:userId` - Soft delete user

### User Payload
- `Id` (Generated)
- `Email` (Validated)
- `Name`
- `Age`
- `City`
- `Zip Code` (Validated)

## ✅ Validation

- **Email** - Must be a valid email format.
- **Zip Code** - Must be a valid zip code format.
- **Id** - Required for POST/PUT/DELETE.

## 🗂️ Sample .env Variables
### copy paste these in .env file in the root of the project
```env
NODE_ENV = "dev"
JWT_SECRET="xnxjashiq1008$%^&7sn"
MONGO_URI = "mongodb+srv://harit:demolution@cluster0.eqsj0w2.mongodb.net/workai"
JWT_ISSURER_DEV = "http://localhost:4000"
JWT_ISSURER_PREVIEW = "https://task-git-dev-haritjoshi1s-projects.vercel.app"
JWT_TOKEN_EXP = "90d"
```



Task Management App 📝

A simple yet powerful task management app built using React and JSON Server.
This app allows you to manage tasks with features like:

- ✅ Task creation, editing, deletion
- 🔄 Subtask toggling
- 🔍 Sorting and filtering
- 📆 Pagination
- 🧾 Activity logs

Project Structure:

/task-manager/
│
├── public/
├── src/
│   ├── components/
│   │   └── TaskForm.jsx
│   ├── pages/
│   │   └── Tasks.jsx
│   ├── App.jsx
│   └── index.js
├── db.json  ← (for JSON Server)
└── README.txt

Getting Started:

1. Clone the Repository

    git clone https://github.com/your-username/task-manager.git
    cd task-manager

2. Install Dependencies

    npm install

3. Start the Frontend (React)

    npm start

    The React app will run on: http://localhost:3000

4. Start the Backend (JSON Server)

First, install JSON Server globally (if not already):

    npm install -g json-server

Then, run the server with the mock database with command npm run json-server


    The backend will run at: http://localhost:3001

Features Implemented:

- View all tasks with pagination
- Sort tasks by priority and due date
- Filter tasks by status (completed, pending)
- Add new tasks with subtasks
- Edit existing tasks
- Mark subtasks as done or undone
- View logs showing what actions happened and when


Tech Stack:

- Frontend: React, Tailwind CSS
- Backend (Mock): JSON Server

Notes:

- The data is stored in a local JSON file (db.json), suitable for demos or prototyping.

Author:

Made  by Gaurav Singh Nagarkoti
LinkedIn: https://linkedin.com/in/gauravsinghnagarkoti


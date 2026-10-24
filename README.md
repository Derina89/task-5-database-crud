# CourseHub - Database CRUD Application

CourseHub is a full-stack course management application built using Node.js, Express.js, PostgreSQL, HTML, CSS, and JavaScript.

The application allows users to add, view, edit, delete, and search courses through a responsive web interface connected to a PostgreSQL database.

## Features

- Add new courses
- View all courses
- Edit existing courses
- Delete courses
- Search courses
- Client-side validation
- Server-side validation
- PostgreSQL database persistence
- REST API
- Error handling
- Responsive user interface
- Parameterized SQL queries

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- PostgreSQL
- pg
- dotenv

## Project Structure

task-5-database-crud/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── schema.sql
├── server.js
└── README.md

## Database

Database Name: task5_crud

Table Name: courses

The courses table contains:

- id
- title
- category
- description
- created_at

## API Endpoints

### Get All Courses

GET /api/courses

### Get Course by ID

GET /api/courses/:id

### Add Course

POST /api/courses

### Update Course

PUT /api/courses/:id

### Delete Course

DELETE /api/courses/:id

## Validation

The application validates course information before storing it.

- Course title must contain at least 3 characters.
- Category is required.
- Description must contain at least 10 characters.
- Course ID must be a valid number.
- Required fields cannot be empty.

## Installation

### 1. Install Dependencies

Open a terminal inside the project folder and run:

npm install

### 2. Configure Environment Variables

Create a .env file with your PostgreSQL configuration.

Example:

DB_USER=postgres
DB_HOST=localhost
DB_NAME=task5_crud
DB_PASSWORD=your_password
DB_PORT=5432

Do not upload the .env file to GitHub.

### 3. Start the Server

Run:

node server.js

The server will run at:

http://localhost:3000

### 4. Open the Application

Open this address in your browser:

http://localhost:3000

## CRUD Operations

### Create

Users can add new courses through the course form.

### Read

Users can view courses stored in the PostgreSQL database.

### Update

Users can edit existing course information.

### Delete

Users can remove courses from the database.

## Search

The application allows users to search courses by:

- Title
- Category
- Description

## Security

- The .env file is excluded using .gitignore.
- Parameterized SQL queries are used for database operations.
- User input is validated before database operations.
- Real database credentials are not included in the repository.

## Database Schema

The database table can be created using the SQL commands provided in:

schema.sql

## Application Flow

User Interface
      ↓
JavaScript
      ↓
Fetch API
      ↓
Express.js REST API
      ↓
PostgreSQL Database
      ↓
Express.js Response
      ↓
User Interface

## Internship Task

This project was developed as part of the SAN Web Technology Full-Stack Development Internship.

## Author

BCA Full-Stack Development Internship Project
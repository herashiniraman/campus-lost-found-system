# Campus Lost & Found Management System

## Project Overview
This is a full-stack web application developed for the Campus Lost & Found case study. The system centralizes lost and found reports, allows online submission, supports status tracking, and improves campus efficiency through a structured digital platform.

## Features
- Submit a lost item report
- Submit a found item report
- View all lost items
- View all found items
- View detailed item information
- Update item status
- Edit a report
- Delete a report
- Server-side validation
- SQL injection prevention using parameterized queries
- Basic XSS prevention
- Secure `.env` configuration

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- MySQL

## Project Structure
- `config/` database connection
- `controllers/` request handling logic
- `models/` database operations
- `routes/` API routes
- `middleware/` error handling
- `public/` frontend files
- `utils/` sanitization helper

## Installation
1. Run `npm install`
2. Create `.env` file based on `.env.example`
3. Make sure MySQL is running
4. Import `schema.sql`
5. Start the application with `npm start`

## Default URL
`http://localhost:3000`

## Security Measures
- Server-side validation using `express-validator`
- Input sanitization before saving to database
- Parameterized queries to prevent SQL injection
- Basic XSS prevention
- Environment variables for credentials

## Performance Optimization
The application was optimized by using deferred JavaScript loading and a lightweight interface with minimal assets. These improvements reduced render-blocking resources and improved the Lighthouse score.

## Deployment
The project repository is hosted on GitHub and prepared for deployment on a public platform.

## Author
Herashini Raman
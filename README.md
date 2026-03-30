# Project29M: Secure Portal & Management System

## Overview

Project29M is a robust, professional-grade web application designed for secure user management, content publishing, and comprehensive activity auditing. Built with Node.js, Express, and EJS templating, it features a clean, modern UI consistent across all modules, from user dashboards to administrative controls.

## Features

*   **Secure Authentication**: Robust user registration and login with token-based authentication.
*   **Role-Based Access Control (RBAC)**: Differentiated access for `user` and `admin` roles, ensuring secure and appropriate functionality for each.
*   **User Management**:
    *   User profiles with editable details (name, email, bio, profile picture).
    *   Admin console for managing user accounts (view, delete, restore).
*   **Content Management (Posts)**:
    *   Users can create, view, like, and comment on posts.
    *   Admins and post authors can delete posts.
    *   Community feed to browse all active posts.
*   **Audit Logging**: Comprehensive logging of all significant user and administrative actions for security and accountability.
*   **Consistent UI/UX**: A modern, clean, and intuitive user interface designed with Tailwind CSS, ensuring a seamless experience across the entire application.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:

*   Node.js (LTS version recommended)
*   npm (Node Package Manager)
*   MongoDB (local instance or a cloud-hosted service like MongoDB Atlas)

## Project Structure

```
project29M/
├── src/
│   ├── controllers/      # Application logic for routes
│   ├── db/               # Database connection and Mongoose models
│   ├── middleware/       # Authentication and authorization middleware
│   └── routes/           # API routes definitions
├── views/                # EJS template files for rendering UI
├── public/               # Static assets (CSS, JS, images)
├── .env                  # Environment variables
├── .gitignore            # Files/directories to ignore in Git
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Built With

*   **Node.js** - JavaScript runtime
*   **Express.js** - Web framework
*   **MongoDB** - NoSQL database
*   **Mongoose** - MongoDB object modeling for Node.js
*   **EJS** - Embedded JavaScript templates
*   **Tailwind CSS** - Utility-first CSS framework
*   **jsonwebtoken** - For implementing JWTs
*   **bcrypt** - For password hashing

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.

---

**&copy; 2024 Project29M. All rights reserved.**

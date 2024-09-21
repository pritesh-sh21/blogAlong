# Blog Along

This project is a simple API for managing blog posts. It allows users to create, retrieve, update, and delete blog posts. It also supports user authentication and file uploads (e.g., image uploads for blog post covers).

## Features

- **User Authentication**: Secure login using JWT tokens.
- **CRUD Operations**: 
  - Create new blog posts
  - Retrieve all posts or individual posts by ID
  - Update existing blog posts
  - Delete blog posts
- **File Upload**: Uploads files (such as images) as part of a post.
- **Authorization**: Posts are linked to the author, and only the author can update or delete their posts.

## Tech Stack

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing blog posts and user information.
- **Mongoose**: ODM for MongoDB and Node.js.
- **Multer**: Middleware for handling multipart/form-data (used for file uploads).
- **JWT (Json Web Token)**: For user authentication.
- **Bcrypt.js**: For password hashing.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Postman](https://www.postman.com/) (optional, for API testing)

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pritesh-sh21/blogAlong.git
   cd blogAlong
   ```

2. **Install dependencies**:
   - Move to api directory and install dependencies
     ```bash
     cd api
     npm install
     cd ..
     ```
   - Move to client directory and install dependencies
     ```bash
     cd client
     npm install
     cd ..
     ```

4. **Environment Variables**: Create a `.env` file in the api directory and add the following environment variables:
   ```
   MONGO_URI=mongodb://<your_mongo_uri>
   secret=<your_jwt_secret>
   ```

5. **Start the server**:
   ```bash
   cd api
   nodemon app.js
   ```
   - The server should now be running on `http://localhost:4000`.
6. **Start the react app**:
   ```bash
   cd client
   npm start
   ```

## API Endpoints

### Authentication

#### Register a New User
```http
POST /register
```
Request Body:
```json
{
  "username": "example",
  "password": "example_password"
}
```

#### Login User
```http
POST /login
```
Request Body:
```json
{
  "username": "example",
  "password": "example_password"
}
```

### Posts

#### Create a Post
```http
POST /post
```
Headers:
- `Authorization: Bearer <JWT_TOKEN>`

Form Data:
- `file`: Image file (multipart/form-data)
- `title`: Title of the post
- `summary`: Summary of the post
- `content`: Post content

#### Get All Posts
```http
GET /post
```

#### Get a Single Post by ID
```http
GET /post/:id
```

#### Update a Post
```http
PUT /post
```
Headers:
- `Authorization: Bearer <JWT_TOKEN>`

Form Data:
- `file`: (optional) New image file
- `id`: Post ID
- `title`: Updated title
- `summary`: Updated summary
- `content`: Updated content

#### Delete a Post by ID
```http
DELETE /post/:id
```
Headers:
- `Authorization: Bearer <JWT_TOKEN>`

## Cookies

JWT tokens are stored in cookies and are used for user authentication during post creation, update, and deletion.

## Folder Structure

```
.
├── controllers         # Controller functions for handling requests
|    authController.js
│   ├── createPostController.js
│   ├── getPostController.js
│   ├── updatePostController.js
│   └── deletePostController.js   
|   
├── models              # MongoDB models using Mongoose
│   ├── User.js
│   └── Post.js
├── routes              # API routes
|   ├── authRoutes.js
│   └── postRoutes.js
├── uploads             # Folder to store uploaded files
├── .env                # Environment variables (not included in source control)
├── app.js              # Main application file
└── README.md           # Project documentation
```

## Dependencies

- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Mongoose**: MongoDB object modeling for Node.js.
- **Multer**: Node.js middleware for handling multipart/form-data.
- **JWT**: Compact, URL-safe means of representing claims to be transferred between two parties.
- **Bcrypt.js**: Optimized bcrypt in JavaScript with zero dependencies.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

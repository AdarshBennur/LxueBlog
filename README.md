# LuxeBlog - Luxury Lifestyle Blog

A sophisticated luxury lifestyle blog built with a modern client-server architecture, featuring Astro for the frontend and Node.js/Express/MongoDB for the backend.

## Project Structure

The project follows a strict client-server architecture:

```
LuxeBlog/
├── client/                 # Frontend Astro application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Page layouts
│   │   ├── lib/            # Utility functions and API client
│   │   ├── pages/          # Page components and routes
│   │   └── styles/         # Global styles
│   ├── astro.config.mjs    # Astro configuration
│   ├── package.json        # Client dependencies
│   └── tailwind.config.mjs # Tailwind configuration
│
├── server/                 # Backend API server
│   ├── src/
│   │   ├── config/         # Server configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.js        # Server entry point
│   └── package.json        # Server dependencies
│
├── package.json            # Root package.json with workspace config
└── README.md               # Project documentation
```

## Technology Stack

### Frontend (client/)
- **Astro v3.0.0** - Static site generator framework
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety throughout the codebase
- **Axios** - HTTP client for API requests
- **JWT Decode** - For handling authentication tokens

### Backend (server/)
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt.js** - Password hashing

## Features

### Blog Features
- User authentication with JWT
- Post creation, reading, updating, and deletion (CRUD)
- Comments with nested replies and moderation
- Categories and tags for content organization
- Rich user profiles
- Newsletter subscription
- Responsive layouts
- SEO optimization

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Posts
- `GET /api/posts` - Get all posts (with filtering and pagination)
- `GET /api/posts/:id` - Get single post by ID
- `GET /api/posts/slug/:slug` - Get post by slug
- `POST /api/posts` - Create new post (auth required)
- `PUT /api/posts/:id` - Update post (auth required)
- `DELETE /api/posts/:id` - Delete post (auth required)

#### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments` - Add comment (auth required)
- `PUT /api/comments/:id` - Update comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)
- `PUT /api/comments/:id/approve` - Approve comment (admin only)

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/slug/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

#### Tags
- `GET /api/tags` - Get all tags
- `GET /api/tags/:id` - Get tag by ID
- `GET /api/tags/slug/:slug` - Get tag by slug
- `POST /api/tags` - Create tag (auth required)
- `PUT /api/tags/:id` - Update tag (admin only)
- `DELETE /api/tags/:id` - Delete tag (admin only)

#### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `PUT /api/users/profile` - Update own profile (auth required)

#### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `PUT /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter` - Get all subscribers (admin only)

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas cluster (already configured)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/luxeblog.git
   cd luxeblog
   ```

2. Install dependencies for both client and server
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies
   cd ../server && npm install
   ```

3. **Database Configuration**
   - MongoDB Atlas cluster is already configured and connected
   - Connection string: `mongodb+srv://adiluxe:luxe000@luxeblog.uf01fwt.mongodb.net/`
   - Database will auto-initialize with default categories, tags, and admin user

4. Start the development servers
   ```bash
   # From the root directory
   npm run dev
   ```
   
   Or start them separately:
   ```bash
   # Start server (from root)
   npm run server
   
   # Start client (from root) 
   npm run client
   ```

5. Access the application
   - **Frontend**: http://localhost:4321
   - **Backend API**: http://localhost:3001
   - **API Documentation**: http://localhost:3001/api

### Default Admin Account
- **Email**: admin@luxeblog.com
- **Password**: admin123
- **Role**: Admin with full access

### Building for Production
```bash
npm run build
```

## Deployment

### Client
The Astro frontend can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

### Server
The Express backend can be deployed to services like Heroku, Railway, or any VPS that supports Node.js applications.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Astro.js team for the amazing framework
- MongoDB Atlas for cloud database services
- The open-source community for all the fantastic libraries used in this project
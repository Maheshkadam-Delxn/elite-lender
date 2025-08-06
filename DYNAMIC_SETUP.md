# Elite Finsoles - Dynamic Admin Dashboard Setup

This guide will help you set up the dynamic admin dashboard for the Elite Finsoles application with MongoDB integration.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- The project dependencies installed

## Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

```env
MONGO_DB_URI=mongodb+srv://abhijeetghodedelxn:rcbQpHCqNXYRCMz1@cluster0.sfsxi.mongodb.net
DB_NAME=Elite-section
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## Database Setup

### 1. Create Admin User

First, create the default admin user by making a POST request to:

```
POST /api/setup-admin
```

This will create an admin user with:
- Username: `admin`
- Password: `admin123`
- Email: `admin@elitelender.com`

### 2. Initialize Default Data

Create default banner, loan types, and statistics data by making a POST request to:

```
POST /api/setup-data
```

This will populate the database with:
- Default banner content
- 6 loan types (Personal, Home, Business, Education, Vehicle, Gold)
- 3 statistics (Loan Options, Approval Rate, Customer Rating)

## Admin Dashboard Access

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the admin dashboard:
```
http://localhost:3000/admin-dashboard
```

3. Login with the default credentials:
- Username: `admin`
- Password: `admin123`

## Features

### Admin Dashboard Features

1. **Authentication System**
   - Secure login/logout
   - Session management
   - Password hashing with bcrypt

2. **Banner Management**
   - Edit banner title and subtitle
   - Add/remove/edit features
   - Customize feature icons and colors
   - Real-time preview

3. **Loan Types Management**
   - Add new loan types
   - Edit existing loan types
   - Customize icons, colors, and links
   - Set display order

4. **Statistics Management**
   - Add/edit statistics
   - Customize values, labels, and icons
   - Set display order

### Dynamic Content Features

1. **Real-time Updates**
   - Changes in admin dashboard reflect immediately on the main site
   - No need to restart the server

2. **Fallback Content**
   - If no data exists in the database, default content is displayed
   - Graceful error handling

3. **Icon System**
   - Support for FontAwesome icons
   - Dynamic icon rendering
   - Color customization

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Content Management
- `GET /api/banner` - Get banner data
- `POST /api/banner` - Create/update banner
- `GET /api/loan-types` - Get loan types
- `POST /api/loan-types` - Create loan type
- `GET /api/stats` - Get statistics
- `POST /api/stats` - Create statistic

### Setup
- `POST /api/setup-admin` - Create default admin user
- `POST /api/setup-data` - Initialize default content

## Database Models

### Banner Model
```javascript
{
  title: String,
  subtitle: String,
  features: [{
    icon: String,
    text: String,
    color: String
  }],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### LoanType Model
```javascript
{
  title: String,
  description: String,
  icon: String,
  iconColor: String,
  bgColor: String,
  link: String,
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Stat Model
```javascript
{
  value: String,
  label: String,
  icon: String,
  iconColor: String,
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

1. **Password Hashing**
   - All passwords are hashed using bcrypt
   - Salt rounds: 10

2. **Input Validation**
   - Server-side validation for all forms
   - Client-side validation for better UX

3. **Session Management**
   - Local storage for admin session
   - Automatic logout on session expiry

## Customization

### Adding New Icons

1. Import the icon from react-icons/fa in the Homee component
2. Add it to the `iconMap` object
3. Use the icon name in the admin dashboard

### Adding New Content Types

1. Create a new model in `src/models/`
2. Create API routes in `src/app/api/`
3. Add the content type to the admin dashboard
4. Update the Homee component to fetch and display the new content

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your connection string
   - Ensure the database name is correct
   - Verify network connectivity

2. **Admin Login Fails**
   - Run the setup-admin API first
   - Check if the admin user exists in the database
   - Verify password is correct

3. **Content Not Loading**
   - Run the setup-data API to initialize default content
   - Check browser console for errors
   - Verify API endpoints are working

### Debug Mode

To enable debug logging, add this to your `.env.local`:

```env
DEBUG=true
```

## Production Deployment

1. **Environment Variables**
   - Use production MongoDB URI
   - Set strong NEXTAUTH_SECRET
   - Update NEXTAUTH_URL to production domain

2. **Security**
   - Change default admin password
   - Enable HTTPS
   - Set up proper CORS policies

3. **Performance**
   - Enable MongoDB connection pooling
   - Implement caching for static content
   - Optimize images and assets

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure MongoDB is accessible
4. Check the API endpoints are responding correctly 
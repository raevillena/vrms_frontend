# VRMS Frontend - Virtual Research Management System

A modern React-based frontend application for the Virtual Research Management System developed for Mariano Marcos State University. This application provides a comprehensive platform for managing research studies, user authentication, and research project tracking.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Components Overview](#components-overview)
- [Styling and UI](#styling-and-ui)
- [Routing](#routing)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🎯 Overview

The VRMS Frontend is a single-page application (SPA) built with React that serves as the user interface for a comprehensive research management system. The application is designed to facilitate research project management, user authentication, and provide an intuitive dashboard for researchers and administrators.

### Key Objectives
- Provide a secure and user-friendly interface for research management
- Enable efficient tracking of research projects and their progress
- Offer responsive design for various device types
- Integrate with backend services for data management

## ✨ Features

### 🔐 Authentication System
- **Secure Login Interface**: Clean, professional login form with email and password authentication
- **Form Validation**: Real-time validation using Ant Design components
- **Password Visibility Toggle**: Enhanced UX with show/hide password functionality
- **Responsive Design**: Optimized for desktop and mobile devices

### 📊 Research Dashboard
- **Project Management**: Comprehensive table view of research studies
- **Progress Tracking**: Visual progress indicators for ongoing projects
- **Status Management**: Filter and sort projects by completion status
- **Study Organization**: Unique study numbering system for easy identification

### 🎨 User Interface
- **Modern Design**: Clean, professional interface using Ant Design components
- **Responsive Layout**: Adaptive design for various screen sizes
- **Intuitive Navigation**: Sidebar navigation with clear menu items
- **Brand Integration**: Mariano Marcos State University branding throughout

### 📱 Responsive Features
- **Mobile-First Approach**: Optimized for mobile devices
- **Flexible Layouts**: Adaptive components that work across screen sizes
- **Touch-Friendly**: Optimized for touch interactions

## 🛠 Technology Stack

### Core Technologies
- **React 17.0.2**: Modern JavaScript library for building user interfaces
- **React Router DOM 5.2.0**: Client-side routing for single-page applications
- **Ant Design 4.16.1**: Enterprise-class UI design language and React components

### Development Tools
- **Create React App**: Standard tooling for React applications
- **Web Vitals**: Performance monitoring and optimization
- **Jest & Testing Library**: Comprehensive testing framework

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari (latest versions)
- **Production Targets**: >0.2% browser usage, not dead, not op_mini all
- **Development**: Latest versions of major browsers

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js**: Version 14.0 or higher
- **npm**: Version 6.0 or higher (comes with Node.js)
- **Git**: For version control and cloning the repository

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 1GB free space
- **Internet Connection**: Required for package installation

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd vrms_frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## 📁 Project Structure

```
vrms_frontend/
├── public/                     # Static assets
│   ├── favicon.ico            # Website icon
│   ├── index.html             # Main HTML template
│   ├── logo192.png            # App logo (192x192)
│   ├── logo512.png            # App logo (512x512)
│   ├── manifest.json          # Web app manifest
│   └── robots.txt             # Search engine directives
├── src/                       # Source code
│   ├── components/            # Reusable React components
│   │   ├── CSS/              # Component-specific styles
│   │   │   ├── Login.css     # Login page styles
│   │   │   └── Userdash.css  # Dashboard styles
│   │   ├── images/           # Image assets
│   │   │   ├── loginpage.png # Login background
│   │   │   └── logo.png      # Application logo
│   │   ├── Login.js          # Login component
│   │   └── Userdash.js       # User dashboard component
│   ├── pages/                # Page components
│   │   └── Login.js          # Alternative login page
│   ├── styles/               # Global styles
│   │   └── CSS/              # Additional style files
│   ├── App.js                # Main application component
│   ├── index.js              # Application entry point
│   ├── index.css             # Global styles
│   └── reportWebVitals.js    # Performance monitoring
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Dependency lock file
└── README.md                 # Project documentation
```

## 🏃‍♂️ Getting Started

### First Time Setup

1. **Environment Setup**
   ```bash
   # Ensure Node.js is installed
   node --version
   npm --version
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Access the Application**
   - Open your browser to `http://localhost:3000`
   - You should see the login page

### Development Workflow

1. **Make Changes**: Edit files in the `src` directory
2. **Hot Reload**: Changes automatically reflect in the browser
3. **Test Changes**: Use the built-in testing framework
4. **Build for Production**: Run `npm run build` when ready

## 📜 Available Scripts

### Development Scripts
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Eject from Create React App (irreversible)
npm run eject
```

### Script Descriptions

- **`npm start`**: Runs the app in development mode with hot reloading
- **`npm test`**: Launches the test runner in interactive watch mode
- **`npm run build`**: Builds the app for production to the `build` folder
- **`npm run eject`**: Removes the single build dependency (use with caution)

## 🧩 Components Overview

### Login Component (`src/components/Login.js`)
**Purpose**: Handles user authentication and login functionality

**Features**:
- Email and password input fields
- Form validation with error messages
- Password visibility toggle
- Responsive design with background image
- Integration with Ant Design components

**Key Props**:
- `onFinish`: Callback for successful form submission
- `onFinishFailed`: Callback for form validation errors

### User Dashboard Component (`src/components/Userdash.js`)
**Purpose**: Main dashboard for managing research studies

**Features**:
- Research studies table with sorting and filtering
- Progress tracking for individual studies
- Status management (Completed, Ongoing)
- Sidebar navigation
- Responsive layout

**Data Structure**:
- Study number, title, creation date, last updated
- Progress percentage and status
- Action buttons for management

### App Component (`src/App.js`)
**Purpose**: Main application component with routing

**Features**:
- React Router setup
- Route definitions for login and dashboard
- Browser router configuration

## 🎨 Styling and UI

### Design System
- **Primary Color**: #A0BF85 (Green)
- **Background**: #FFFFFF (White)
- **Header Background**: #FAFAFA (Light Gray)
- **Typography**: Montserrat and Inter fonts

### CSS Architecture
- **Component-Specific Styles**: Each component has its own CSS file
- **Ant Design Integration**: Custom styles override default Ant Design styles
- **Responsive Design**: Media queries for different screen sizes
- **Positioning**: Absolute positioning for precise layout control

### Key Style Files
- `src/components/CSS/Login.css`: Login page styling
- `src/components/CSS/Userdash.css`: Dashboard styling
- `src/index.css`: Global styles

## 🛣 Routing

### Route Configuration
```javascript
// Main routes
/ → Login component
/user → User dashboard component
```

### Navigation
- **Login Route**: Entry point for authentication
- **Dashboard Route**: Main application interface
- **Programmatic Navigation**: Uses React Router for navigation

## 📝 Development Guidelines

### Code Standards
- **JavaScript**: Use modern ES6+ features
- **React**: Functional components with hooks
- **Styling**: CSS with BEM methodology
- **Naming**: camelCase for variables and functions

### Best Practices
- **Component Structure**: Keep components focused and reusable
- **State Management**: Use React hooks for local state
- **Props**: Define clear prop interfaces
- **Error Handling**: Implement proper error boundaries

### File Organization
- **Components**: Group related components together
- **Styles**: Keep styles close to components
- **Assets**: Organize images and static files logically

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

### Code Review Process
- All changes must be reviewed before merging
- Ensure tests pass before submitting
- Follow the established coding standards
- Update documentation as needed

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm start
```

#### Dependency Issues
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Issues
```bash
# Clear build directory
rm -rf build
# Rebuild
npm run build
```

### Performance Issues
- Check browser console for errors
- Use React DevTools for component debugging
- Monitor bundle size with `npm run build`

### Browser Compatibility
- Ensure you're using a supported browser
- Check for JavaScript errors in console
- Verify all dependencies are installed

## 📄 License

This project is developed for Mariano Marcos State University. Please refer to the university's policies regarding software usage and distribution.

## 📞 Support

For technical support or questions about this application:

- **Documentation**: Refer to this README and inline code comments
- **Issues**: Report bugs through the project's issue tracker
- **Development Team**: Contact the development team for feature requests

---

**Last Updated**: December 2024  
**Version**: 0.1.0  
**Maintainer**: VRMS Development Team

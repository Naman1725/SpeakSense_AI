# SpeakSense.ai - Login Page

A beautiful, modern login page for SpeakSense.ai application.

## Features

- Clean, modern design with gradient background
- Email/Password authentication
- Social login options (Google, GitHub, LinkedIn, Facebook)
- Remember me functionality
- Password visibility toggle
- Responsive design
- Smooth animations

## Valid Credentials

**Email:** naman.ptk30@gmail.com
**Password:** 1718730namanA!

## Running the Login Page

1. Navigate to the login-frontend directory:
   ```
   cd login-frontend
   ```

2. Start the login page server (Port 3001):
   ```
   npm start
   ```

   Or use the development mode:
   ```
   npm run dev
   ```

3. The login page will open automatically at `http://localhost:3001`

## Integration

After successful login, the page will redirect to the main application at `http://localhost:3000`.

Make sure your main SpeakSense.ai application is running on port 3000.

## Project Structure

```
login-frontend/
├── index.html          # Main HTML file
├── login.css          # Styling
├── login.js           # Authentication logic
├── package.json       # NPM configuration
└── README.md          # This file
```

## Customization

To change the redirect URL or credentials, edit the following in `login.js`:

```javascript
const VALID_EMAIL = 'your-email@example.com';
const VALID_PASSWORD = 'your-password';
const MAIN_APP_URL = 'http://localhost:3000';
```

## Color Scheme

The login page uses the same gradient color scheme as the main application:
- Primary: #667eea
- Secondary: #764ba2

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

© 2025 Naman Sharma. All rights reserved.

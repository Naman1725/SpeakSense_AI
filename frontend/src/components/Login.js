import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    age: '',
    profession: '',
    experience: '',
    goal: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      // Validation for signup
      if (!formData.email || !formData.password || !formData.fullName || !formData.age || !formData.profession) {
        alert('Please fill in all required fields');
        return;
      }

      // Save user data to localStorage
      const userData = {
        email: formData.email,
        fullName: formData.fullName,
        age: formData.age,
        profession: formData.profession,
        experience: formData.experience,
        goal: formData.goal,
        joinedAt: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');

      console.log('User signed up:', userData);
      onLoginSuccess(userData);
    } else {
      // Login validation
      if (!formData.email || !formData.password) {
        alert('Please enter email and password');
        return;
      }

      // Check if user exists
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        localStorage.setItem('isAuthenticated', 'true');
        onLoginSuccess(userData);
      } else {
        alert('No account found. Please sign up first.');
      }
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({
      email: '',
      password: '',
      fullName: '',
      age: '',
      profession: '',
      experience: '',
      goal: ''
    });
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-section-login">
            <div className="logo-icon-login">SS</div>
            <div className="logo-text-login">
              <h1>SpeakSense.ai</h1>
              <p className="subtitle-login">Master Your Voice, Command Any Stage</p>
            </div>
          </div>
        </div>

        <div className="login-content">
          <h2 className="form-title">{isSignup ? 'Create Your Account' : 'Welcome Back'}</h2>
          <p className="form-subtitle">
            {isSignup
              ? 'Start your journey to becoming a confident speaker'
              : 'Continue improving your communication skills'}
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            {isSignup && (
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required={isSignup}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {isSignup && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="age">Age *</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Your age"
                      min="13"
                      max="120"
                      required={isSignup}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="profession">Profession *</label>
                    <input
                      type="text"
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      placeholder="e.g., Student, Professional"
                      required={isSignup}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="experience">Speaking Experience</label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                  >
                    <option value="">Select your level</option>
                    <option value="beginner">Beginner - New to public speaking</option>
                    <option value="intermediate">Intermediate - Some experience</option>
                    <option value="advanced">Advanced - Regular speaker</option>
                    <option value="expert">Expert - Professional speaker</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="goal">What's your goal?</label>
                  <textarea
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    placeholder="e.g., Improve presentation skills, reduce anxiety, enhance vocal delivery..."
                    rows="3"
                  />
                </div>
              </>
            )}

            <button type="submit" className="submit-btn">
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="form-footer">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button type="button" onClick={toggleMode} className="toggle-btn">
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        <div className="login-features">
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">AI-Powered Analysis</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span className="feature-text">Real-time Feedback</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚀</span>
            <span className="feature-text">Track Progress</span>
          </div>
        </div>
      </div>

      <footer className="login-footer">
        <p>© 2025 Naman Sharma. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login;

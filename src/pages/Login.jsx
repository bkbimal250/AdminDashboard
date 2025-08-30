import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { authAPI } from '../services/api';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Building2, 
  Users as UsersIcon,
  Clock,
  Calendar,
  FileText,
  MessageSquare,
  Bell,
  Settings
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, user } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Remove the test API call - it's causing confusion
  // useEffect(() => {
  //   const testAPIConnection = async () => {
  //     try {
  //       console.log('Testing API connection...');
  //       const response = await authAPI.login({ username: 'test', password: 'test' });
  //       console.log('API connection test response:', response);
  //     } catch (error) {
  //       console.log('API connection test error (expected):', error.response?.status);
  //     }
  //   };
  //   
  //   testAPIConnection();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    console.log('=== LOGIN DEBUG START ===');
    console.log('Submitting login form with data:', formData);
    console.log('Current URL:', window.location.href);
    
    try {
      const result = await login(formData);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to dashboard...');
        console.log('User state after login:', user);
        console.log('LocalStorage token:', localStorage.getItem('token'));
        console.log('LocalStorage user:', localStorage.getItem('user'));
        
        // Test: Check what's actually in localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          console.log('Stored token length:', storedToken.length);
          console.log('Stored token contains dots:', storedToken.includes('.'));
          console.log('Stored token type:', storedToken.includes('.') && storedToken.length > 100 ? 'JWT' : 'Simple');
        }
        
        // Force a small delay to ensure state is updated
        setTimeout(() => {
          console.log('About to navigate to /dashboard');
          navigate('/dashboard');
        }, 100);
      } else {
        console.log('Login failed:', result.error);
      }
    } catch (error) {
      console.error('Exception during login:', error);
    }
    
    console.log('=== LOGIN DEBUG END ===');
  };

  const features = [
    { icon: Clock, title: 'Attendance Tracking', description: 'Clock in/out with ease' },
    { icon: Calendar, title: 'Leave Management', description: 'Request and approve leaves' },
    { icon: UsersIcon, title: 'User Management', description: 'Manage team members' },
    { icon: FileText, title: 'Document Sharing', description: 'Share important files' },
    { icon: MessageSquare, title: 'Team Chat', description: 'Communicate seamlessly' },
    { icon: Bell, title: 'Notifications', description: 'Stay updated always' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 text-white p-12">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Building2 className="h-8 w-8 mr-3" />
              <h1 className="text-3xl font-bold">Employee Attendance</h1>
            </div>
            <p className="text-primary-100 text-lg">
              Streamline your workforce management with our comprehensive attendance system
            </p>
          </div>
          
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-primary-100 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-text-primary">Employee Attendance</h1>
            </div>
            <p className="text-text-secondary">
              Sign in to access your dashboard
            </p>
          </div>

          <Card className="animate-fade-in">
            <Card.Header className="text-center">
              <h2 className="text-2xl font-bold text-text-primary">Welcome Back</h2>
              <p className="text-text-secondary mt-2">
                Sign in to your account to continue
              </p>
            </Card.Header>

            <Card.Body>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                    <p className="text-danger-700 text-sm">{error}</p>
                  </div>
                )}

                <Input
                  label="Username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  leftIcon={<User className="h-4 w-4" />}
                  error={formErrors.username}
                  placeholder="Enter your username"
                  required
                />

                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-text-muted hover:text-text-primary"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  error={formErrors.password}
                  placeholder="Enter your password"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Card.Body>

            <Card.Footer className="text-center">
              <p className="text-sm text-text-secondary">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Contact your administrator
                </button>
              </p>
            </Card.Footer>
          </Card>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
            <h3 className="text-sm font-medium text-text-primary mb-2">Demo Credentials</h3>
            <div className="space-y-1 text-xs text-text-secondary">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>User:</strong> user / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

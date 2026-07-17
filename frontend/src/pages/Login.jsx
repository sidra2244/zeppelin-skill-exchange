// pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, LogIn } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { COLORS } from '../utils/constants';

function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const colors = COLORS;
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(form.username, form.password);
    
    setIsLoading(false);

    if (result.success) {
      navigate('/browse');
    } else {
      setError(result.error || 'Invalid username or password');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const floatingAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ 
      background: 'linear-gradient(to bottom right, #EEF2FF, #F5F3FF, #F5F3FF)'
    }}>
      {/* Animated Background Circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-200/40 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-violet-200/40 blur-3xl"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative"
      >
        <Card className="p-8">
          {/* Back Button */}
          <motion.div variants={itemVariants}>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors group"
              style={{ color: colors.textSecondary }}
            >
              <motion.span
                whileHover={{ x: -3 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft size={16} />
              </motion.span>
              Back to Home
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mt-4 mb-8">
            <motion.div
              animate={floatingAnimation}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4"
              style={{ 
                background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.primaryDark})`,
                boxShadow: `0 8px 32px ${colors.primary}50`
              }}
            >
              <LogIn size={24} />
            </motion.div>
            <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
              Welcome Back
            </h1>
            <p className="mt-2" style={{ color: colors.textSecondary }}>
              Log in to continue your journey
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg text-sm"
              style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <Input
                label="Username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
                icon={<Mail size={18} />}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                icon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="sr-only"
                  />
                  <div 
                    className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                      rememberMe ? 'border-violet-600' : 'border-gray-300 group-hover:border-violet-400'
                    }`}
                    style={rememberMe ? { backgroundColor: colors.primary } : {}}
                  >
                    {rememberMe && <CheckCircle size={14} className="text-white" />}
                  </div>
                </div>
                <span className="text-sm transition-colors" style={{ color: colors.textSecondary }}>
                  Remember me
                </span>
              </label>
              <a href="#" className="text-sm font-medium transition-colors hover:underline" style={{ color: colors.primary }}>
                Forgot password?
              </a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
                className="py-3.5"
              >
                {isLoading ? 'Signing in...' : 'Log In'}
              </Button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="text-center text-sm mt-6" style={{ color: colors.textSecondary }}>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold transition-colors hover:underline" style={{ color: colors.primary }}>
              Create one now
            </Link>
          </motion.p>
        </Card>
      </motion.div>
    </div>
  );
}

export default Login;
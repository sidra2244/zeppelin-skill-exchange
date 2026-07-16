// pages/SignUp.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { COLORS } from '../utils/constants';

function SignUp() {
  const navigate = useNavigate();
  const { register } = useUser();
  const colors = COLORS;
  const [form, setForm] = useState({ 
    username: '',
    first_name: '', 
    last_name: '',
    email: '', 
    password: '',
    confirm_password: '',
    bio: '',
    city: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.username || !form.first_name || !form.last_name || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    // Prepare data for API
    const { confirm_password, ...signupData } = form;
    const result = await register(signupData);
    
    setIsLoading(false);

    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error || 'Signup failed. Please try again.');
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
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden" style={{ 
      background: 'linear-gradient(to bottom right, #F5F3FF, #FAF5FF, #EEF2FF)'
    }}>
      {/* Animated Background Circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-200/40 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-200/40 blur-3xl"
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
              <Sparkles size={24} />
            </motion.div>
            <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
              Create Account
            </h1>
            <p className="mt-2" style={{ color: colors.textSecondary }}>
              Join our community and start trading
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              required
              icon={<User size={18} />}
            />

            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Input
                  label="First Name"
                  type="text"
                  name="first_name"
                  placeholder="First name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  icon={<User size={18} />}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  label="Last Name"
                  type="text"
                  name="last_name"
                  placeholder="Last name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  icon={<User size={18} />}
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
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
                placeholder="Create a strong password"
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

            <motion.div variants={itemVariants}>
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                placeholder="Confirm your password"
                value={form.confirm_password}
                onChange={handleChange}
                required
                icon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </motion.div>


            <motion.div variants={itemVariants}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    className="sr-only"
                  />
                  <div 
                    className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center flex-shrink-0 ${
                      agreeTerms ? 'border-violet-600' : 'border-gray-300 group-hover:border-violet-400'
                    }`}
                    style={agreeTerms ? { backgroundColor: colors.primary } : {}}
                  >
                    {agreeTerms && <CheckCircle size={14} className="text-white" />}
                  </div>
                </div>
                <span className="text-sm transition-colors" style={{ color: colors.textSecondary }}>
                  I agree to the{' '}
                  <a href="#" className="font-medium hover:underline" style={{ color: colors.primary }}>
                    Terms
                  </a>
                  {' '}&{' '}
                  <a href="#" className="font-medium hover:underline" style={{ color: colors.primary }}>
                    Privacy Policy
                  </a>
                </span>
              </label>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
                className="py-3.5"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="text-center text-sm mt-6" style={{ color: colors.textSecondary }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors hover:underline" style={{ color: colors.primary }}>
              Log in here
            </Link>
          </motion.p>
        </Card>
      </motion.div>
    </div>
  );
}

export default SignUp;
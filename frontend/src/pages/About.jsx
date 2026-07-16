import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { 
  Users, Award, BookOpen, Sparkles, Heart, 
  Globe, Shield, Zap, Target, MessageCircle,
  CheckCircle, TrendingUp, Clock, Star,
  Coffee, Smile, Camera, Music, Code,
  Palette, Dumbbell, Languages, Wrench
} from 'lucide-react'

function About() {
  const stats = [
    { value: "1250+", label: "Active Members", icon: Users },
    { value: "430+", label: "Skills Shared", icon: Award },
    { value: "20+", label: "Categories", icon: BookOpen },
    { value: "98%", label: "Satisfaction Rate", icon: Star },
  ]

  const features = [
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect with talented individuals in your local community who share your passion for learning and teaching."
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "All members are verified and we prioritize your safety with in-app messaging and reporting features."
    },
    {
      icon: Zap,
      title: "Fast & Easy",
      description: "Get started in minutes. Find skills, connect with teachers, and start learning immediately."
    },
    {
      icon: Target,
      title: "Skill Based",
      description: "Focus on specific skills you want to learn or teach. No generic content, only practical knowledge."
    },
    {
      icon: Globe,
      title: "Local Focus",
      description: "Connect with people near you for in-person skill exchange and build real-world connections."
    },
    {
      icon: Heart,
      title: "Free & Accessible",
      description: "Skill exchange is free for everyone. No hidden charges, just pure knowledge sharing."
    }
  ]

  const categories = [
    { name: "Programming", icon: Code, color: "from-blue-500 to-cyan-500" },
    { name: "Music", icon: Music, color: "from-purple-500 to-pink-500" },
    { name: "Design", icon: Palette, color: "from-orange-500 to-red-500" },
    { name: "Fitness", icon: Dumbbell, color: "from-emerald-500 to-teal-500" },
    { name: "Language", icon: Languages, color: "from-yellow-500 to-amber-500" },
    { name: "Home Repair", icon: Wrench, color: "from-slate-500 to-gray-500" },
  ]

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.6 }
    })
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium border border-white/30 mb-6"
            >
              <Sparkles size={16} />
              About LocalSkill Exchange Board
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              Connecting People
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200">
                Through Skills
              </span>
            </h1>
            <p className="mt-6 text-xl text-violet-100 max-w-2xl mx-auto leading-relaxed">
              We believe in the power of knowledge sharing. Our platform connects people who want to learn with those who want to teach.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/signup" className="bg-white text-violet-600 px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
                Join Community
              </Link>
              <Link to="/browse" className="border-2 border-white/50 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
                Browse Skills
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-violet-600 font-semibold uppercase tracking-widest text-sm">Our Mission</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-3">Empowering Communities Through Skill Exchange</h2>
              <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                LocalSkill Exchange Board is a community-driven platform that connects people who want to learn with those who want to teach. We believe that everyone has something valuable to share.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Learn new skills from local experts",
                  "Teach what you know and help others grow",
                  "Build meaningful connections in your community",
                  "Free and accessible for everyone"
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle size={20} className="text-violet-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-200/30 rounded-full blur-3xl" />
              <div className="grid grid-cols-2 gap-4">
                {categories.slice(0, 6).map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-gradient-to-br ${cat.color} p-6 rounded-2xl text-white shadow-lg`}
                  >
                    <cat.icon size={28} />
                    <p className="font-semibold mt-2 text-sm">{cat.name}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-violet-600 font-semibold uppercase tracking-widest text-sm">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">Features That Make Us Different</h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              We're built differently. Here's what makes LocalSkill Exchange Board the best platform for skill exchange.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mb-5">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-3 text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <Footer />
    </div>
  )
}

export default About
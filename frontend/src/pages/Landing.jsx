// pages/Landing.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// Apne assets folder se image import karein
import HeroImage from "../assets/hero.png";

import {
  Music,
  Code2,
  ChefHat,
  Wrench,
  Palette,
  Languages,
  Dumbbell,
  Package,
  ArrowRight,
  UserPlus,
  Search,
  Handshake,
} from "lucide-react";

const categories = [
  { name: "Programming", count: 215, icon: Code2 },
  { name: "Music", count: 128, icon: Music },
  { name: "Cooking", count: 96, icon: ChefHat },
  { name: "Design", count: 63, icon: Palette },
  { name: "Fitness", count: 58, icon: Dumbbell },
  { name: "Language", count: 45, icon: Languages },
  { name: "Home Repair", count: 76, icon: Wrench },
  { name: "Other", count: 67, icon: Package },
];

const stats = [
  { value: "1250+", label: "Active Listings" },
  { value: "850+", label: "Community Members" },
  { value: "430+", label: "Skills Shared" },
  { value: "20+", label: "Categories" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6 },
  }),
};

function Landing() {
  // Check if user is logged in
  const userData = localStorage.getItem('user');
  const isAuthenticated = !!userData;

  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <span className="inline-flex items-center bg-violet-50 text-violet-700 rounded-full px-4 py-2 font-semibold text-sm">
               Learn • Teach • Connect
            </span>
            <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight text-gray-900">
              Exchange Skills.
              <span className="block text-violet-600">Grow Together.</span>
            </h1>
            <p className="mt-8 text-lg leading-8 text-gray-600 max-w-xl">
              Discover talented people in your city. Teach what you know. Learn something new.
              Build real connections through skill exchange.
            </p>
            <div className="mt-10 flex gap-4 flex-wrap">
              <Link
                to="/signup"
                className="bg-violet-600 hover:bg-violet-700 text-white px-7 py-4 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition"
              >
                Get Started <ArrowRight size={18} />
              </Link>
              <Link
                to="/browse"
                className="border-2 border-violet-600 text-violet-600 hover:bg-violet-50 px-7 py-4 rounded-xl font-semibold transition"
              >
                Browse Skills
              </Link>
            </div>
          </motion.div>

          {/* RIGHT - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="absolute w-[520px] h-[520px] rounded-full bg-violet-100 blur-3xl opacity-60"></div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="relative z-10"
            >
              <img
                src={HeroImage}
                alt="Hero"
                className="w-full max-w-[620px] drop-shadow-2xl rounded-2xl"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm py-8 text-center hover:shadow-xl transition"
            >
              <h2 className="text-4xl font-bold text-violet-600">{item.value}</h2>
              <p className="mt-2 text-gray-500">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-violet-600 font-semibold uppercase tracking-widest">Categories</span>
          <h2 className="mt-3 text-4xl font-bold text-gray-900">Explore Popular Skills</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Browse hundreds of skills shared by people in your local community.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {categories.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition">
                  <Icon size={30} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{item.name}</h3>
                <p className="mt-2 text-gray-500">{item.count} Listings</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      
      <section id="how-it-works" className="bg-violet-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-violet-600 font-semibold uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl font-bold mt-3">Start Exchanging Skills in Minutes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -8 }} className="bg-white rounded-3xl p-10 shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <UserPlus size={32} />
              </div>
              <h3 className="mt-7 text-2xl font-bold">Create Account</h3>
              <p className="mt-4 text-gray-500 leading-7">
                Sign up in seconds and create your profile with the skills you can teach or learn.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -8 }} className="bg-white rounded-3xl p-10 shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <Search size={32} />
              </div>
              <h3 className="mt-7 text-2xl font-bold">Find Skills</h3>
              <p className="mt-4 text-gray-500 leading-7">
                Browse nearby people, discover new opportunities and connect instantly.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -8 }} className="bg-white rounded-3xl p-10 shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <Handshake size={32} />
              </div>
              <h3 className="mt-7 text-2xl font-bold">Exchange Knowledge</h3>
              <p className="mt-4 text-gray-500 leading-7">
                Meet, collaborate and help each other grow through real-world skill exchange.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA - Ultra Minimal */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Ready to Share Your Skills?
          </h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto text-lg">
            Join thousands of learners and teachers. Start your journey today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3.5 rounded-xl font-semibold transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/browse"
              className="border border-gray-300 hover:border-violet-600 text-gray-700 hover:text-violet-600 px-8 py-3.5 rounded-xl font-semibold transition"
            >
              Browse Skills
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
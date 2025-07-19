import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaCopyright,
  FaHeartbeat,
  FaChartLine,
  FaTachometerAlt,
  FaUserPlus,
  FaSignInAlt,
  FaPlusCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import cowImage from "../images/cows.jfif";
import chickenImage from "../images/chicken.jfif";
import pigImage from "../images/pig.jfif";
// import goatImage from "../Images/goat.jfif"; // re-add goat image import
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Set axios baseURL from Vite env (move this to main.jsx if not already there)
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

function LandingPage() {
  const navigate = useNavigate();

  // Add a global axios interceptor for JWT expiration
  React.useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Check for JWT expiration (401 Unauthorized)
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please login again.", {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  // Hero slideshow images and index
  const heroImages = [cowImage, chickenImage, pigImage];
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 12000); // changed interval from 6000 to 12000 ms (12 seconds)
    return () => clearInterval(iv);
  }, []);
  const currentHero = heroImages[heroIndex];

  return (
    <>
      {/* HERO SECTION (slideshow) */}
      <div
        className="relative min-h-screen bg-cover bg-center transition-background duration-1000"
        style={{ backgroundImage: `url(${currentHero})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
          <Navbar />
          <motion.h1
            className="text-6xl font-extrabold mb-4 text-center drop-shadow-lg"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Digi-Shamba
          </motion.h1>
          <motion.p
            className="mb-8 max-w-2xl text-center text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Revolutionize your livestock management with real-time digital
            records, performance insights, and health tracking — all in one
            platform designed for modern-day farmers.
          </motion.p>
          <div className="flex gap-4">
            <button
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
            {/* Removed Farmer Loans button here */}
          </div>
        </div>
      </div>

      {/* FEATURES SECTION (Slide from Right) */}
      <motion.section
        className="bg-white py-16 px-8 text-gray-800 text-center"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-6">Why Choose Digi-Shamba?</h2>
        <div className="grid md:grid-cols-3 gap-10 mt-10">
          <div className="flex flex-col items-center p-6 rounded-xl shadow bg-gray-50 hover:shadow-lg transition">
            <FaHeartbeat className="text-5xl text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Health Tracking</h3>
            <p>
              Monitor treatments, vaccinations, and illnesses with precision to
              ensure your herd’s well-being.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-xl shadow bg-gray-50 hover:shadow-lg transition">
            <FaChartLine className="text-5xl text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Performance Insights</h3>
            <p>
              Track milk yields, growth, and productivity trends to make
              informed farming decisions.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-xl shadow bg-gray-50 hover:shadow-lg transition">
            <FaTachometerAlt className="text-5xl text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Dashboard</h3>
            <p>
              Visualize your farm data with easy-to-use dashboards and real-time
              updates.
            </p>
          </div>
        </div>
      </motion.section>

      {/* GETTING STARTED SECTION */}
      <section className="flex flex-col md:flex-row bg-white py-16 px-8">
        {/* Left: chicken image */}
        <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <img
            src={chickenImage}
            alt="Chicken"
            className="w-3/4 md:w-3/4 rounded-lg shadow-lg object-cover"
          />
        </div>
        {/* Right: styled step cards (variable height) */}
        <div className="md:w-1/2 flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-bold mb-4 text-center md:text-left">
            Getting Started
          </h2>
          {[
            {
              icon: <FaUserPlus className="text-green-600 text-3xl" />,
              title: "Create Account",
              desc: "Click Sign Up to join Digi-Shamba and set up your farm profile.",
            },
            {
              icon: <FaSignInAlt className="text-blue-600 text-3xl" />,
              title: "Login Securely",
              desc: "Use your credentials to access your farm dashboard.",
            },
            {
              icon: <FaPlusCircle className="text-purple-600 text-3xl" />,
              title: "Add Your Animals",
              desc: "Register livestock under Daily Records to start tracking.",
            },
            {
              icon: <FaCalendarAlt className="text-yellow-600 text-3xl" />,
              title: "Record Daily Data",
              desc: "Log health checks and production entries for each animal.",
            },
            {
              icon: <FaChartLine className="text-indigo-600 text-3xl" />,
              title: "View Insights",
              desc: "Analyze trends and optimize operations via Analytics.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="flex items-start space-x-4 p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
            >
              <div className="flex-shrink-0">{step.icon}</div>
              <div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-700">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION (Slide from Left) */}
      <motion.section
        className="bg-gray-100 py-16 px-8 text-center"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-6">What Farmers Are Saying</h2>
        <div className="grid md:grid-cols-2 gap-10 mt-10">
          <blockquote className="bg-white p-6 rounded-lg shadow">
            <p className="italic">
              "Since switching to Digi-Shamba, I can manage my herd more
              efficiently and focus on growth."
            </p>
            <footer className="mt-4 font-semibold text-sm text-gray-600">
              – Jane, Dairy Farmer in Nyandarua
            </footer>
          </blockquote>
          <blockquote className="bg-white p-6 rounded-lg shadow">
            <p className="italic">
              "I love how easy it is to track my animals and plan for vet visits.
              A true game changer!"
            </p>
            <footer className="mt-4 font-semibold text-sm text-gray-600">
              – Otieno, Livestock Farmer in Kisumu
            </footer>
          </blockquote>
        </div>
      </motion.section>

      {/* CTA SECTION */}
      <section className="bg-white text-black py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Start Managing Your Farm Smarter
        </h2>
        <p className="mb-6">
          Join hundreds of farmers using Digi-Shamba to simplify and scale their
          livestock operations.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 rounded-lg bg-green-700 text-white font-bold hover:bg-green-800 transition"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
          <button
            className="px-6 py-2 rounded-lg border border-black text-black hover:bg-gray-200 transition"
            onClick={() => navigate("/login")}
          >
            Already a Member?
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center text-center md:text-left gap-y-10 md:gap-y-0 md:gap-x-20">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="flex justify-center md:justify-start items-center gap-2">
              <FaPhoneAlt /> +254 724 829437
            </p>
            <p className="flex justify-center md:justify-start items-center gap-2 mt-2">
              <FaEnvelope />
              <a
                href="mailto:digishamba@gmail.com"
                className="hover:underline text-white"
              >
                digishamba@gmail.com
              </a>
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start gap-6 text-2xl">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebook className="hover:text-blue-500" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter className="hover:text-sky-400" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram className="hover:text-pink-400" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div>
            <h3 className="text-xl font-bold mb-4">Digi-Shamba</h3>
            <p className="flex justify-center md:justify-start items-center gap-2 text-sm text-gray-400">
              <FaCopyright /> {new Date().getFullYear()} Digi-Shamba. All rights reserved. Developed by Brian Kuria Mwangi.
            </p>
          </div>
        </div>
      </footer>

      {/* Place ToastContainer at the root so it works everywhere */}
      <ToastContainer />
    </>
  );
}

export default LandingPage;



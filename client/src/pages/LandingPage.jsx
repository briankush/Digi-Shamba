import React from "react";
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
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import cowImage from "../Images/cows.jfif";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO SECTION */}
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${cowImage})` }}
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
          </div>
        </div>
      </div>

      {/* FEATURES SECTION (Slide from Right) */}
      <motion.section
        className="bg-white py-16 px-8 text-gray-800 text-center"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
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

      {/* TESTIMONIALS SECTION (Slide from Left) */}
      <motion.section
        className="bg-gray-100 py-16 px-8 text-center"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
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
              <FaPhoneAlt /> +254 712 345 678
            </p>
            <p className="flex justify-center md:justify-start items-center gap-2 mt-2">
              <FaEnvelope /> support@digishamba.co.ke
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
              <FaCopyright /> {new Date().getFullYear()} Digi-Shamba. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;

"use client";
import React, { useEffect, useState } from "react";
import MainNavbar from "./(components)/MainNavbar";
import CreatePlanForm from "./(components)/client/CreatePlanForm";
import Footer from "./(components)/Footer";
import Aim from "./(components)/Aim";
import Reviews from "./(components)/reviews/Reviews";
import RecemendedTours from "./(components)/RecemendedTours";
import TrendingTours from "./(components)/TrendingTours";
import TravelGuideChatbot from "./(components)/TravelGuideChatbot";
import { MessageSquare, X } from "lucide-react";

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userRole, setUserRole] = useState("client");

  useEffect(() => {
    setUserRole(localStorage.getItem("userType") ?? "client");
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 relative">
      {/* Enhanced Background with Blur and Glass Effect */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Background Image with Stronger Blur */}
        <div
          className="w-full h-full bg-cover bg-center blur-sm scale-105"
          style={{
            backgroundImage: "url('/assets/bg.png')",
            filter: "blur(8px) brightness(0.8)",
          }}
        />

        {/* Glass Morphism Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10">
        {/* Header/Navigation */}
        <MainNavbar />

        {/* Hero Section with Glass Card */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white/30 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-white/20">
            <p className="text-xl text-gray-800 mb-2 leading-relaxed text-center">
              Make your journey in Sri Lanka unforgettable with just a few
              clicks! Discover the best places, plan your route, and book
              top-rated hotels and tour guides effortlessly. Start your
              adventure today! 🌴
            </p>
          </div>
        </section>

        {/* Create plan Form */}
        {userRole !== "tour_guide" && <CreatePlanForm />}

        {/* Tours Section with Glass Cards */}
        <section className="container mx-auto px-4 my-16 space-y-6">
          {/* Trending Tours */}
          <TrendingTours />

          {/* Recommended Tours */}
          <RecemendedTours />
        </section>

        <Reviews showActions={false} />

        {/* Our Aim Section with Glass Card */}
        <Aim />

        {/* Footer with Glass Effect */}
        <Footer />
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="relative">
            <TravelGuideChatbot />
            <button
              onClick={toggleChat}
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={toggleChat}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all"
            aria-label="Open chat"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;

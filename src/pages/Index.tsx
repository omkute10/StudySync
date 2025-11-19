import { Suspense, lazy, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

// Handle page load for animations
const Index = () => {
  useEffect(() => {
    // Ensure smooth scrolling works correctly
    const handleHashLinkClick = () => {
      const { hash } = window.location;
      if (hash !== "") {
        setTimeout(() => {
          const id = hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 0);
      }
    };

    // Check for hash in URL on page load
    handleHashLinkClick();

    // Performance optimization: Dynamically load images
    const lazyLoadImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        if (img instanceof HTMLImageElement && img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    };

    // Use Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            lazyLoadImages();
            imageObserver.disconnect();
          }
        });
      });
      
      document.querySelectorAll('section').forEach(section => {
        imageObserver.observe(section);
      });
    } else {
      // Fallback for browsers without Intersection Observer
      lazyLoadImages();
    }

    // Easter egg for hackathon judges
    console.log("🏆 Built for Hackathon Challenge by Team Learnix");

    // Clean up event listeners
    return () => {
      window.removeEventListener('load', handleHashLinkClick);
    };
  }, []);

  // Update hero section buttons to link to signup/login
  const updateHeroButtons = () => {
    const findMatchBtn = document.querySelector('.btn-primary');
    const howItWorksBtn = document.querySelector('.btn-secondary');
    
    if (findMatchBtn) {
      findMatchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/signup';
      });
    }
    
    if (howItWorksBtn) {
      howItWorksBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '#features';
      });
    }
  };

  useEffect(() => {
    updateHeroButtons();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

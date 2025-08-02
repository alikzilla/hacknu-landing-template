import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";
import ParticleRain from "@/components/ParticleRain";
import CursorEffect from "@/components/CursorEffect";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./smooth-scroll.css"; // Add this to your LandingPage.tsx

const LandingPage = () => {
  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-background">
        {/* Global Effects */}
        <CursorEffect />
        <ParticleRain />

        {/* Main Content */}
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <ContactSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
        <AIChat />
      </div>
    </ErrorBoundary>
  );
};

export default LandingPage;

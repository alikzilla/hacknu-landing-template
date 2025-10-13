import {
  ErrorBoundary,
  CursorEffect,
  ParticleRain,
  Navbar,
  HeroSection,
  FeaturesSection,
  PricingSection,
  ContactSection,
  TestimonialsSection,
  FAQSection,
  AIChat,
  Footer,
} from "@/widgets";
import "@/shared/styles/smooth-scroll.css";

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

import {
  ErrorBoundary,
  CursorEffect,
  Navbar,
  HeroSection,
  FeaturesSection,
  FAQSection,
  Footer,
  GoToChatSection,
} from "@/widgets";
import "@/shared/styles/smooth-scroll.css";

const LandingPage = () => {
  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-background">
        {/* Global Effects */}
        <CursorEffect />

        {/* Main Content */}
        <Navbar />
        <HeroSection />
        {/* <FeaturesSection /> */}
        {/* <TestimonialsSection /> */}
        <GoToChatSection />
        <FAQSection />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default LandingPage;

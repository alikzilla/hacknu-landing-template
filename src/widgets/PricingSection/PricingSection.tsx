import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Rocket, Sparkle } from "phosphor-react";
import "./PricingSection.css"; // можно оставить, если там базовые стили

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const plans = [
    {
      name: "Starter",
      icon: <Rocket />,
      tier: "bronze",
      description:
        "Perfect for small businesses starting their AI advertising journey",
      monthlyPrice: 49,
      yearlyPrice: 39,
      features: [
        "AI Ad Creator (50 ads/month)",
        "Basic Analytics Dashboard",
        "Email Support",
        "3 Campaign Management",
        "Standard Templates",
        "Mobile App Access",
      ],
      gradient: "from-accent/20 to-primary/20",
      popular: false,
      recommended: false,
    },
    {
      name: "Growth",
      icon: <Sparkle />,
      tier: "silver",
      description:
        "Ideal for growing companies scaling their advertising efforts",
      monthlyPrice: 149,
      yearlyPrice: 119,
      features: [
        "AI Ad Creator (Unlimited)",
        "Advanced Analytics & ROI Tracking",
        "Priority Support + Phone",
        "Unlimited Campaigns",
        "Custom Brand Templates",
        "Geo-Targeting Tools",
        "A/B Testing Suite",
        "API Access",
      ],
      gradient: "from-primary/20 to-cyber-green/20",
      popular: true,
      recommended: false,
    },
    {
      name: "Enterprise",
      icon: <Crown />,
      tier: "gold",
      description: "For large organizations requiring advanced AI capabilities",
      monthlyPrice: 499,
      yearlyPrice: 399,
      features: [
        "Everything in Growth",
        "White-label Solutions",
        "Dedicated Account Manager",
        "Custom AI Model Training",
        "Advanced Security & Compliance",
        "Multi-team Collaboration",
        "Custom Integrations",
        "24/7 Premium Support",
      ],
      gradient: "from-cyber-purple/20 to-cyber-blue/20",
      popular: false,
      recommended: true,
    },
  ];

  const handleToggle = () => {
    setIsToggling(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsYearly((prev) => !prev);
      }, 300);
      setTimeout(() => {
        setIsToggling(false);
      }, 600);
    });
  };

  return (
    <section className="relative py-20 overflow-hidden" id="pricing">
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      <div className="absolute inset-0 particles opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 mb-6">
            <Crown size={16} className="text-primary" weight="fill" />
            <span className="text-sm text-foreground/80">Choose Your Plan</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Simple,</span>{" "}
            <span className="holographic">Transparent</span>{" "}
            <span className="text-foreground">Pricing</span>
          </h2>

          <p className="text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed mb-8">
            Choose the perfect plan to power your AI advertising revolution. All
            plans include our core AI technology and 14-day free trial.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-12">
            <span
              className={`text-sm transition-all duration-300 ${
                !isYearly ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Monthly
            </span>
            <button
              className={`relative w-16 h-8 glass-card rounded-full p-1 ${
                isToggling ? "toggle-blink" : ""
              }`}
              onClick={handleToggle}
            >
              <div className="w-6 h-6 bg-gradient-primary rounded-full shadow-lg" />
            </button>
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm transition-all duration-300 ${
                  isYearly ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Yearly
              </span>
              <span className="glass-card px-2 py-1 text-xs text-primary rounded-full">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative group rounded-2xl ${
                plan.popular || plan.recommended ? "md:-mt-4 md:mb-4" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="popular-neon text-sm px-4 py-2 rounded-full text-white font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="recommended-neon text-sm px-4 py-2 rounded-full text-white font-bold">
                    Recommended
                  </div>
                </div>
              )}

              <div
                className={`glass-card p-8 h-full relative overflow-hidden transition-all duration-300 ${
                  plan.popular
                    ? "popular-card"
                    : plan.recommended
                    ? "recommended-card"
                    : ""
                } ${isYearly ? "yearly-mode" : "monthly-mode"} ${
                  plan.tier
                }-tier`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center mb-6">
                    <div className="text-primary text-2xl">{plan.icon}</div>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-foreground/70 text-sm mb-6">
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-bold text-foreground transition-all duration-300">
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-foreground/60 ml-2">/month</span>
                    </div>
                    {isYearly && (
                      <div className="text-sm text-foreground/60">
                        Billed annually (${plan.yearlyPrice * 12})
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <Check
                          size={20}
                          className="text-primary mt-0.5 flex-shrink-0"
                          weight="bold"
                        />
                        <span className="text-foreground/80 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "popular-neon"
                        : plan.recommended
                        ? "recommended-neon"
                        : "glass-card hover:bg-white/10 text-foreground"
                    }`}
                  >
                    {plan.popular
                      ? "Start Free Trial"
                      : plan.recommended
                      ? "Get Recommended"
                      : "Get Started"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-foreground/70 mb-4">
            Need a custom solution? We've got you covered.
          </p>
          <button className="glass-card px-8 py-3 text-foreground hover:bg-white/10 transition-all duration-300 rounded-full">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

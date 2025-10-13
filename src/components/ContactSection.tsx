import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PaperPlaneTilt,
  ChatCircle,
  EnvelopeSimple,
  TwitterLogo,
  Phone,
  User,
  MapPin,
} from "phosphor-react";
import "./ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    services: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    console.log("Form submitted:", formData);
  };

  const services = [
    "Website design",
    "Content creation",
    "UX design",
    "Strategy & consulting",
    "User research",
    "Other",
  ];

  return (
    <section
      className="relative py-20 overflow-hidden contact-section"
      id="contact"
    >
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      <div className="absolute inset-0 particles opacity-10"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 mb-6">
                <MapPin size={16} className="text-primary" weight="fill" />
                <span className="text-sm text-foreground/80">Get in Touch</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">Get in</span>{" "}
                <span className="holographic">touch</span>
              </h2>
              <p className="text-xl text-foreground/70 leading-relaxed mb-8 max-w-lg">
                We're here to help. Chat to our friendly team 24/7 and get set
                up and ready to go in just 5 minutes.
              </p>
            </div>
            <div className="space-y-4">
              <button className="contact-method-btn cyber-glow">
                <div className="contact-icon-wrapper">
                  <ChatCircle
                    size={20}
                    className="text-cyber-green"
                    weight="fill"
                  />
                </div>
                <span className="text-cyber-green font-medium">
                  Start a live chat
                </span>
              </button>
              <button className="contact-method-btn cyber-glow">
                <div className="contact-icon-wrapper">
                  <EnvelopeSimple
                    size={20}
                    className="text-cyber-green"
                    weight="fill"
                  />
                </div>
                <span className="text-cyber-green font-medium">
                  Shoot us an email
                </span>
              </button>
              <button className="contact-method-btn cyber-glow">
                <div className="contact-icon-wrapper">
                  <TwitterLogo
                    size={20}
                    className="text-cyber-green"
                    weight="fill"
                  />
                </div>
                <span className="text-cyber-green font-medium">
                  Message us on Twitter
                </span>
              </button>
            </div>
          </div>
          <div className="card-3d">
            <div className="glass-card p-8 contact-form-card rounded-2xl overflow-hidden relative">
              <div className="card-glow bg-gradient-to-br from-primary/10 to-cyber-green/10"></div>
              <div className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="contact-label">First name</label>
                    <div className="input-wrapper">
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        className="contact-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="contact-label">Last name</label>
                    <div className="input-wrapper">
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        className="contact-input"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="contact-label">Email</label>
                  <div className="input-wrapper">
                    <EnvelopeSimple size={18} className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@company.com"
                      className="contact-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="contact-label">Phone number</label>
                  <div className="phone-input-group">
                    <select className="country-select">
                      <option value="US">US</option>
                      <option value="UK">UK</option>
                      <option value="IN">IN</option>
                    </select>
                    <div className="input-wrapper flex-1">
                      <Phone size={18} className="input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className="contact-input phone-input"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="contact-label mb-4">Services</label>
                  <div className="services-grid">
                    {services.map((service) => (
                      <label key={service} className="service-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceChange(service)}
                          className="checkbox-input"
                        />
                        <span className="text-sm text-foreground/80">
                          {service}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="submit-btn"
                >
                  <div className="submit-btn-content">
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <PaperPlaneTilt size={20} weight="fill" />
                        <span>Send message</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

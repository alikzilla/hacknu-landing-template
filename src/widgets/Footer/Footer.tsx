import {
  TwitterLogo,
  LinkedinLogo,
  FacebookLogo,
  InstagramLogo,
  Envelope,
  Phone,
  MapPin,
} from "phosphor-react";
import logo from "/public/logo.svg";

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "API Docs", href: "#" },
      { name: "Integrations", href: "#" },
      { name: "Changelog", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press Kit", href: "#" },
      { name: "Partners", href: "#" },
      { name: "Contact", href: "#" },
    ],
    resources: [
      { name: "Blog", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "Tutorials", href: "#" },
      { name: "Case Studies", href: "#" },
      { name: "Community", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "GDPR", href: "#" },
      { name: "Security", href: "#" },
    ],
  };

  const socialLinks = [
    {
      icon: <TwitterLogo size={20} weight="fill" />,
      href: "#",
      name: "Twitter",
    },
    {
      icon: <LinkedinLogo size={20} weight="fill" />,
      href: "#",
      name: "LinkedIn",
    },
    {
      icon: <FacebookLogo size={20} weight="fill" />,
      href: "#",
      name: "Facebook",
    },
    {
      icon: <InstagramLogo size={20} weight="fill" />,
      href: "#",
      name: "Instagram",
    },
  ];

  const contactInfo = [
    {
      icon: <Envelope size={16} />,
      text: "hello@admybrand.ai",
      href: "mailto:hello@admybrand.ai",
    },
    {
      icon: <Phone size={16} />,
      text: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    { icon: <MapPin size={16} />, text: "San Francisco, CA", href: "#" },
  ];

  return (
    <footer className="relative bg-background border-t border-white/10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      <div className="absolute inset-0 particles opacity-5"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center transition-all duration-300">
                  <img src={logo} alt="Logo" />
                </div>
              </div>
              <p className="text-foreground/70 leading-relaxed mb-6 text-sm sm:text-base">
                Revolutionizing billboard advertising with cutting-edge AI
                technology. Create, optimize, and manage campaigns that deliver
                exceptional results.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    className="flex items-center space-x-3 text-foreground/60 hover:text-primary transition-colors duration-200 group"
                  >
                    <div className="text-primary group-hover:scale-110 transition-transform duration-200">
                      {contact.icon}
                    </div>
                    <span className="text-sm">{contact.text}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(
            ([category, links], categoryIndex) => (
              <div key={category} className="lg:col-span-1">
                <h4 className="text-foreground font-semibold mb-4 capitalize">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-foreground/60 hover:text-primary transition-colors duration-200 text-sm relative group"
                      >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="glass-card p-6 sm:p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
              Stay Updated with AI Advertising Insights
            </h3>
            <p className="text-foreground/70 mb-6 text-sm sm:text-base">
              Get the latest trends, tips, and updates delivered to your inbox.
              Join 10,000+ marketing professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 sm:px-6 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
              />
              <button className="neon-btn px-6 sm:px-8 py-3">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-foreground/60 text-sm order-2 md:order-1">
            © 2025 Zaman Bank - AI Financial helper. All rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-3 sm:space-x-4 order-1 md:order-2">
            {socialLinks.map((social, index) => (
              <a
                href={social.href}
                className="w-10 h-10 sm:w-12 sm:h-12 glass-card rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-white/10 transition-all duration-200 group"
                aria-label={social.name}
              >
                <div className="group-hover:scale-110 transition-transform duration-200">
                  {social.icon}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-primary/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-accent/10 to-cyber-purple/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
    </footer>
  );
};

export default Footer;

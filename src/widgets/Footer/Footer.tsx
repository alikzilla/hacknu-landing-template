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
      { name: "Возможности", href: "#features" },
      { name: "Цены", href: "#pricing" },
      { name: "Документация API", href: "#" },
      { name: "Интеграции", href: "#" },
      { name: "Журнал изменений", href: "#" },
    ],
    company: [
      { name: "О нас", href: "#" },
      { name: "Вакансии", href: "#" },
      { name: "Пресс-кит", href: "#" },
      { name: "Партнёры", href: "#" },
      { name: "Контакты", href: "#" },
    ],
    resources: [
      { name: "Блог", href: "#" },
      { name: "Центр поддержки", href: "#" },
      { name: "Руководства", href: "#" },
      { name: "Кейсы", href: "#" },
      { name: "Сообщество", href: "#" },
    ],
    legal: [
      { name: "Политика конфиденциальности", href: "#" },
      { name: "Условия обслуживания", href: "#" },
      { name: "Политика Cookie", href: "#" },
      { name: "GDPR", href: "#" },
      { name: "Безопасность", href: "#" },
    ],
  } as const;

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
      text: "+7 (708) 262-8133",
      href: "tel:+77082628133",
    },
    {
      icon: <MapPin size={16} />,
      text: "Астана, Казахстан",
      href: "#",
    },
  ];

  // Человеческие заголовки для секций
  const sectionTitles: Record<keyof typeof footerLinks, string> = {
    product: "Продукт",
    company: "Компания",
    resources: "Ресурсы",
    legal: "Правовая информация",
  };

  return (
    <footer className="w-full container lg:px-20 px-6 relative bg-background border-t border-white/10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      <div className="absolute inset-0 particles opacity-5"></div>

      {/* Main Footer Content */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 lg:gap-12 mb-12">
        {/* Brand Section */}
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center transition-all duration-300">
                <img src={logo} alt="Логотип" />
              </div>
            </div>
            <p className="text-foreground/70 leading-relaxed mb-6 text-sm sm:text-base">
              Мы меняем подход к наружной рекламе с помощью передовых технологий
              ИИ: создавайте, оптимизируйте и управляйте кампаниями, которые
              дают выдающиеся результаты.
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
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="lg:col-span-1">
            <h4 className="text-foreground font-semibold mb-4">
              {sectionTitles[category as keyof typeof footerLinks]}
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
        ))}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 space-y-4 md:space-y-0">
        {/* Copyright */}
        <div className="text-foreground/60 text-sm order-2 md:order-1">
          © 2025 Zaman Bank — AI Financial Helper. Все права защищены.
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-3 sm:space-x-4 order-1 md:order-2">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              className="w-10 h-10 sm:w-12 sm:h-12 glass-card rounded-full flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-white/10 transition-all duration-200 group"
              aria-label={social.name}
              title={social.name}
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                {social.icon}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-primary/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-accent/10 to-cyber-purple/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
    </footer>
  );
};

export default Footer;

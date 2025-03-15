
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Virtual Consultations", href: "/services" },
        { name: "Chronic Care Management", href: "/services" },
        { name: "Specialist Care", href: "/services" },
        { name: "Mental Health", href: "/services" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Health Library", href: "#" },
        { name: "FAQs", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Support", href: "#" },
      ],
    },
    {
      title: "Get in Touch",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Help Center", href: "#" },
        { name: "Feedback", href: "#" },
        { name: "Partner with Us", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-muted/50 border-t border-border/50 pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-primary text-2xl font-bold tracking-tight">Vyra</span>
              <span className="text-secondary text-2xl font-bold tracking-tight">Health</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-xs">
              Your trusted partner for comprehensive virtual healthcare services, available 24/7.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-medium text-foreground mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {currentYear} Vyra Health. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart size={14} className="mx-1 text-destructive" />
            <span>for better healthcare.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

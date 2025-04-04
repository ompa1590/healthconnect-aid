
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const navItems = [
    { title: t('home'), href: "/" },
    { title: t('services'), href: "/services" },
    { title: t('howItWorks'), href: "/how-it-works" },
    { title: t('about'), href: "/about" },
    { title: t('contact'), href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "py-3 glass border-b border-border/30 shadow-sm"
          : "py-5 bg-transparent",
        className
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div onClick={handleLogoClick} className="flex items-center cursor-pointer">
          <span className="text-primary text-2xl font-bold tracking-tight">Vyra</span>
          <span className="text-secondary text-2xl font-bold tracking-tight">Health</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                "text-foreground/80 hover:text-foreground transition-colors duration-200",
                location.pathname === item.href && "text-primary font-medium"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          <ThemeToggle />
          <Button
            variant="outline"
            className="font-medium rounded-full px-6 border-primary/20 hover:bg-primary/5 hover:border-primary/30"
            asChild
          >
            <Link to="/login">{t('patientLogin')}</Link>
          </Button>
          <Button
            className="font-medium rounded-full px-6 bg-primary hover:bg-primary/90"
            asChild
          >
            <Link to="/provider-login">{t('providerLogin')}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <LanguageSelector />
          <ThemeToggle />
          <button
            className="text-foreground"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass border-b border-border/30 animate-slide-up">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="py-2 text-foreground/80 hover:text-foreground transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <div className="pt-2 flex flex-col space-y-3">
              <Button variant="outline" className="w-full justify-center rounded-full" asChild>
                <Link to="/login">{t('patientLogin')}</Link>
              </Button>
              <Button className="w-full justify-center rounded-full" asChild>
                <Link to="/provider-login">{t('providerLogin')}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { title: "Home", href: "/" },
    { title: "Services", href: "/services" },
    { title: "How It Works", href: "/how-it-works" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
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
        <Link to="/" className="flex items-center">
          <span className="text-primary text-2xl font-bold tracking-tight">Cloud</span>
          <span className="text-secondary text-2xl font-bold tracking-tight">Cure</span>
        </Link>

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
          <Button
            variant="outline"
            className="font-medium rounded-full px-6 border-primary/20 hover:bg-primary/5 hover:border-primary/30"
            asChild
          >
            <Link to="/login">Patient Login</Link>
          </Button>
          <Button
            className="font-medium rounded-full px-6 bg-primary hover:bg-primary/90"
            asChild
          >
            <Link to="/admin-login">Provider Login</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
                <Link to="/login">Patient Login</Link>
              </Button>
              <Button className="w-full justify-center rounded-full" asChild>
                <Link to="/admin-login">Provider Login</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

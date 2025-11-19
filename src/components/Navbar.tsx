import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleSignup = () => {
    navigate('/signup');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed-navbar">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold gradient-text">
          Learnix
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link to="#" className="nav-link">
            Home
          </Link>
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <a href="#testimonials" className="nav-link">
            Testimonials
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogin}
          >
            <LogIn className="h-4 w-4" />
            <span>Log In</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleSignup}
          >
            <span>Sign Up</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-600 hover:text-primary focus:outline-none p-2 menu-button"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div 
          className={`mobile-menu fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <span className="text-xl font-bold gradient-text">Learnix</span>
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary focus:outline-none p-2"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="px-6 py-8 flex flex-col space-y-6">
            <Link to="/" className="text-lg font-medium py-3 border-b" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <a href="#features" className="text-lg font-medium py-3 border-b" onClick={() => setIsMenuOpen(false)}>
              Features
            </a>
            <a href="#about" className="text-lg font-medium py-3 border-b" onClick={() => setIsMenuOpen(false)}>
              About
            </a>
            <a href="#contact" className="text-lg font-medium py-3 border-b" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
            
            <div className="pt-6 space-y-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2 w-full py-6 text-lg"
                onClick={handleLogin}
              >
                <LogIn className="h-5 w-5" />
                <span>Log In</span>
              </Button>
              <Button 
                className="flex items-center justify-center gap-2 w-full py-6 text-lg"
                onClick={handleSignup}
              >
                <span>Sign Up</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { Mail, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-4 bg-gray-100">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="#" className="text-xl font-bold gradient-text">Learnix</a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-6 md:mb-0">
            <a href="#home" className="text-gray-600 hover:text-primary transition-colors">Home</a>
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
            <a href="#about" className="text-gray-600 hover:text-primary transition-colors">About</a>
            <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">Testimonials</a>
          </div>
          
          <div className="flex space-x-4">
            <a href="mailto:support@Learnix.com" className="text-gray-600 hover:text-primary transition-colors">
              <Mail size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-[#1DA1F2] transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-black transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© 2025 Learnix. All Rights Reserved.</p>
          <p className="mt-1 text-xs text-gray-400">
            Built for Innoverse 2.0 by Team Vortex
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

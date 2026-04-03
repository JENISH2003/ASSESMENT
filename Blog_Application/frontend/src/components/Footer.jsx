import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/40 text-foreground font-sans mt-auto relative z-10">
      {/* Very faint background accent for premium feel without breaking the "no gradients/heavy design" rule */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.02] dark:to-white/[0.02] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* 1. Left Section (takes 2 columns out of 4 for better visual balance) */}
          <div className="flex flex-col space-y-6 md:col-span-2 pr-0 md:pr-12">
            <Link to="/" className="text-2xl font-bold font-heading tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-[0.4rem] bg-gradient-to-tr from-primary to-accent shadow-sm flex items-center justify-center p-1">
                 <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-sm" onError={(e) => e.target.style.display='none'} />
              </div>
              <span>BlogVerse</span>
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md font-light">
              Empowering developers and visionaries through insightful articles, cutting-edge technology trends, and deeply engaging stories.
            </p>
          </div>

          {/* 2. Middle Section */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/80">Navigation</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-[15px] text-muted-foreground hover:text-primary transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-[15px] text-muted-foreground hover:text-primary transition-colors duration-200">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-[15px] text-muted-foreground hover:text-primary transition-colors duration-200">Contact</Link>
              </li>
            </ul>
          </div>

          {/* 3. Right Section */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/80">Connect</h3>
            <div className="flex items-center space-x-3">
              
              <a href="https://github.com/JENISH2003" className="p-2.5 rounded-full bg-secondary/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all duration-300 border border-transparent hover:border-primary/20" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/jenishpatel79/" className="p-2.5 rounded-full bg-secondary/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all duration-300 border border-transparent hover:border-primary/20" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            <div className="pt-2">
              <a href="mailto:hello@blogverse.com" className="inline-flex items-center gap-2.5 text-[15px] text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">
                <Mail className="w-4 h-4" />
                hello@blogverse.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground font-light tracking-wide">
            © {new Date().getFullYear()} BlogVerse. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground font-light">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-foreground transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "react-router-dom";
import { Linkedin,  Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <Link to="/nopage" className="hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link to="/nopage" className="hover:text-foreground transition-colors">
            Contact Us
          </Link>
          <Link to="/nopage" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link to="/nopage" className="hover:text-foreground transition-colors">
            Timeline
          </Link>
          <Link to="/nopage" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link to="/nopage" className="hover:text-foreground transition-colors">
            Refund Policy
          </Link>
        </nav>

        {/* Social Icons */}
        <div className="flex items-center gap-6">
          <Link to="/nopage" className="text-foreground hover:text-muted-foreground transition-colors">
            <Linkedin className="h-6 w-6" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link to="/nopage" className="text-foreground hover:text-muted-foreground transition-colors">
            <Twitter className="h-6 w-6" />
            {/* Using Twitter icon as X representation for now, or X from lucide if available */}
            <span className="sr-only">X (Twitter)</span>
          </Link>
          <Link to="/nopage" className="text-foreground hover:text-muted-foreground transition-colors">
            <Instagram className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-muted-foreground">
          &copy; {currentYear} Codolio, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

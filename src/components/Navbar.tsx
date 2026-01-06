import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import safespeakLogo from '@/assets/safespeak-logo-new.png';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={safespeakLogo} alt="SafeSpeak_Reporting_State_Final" className="h-16 w-auto object-contain" />
          <span className="ml-3 font-semibold hidden sm:inline">SafeSpeak_Reporting_State_Final</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/privacy" className="text-foreground/80 hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link to="/report">
            <Button>Report Now</Button>
          </Link>
        </div>

        <div className="md:hidden">
          <Link to="/report">
            <Button size="sm">Report</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

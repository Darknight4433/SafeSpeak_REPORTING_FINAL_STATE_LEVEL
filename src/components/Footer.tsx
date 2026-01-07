import { Lock, CheckCircle, Mail, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import safespeakLogo from '@/assets/safespeak-logo.png';

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img src={safespeakLogo} alt="SafeSpeak Logo" className="h-16 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              A secure platform for children to report concerns confidentially to verified authorities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3> 
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-muted-foreground hover:text-foreground">
                  Submit Report
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Security Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                256-bit Encryption
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Verified Authorities Only
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Anonymous Reporting
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Emergency Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                <strong>Childline:</strong> 1098
              </li>
              <li className="text-muted-foreground">
                <strong>Emergency:</strong> 112
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                help@safespeak.co
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2025 SafeSpeak. A Government Initiative for Child Safety.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

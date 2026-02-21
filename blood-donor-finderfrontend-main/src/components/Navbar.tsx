import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Blood Bridge Logo" className="h-8 w-auto object-contain" />
          <span className="font-heading text-xl font-bold">Blood Bridge</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Find Donors</Link>
          <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Become a Donor</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/search">Search Now</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/register">Register as Donor</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-6 py-4 space-y-3">
          <Link to="/" className="block text-sm py-2" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/search" className="block text-sm py-2" onClick={() => setIsOpen(false)}>Find Donors</Link>
          <Link to="/register" className="block text-sm py-2" onClick={() => setIsOpen(false)}>Become a Donor</Link>
          <Button variant="hero" size="sm" className="w-full" asChild>
            <Link to="/register" onClick={() => setIsOpen(false)}>Register as Donor</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

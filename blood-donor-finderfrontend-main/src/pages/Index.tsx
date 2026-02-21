import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import FeaturesSection from "@/components/FeaturesSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Droplet } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container max-w-4xl mx-auto text-center glass-card rounded-2xl p-12 glow-border"
        >
          <Droplet className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Every Second Counts
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join Blood Bridge today. Whether you need blood urgently or want to save lives as a donor — we connect you in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="px-8 py-6 text-base" asChild>
              <Link to="/search">
                Find Donors <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="px-8 py-6 text-base" asChild>
              <Link to="/register">Register as Donor</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold">Blood Bridge</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Blood Bridge. Saving lives through faster connections.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

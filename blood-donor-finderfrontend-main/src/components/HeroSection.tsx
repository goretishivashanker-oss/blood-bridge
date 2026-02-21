import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Users, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 hero-bg" />

      <div className="relative z-10 container max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8">
            <Zap className="w-4 h-4" />
            Real-time Emergency Blood Donor Matching
          </div>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Find Blood Donors
            <br />
            <span className="text-gradient">In Minutes</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Blood Bridge locates compatible, nearby blood donors instantly — reducing preventable fatalities caused by donor-search delays.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="text-base px-8 py-6" asChild>
              <Link to="/search">
                Find Donors Now
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="text-base px-8 py-6" asChild>
              <Link to="/register">
                <Users className="w-5 h-5 mr-1" />
                Register as Donor
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: "< 5 min", label: "Avg Match Time" },
              { value: "24/7", label: "Availability" },
              { value: "100%", label: "Verified Donors" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

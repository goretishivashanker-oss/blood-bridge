import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Users, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* iOS Ambient Background Blobs */}
      <div className="ambient-blob ambient-blob-1" />
      <div className="ambient-blob ambient-blob-2" />
      <div className="ambient-blob ambient-blob-3" />

      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />

      <div className="relative z-10 container max-w-6xl mx-auto px-6 text-center">

        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="float-badge inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            Real-time Emergency Blood Donor Matching
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          Find Blood Donors
          <br />
          <span className="text-gradient">In Minutes</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Blood Bridge locates compatible, nearby blood donors instantly — reducing preventable fatalities caused by donor-search delays.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="hero" size="lg" className="text-base px-8 py-6 transition-transform duration-200 hover:scale-105" asChild>
            <Link to="/search">
              Find Donors Now
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </Button>
          <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 transition-transform duration-200 hover:scale-105" asChild>
            <Link to="/register">
              <Users className="w-5 h-5 mr-1" />
              Register as Donor
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "< 5 min", label: "Avg Match Time" },
            { value: "24/7", label: "Availability" },
            { value: "100%", label: "Verified Donors" },
          ].map((stat) => (
            <div key={stat.label} className="group cursor-default">
              <div className="font-heading text-2xl md:text-3xl font-bold text-primary transition-transform duration-200 group-hover:scale-110">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

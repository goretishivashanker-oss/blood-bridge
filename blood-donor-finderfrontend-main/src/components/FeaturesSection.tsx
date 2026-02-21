import { Droplet, MapPin, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const features = [
  {
    icon: Droplet,
    title: "Quick Registration",
    description: "Donor profile: name, blood group, last donation date, location (GPS or city), verified contact.",
  },
  {
    icon: Clock,
    title: "Live Availability",
    description: "Donors toggle availability; system filters out offline/unavailable donors in search results.",
  },
  {
    icon: MapPin,
    title: "Instant Search & Filter",
    description: "Search by blood type, radius, urgency level; sort by distance, estimated travel time, last donation.",
  },
  {
    icon: Shield,
    title: "Secure Contact Flow",
    description: "One-tap contact (call/message), anonymized until consent, audit trail for coordination and safety.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: EASE }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Core Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to find compatible donors fast and save lives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: EASE }}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
              className="glass-card rounded-xl p-6 glow-border group cursor-default"
            >
              <motion.div
                className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                whileHover={{ scale: 1.12 }}
                transition={{ duration: 0.2 }}
              >
                <feature.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

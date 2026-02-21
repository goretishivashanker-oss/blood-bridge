import { Droplet, MapPin, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-6 hover:glow-border transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
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

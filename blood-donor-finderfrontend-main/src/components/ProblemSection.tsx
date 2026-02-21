import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const ProblemSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-primary" />
              <span className="text-primary font-heading font-semibold uppercase tracking-wider text-sm">
                The Problem
              </span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Why Speed Matters
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Current donor searches — calls, social posts, personal networks — are slow, noisy, and often fail across distances. Delays in matching compatible types and confirming availability contribute to avoidable deaths in trauma, obstetric hemorrhage, and mass-casualty events.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-card rounded-xl p-6 glow-border">
              <h3 className="font-heading text-xl font-semibold text-primary mb-2">Clarity</h3>
              <p className="text-muted-foreground">
                Need: instant, verified matches by blood group + proximity + real-time availability.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 glow-border">
              <h3 className="font-heading text-xl font-semibold text-primary mb-2">Impact</h3>
              <p className="text-muted-foreground">
                Faster matches reduce time-to-transfusion; improves survival in the first hour ("golden hour").
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const ProblemSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
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

          <div className="space-y-6">
            {[
              { title: "Clarity", body: "Need: instant, verified matches by blood group + proximity + real-time availability." },
              { title: "Impact", body: 'Faster matches reduce time-to-transfusion; improves survival in the first hour ("golden hour").' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.15, ease: EASE }}
                whileHover={{ y: -4, transition: { duration: 0.22 } }}
                className="glass-card rounded-xl p-6 glow-border"
              >
                <h3 className="font-heading text-xl font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

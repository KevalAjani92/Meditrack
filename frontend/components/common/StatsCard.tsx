import { LucideIcon } from "lucide-react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  trend?: string;
  hover?: boolean;
}

// Helper for animated numbers
function Counter({ value }: { value: number }) {
  const spring = useSpring(0, { bounce: 0, duration: 1500 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
}: StatCardProps) {
  return (
    <motion.div
      key={label}
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      // transition={{ delay: i * 0.1 }}
      className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center justify-between"
    >
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <h3 className="text-3xl font-bold text-foreground mt-1">
          <Counter  value={value} />
        </h3>
      </div>
      <div className={`p-3 rounded-full ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </motion.div>
  );
}

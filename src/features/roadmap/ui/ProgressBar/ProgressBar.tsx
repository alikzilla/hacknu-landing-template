import { motion } from "framer-motion";
import { clamp } from "../../model/helpers/helpers";

const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => (
  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
    <motion.div
      className="h-full bg-emerald-500"
      initial={{ width: 0 }}
      animate={{ width: `${clamp(percent, 0, 100)}%` }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    />
  </div>
);

export default ProgressBar;

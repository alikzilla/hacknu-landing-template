import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { RewardType } from "../../model";

const RewardBadges: React.FC<{ rewards?: RewardType[] }> = ({
  rewards = [],
}) => (
  <div className="flex flex-wrap gap-2">
    {rewards
      .filter((r) => r.earned)
      .map((r) => (
        <motion.span
          key={r.id}
          className="inline-flex items-center gap-1 rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-xs text-yellow-800"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
        >
          <Trophy className="h-3.5 w-3.5" /> {r.title || "Награда"}
        </motion.span>
      ))}
  </div>
);

export default RewardBadges;

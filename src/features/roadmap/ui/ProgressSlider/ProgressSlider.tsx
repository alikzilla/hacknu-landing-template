import { motion } from "framer-motion";
import { clamp } from "../../model";

const ProgressSlider: React.FC<{
  value: number;
  onChange: (next: number) => void;
}> = ({ value, onChange }) => {
  const v = clamp(Math.round(value), 0, 100);
  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="relative h-10 w-10">
        <svg viewBox="0 0 36 36" className="h-10 w-10">
          <path
            d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <motion.path
            d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="100 100"
            strokeDashoffset={100 - v}
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 100 - v }}
            transition={{ duration: 0.6 }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-[10px] font-semibold text-slate-700">
          {v}%
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-emerald-600"
      />
      <div className="flex gap-1">
        {[5, 10, 25].map((step) => (
          <button
            key={step}
            onClick={() => onChange(clamp(v + step, 0, 100))}
            className="rounded-lg border px-2 py-1 text-xs hover:bg-emerald-50"
          >
            +{step}%
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProgressSlider;

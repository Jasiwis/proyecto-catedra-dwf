import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const LoadingPage: React.FC = () => {
  return (
    <div className="w-full h-screen bg-overlay_1 flex justify-center items-center gap-5">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <img width={300} src="/hivesyncLogo.png" />
          <AiOutlineLoading3Quarters
            size={50}
            color="#fff"
            className="w-8 h-8 animate-spin mx-auto"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

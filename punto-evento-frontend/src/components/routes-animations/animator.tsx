import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CurrentPage } from "./current-page";

export const Animator = () => {
  return <Animation />;
};

const Animation = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        key={location.pathname}
        style={{ position: "absolute", width: "100%" }}
      >
        <CurrentPage />
      </motion.div>
    </AnimatePresence>
  );
};



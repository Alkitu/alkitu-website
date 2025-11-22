"use client"
import { motion } from "framer-motion";

type SecondaryButton_Props = {
  children?: React.ReactNode;
  className?: string;
};

function SecondaryButton({ children, className }: SecondaryButton_Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`${
        className ||
        "bg-transparent cursor-pointer text-[min(1rem,,3.16vw)]  lg:text-[1vw] justify-center items-center flex self-stretch lg:min-w-[172px] w-full lg:w-[13vw]  rounded-md border h-12 gap-2 pl-4 pr-2.5 border-foreground text-foreground hover:text-background hover:bg-foreground text-center font-bold uppercase"
      }`}
    >
      {children}
    </motion.button>
  );
}

export default SecondaryButton;

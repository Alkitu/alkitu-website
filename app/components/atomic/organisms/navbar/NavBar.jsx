"use client";
import { useRef, React, useState, useEffect } from "react";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import { ToggleMenu } from "@/app/components/atomic/organisms/navbar";
import MainMenu from "@/app/components/atomic/organisms/navbar/main-menu/MainMenu";
import TailwindGrid from "@/app/components/atomic/templates/grid";
import { useTranslationContext } from "@/app/context/TranslationContext";
import Link from "next/link.js";
import { SelectLanguage } from "@/app/components/atomic/molecules/select-language";
import { BackdropLeftToRight } from "@/app/components/atomic/molecules/backdrop";
import { ContactModalButton } from "@/app/components/atomic/molecules/contact-button";
import { ModalContact } from "@/app/components/atomic/molecules/modal";
import { usePathname } from "next/navigation";
import { SelectTheme } from "@/app/components/atomic/molecules/select-theme";

const sidebarVariants = {
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      type: "spring",
      stiffness: 40,
      restDelta: 1,
      duration: 5,
      when: "beforeChildren",
    },
  },
  closed: {
    clipPath: "inset(0% 0% 0% 100%)",
    transition: {
      type: "spring",
      stiffness: 40,
      restDelta: 1,
      duration: 5,
      when: "afterChildren",
    },
  },
};

export default function NavBar() {
  const { translations, locale } = useTranslationContext();
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const [modalOpenNavbar, setModalOpenNavbar] = useState(false);
  const close = () => setModalOpenNavbar(false);
  const open = () => setModalOpenNavbar(true);
  const routes = translations?.menu?.routes || [];
  const currentPathname = usePathname();

  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Prevent the navbar from disappearing when the user is at the top of the page
      if (currentScrollY < window.innerHeight) {
        setIsScrollingDown(false);
      } else {
        setIsScrollingDown(currentScrollY > prevScrollY.current);
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {!isScrollingDown && (
        <motion.nav
          initial={{ y: "-5rem", opacity: 0 }}
          animate={{ y: "0rem", opacity: 1 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 30,
          }}
          exit={{ y: "-5rem" }}
          className={`h-20 w-full fixed top-0 left-0 z-50 bg-background/40 backdrop-blur-lg shadow-l border-b border-border/50`}
        >
          <TailwindGrid fullSize>
            <div className="w-full lg:w-11/12 absolute top-0 right-0 col-span-full flex justify-end">
              <div className="flex h-20 justify-between w-full lg:w-12/12 self-end">
                <div className="ml-8 col-span-2 flex justify-center items-center">
                  <Link href={`/${locale}`} className="flex items-center cursor-pointer">
                    <motion.p
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="font-main_regular text-3xl font-bold"
                    >
                      <span className="text-primary">&lt;</span>
                      <span className="hidden md:inline">LuisUrdaneta</span>
                      <span className="md:hidden">Luis</span>
                      <span className="text-primary">/&gt;</span>
                    </motion.p>
                  </Link>
                </div>
                <div className="hidden lg:flex items-center">
                  {routes.map((route) => (
                    <div className="flex justify-center items-center px-4" key={route.pathname}>
                      <Link
                        href={
                          route.pathname === "/projects"
                            ? `/${locale}/projects?category=All&page=1`
                            : `/${locale}${route.pathname}`
                        }
                        className={
                          currentPathname === route.pathname
                            ? "flex items-center text-primary font-bold px-4 h-8 uppercase"
                            : "flex items-center text-foreground font-bold px-4 h-8 uppercase cursor-pointer hover:scale-105 hover:text-primary active:scale-95 transition-all"
                        }
                      >
                        {route.name}
                      </Link>
                    </div>
                  ))}
                  <div className="flex justify-center items-center px-4">
                    <ContactModalButton />
                  </div>
                  <div className="flex justify-center items-center px-2">
                    <SelectTheme />
                  </div>
                  <div className="flex justify-center items-center pr-8 pl-2">
                    <SelectLanguage />
                  </div>
                </div>
                <motion.nav
                  initial={false}
                  animate={isOpen ? "open" : "closed"}
                  ref={containerRef}
                  className="lg:hidden h-20"
                >
                  <AnimatePresence
                    initial={false}
                    mode="wait"
                    onExitComplete={() => modalOpenNavbar && open()}
                  >
                    {isOpen && (
                      <BackdropLeftToRight onClick={() => toggleOpen()}>
                        <motion.div
                          className={`fixed h-[100dvh] top-0 right-0 bottom-0 bg-background border-l border-border ${
                            isOpen && "flex"
                          } max-w-full min-w-[300px] overflow-hidden`}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={sidebarVariants}
                          layout
                          layoutId="sidebar"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MainMenu
                            isOpen={isOpen}
                            setModalOpenNavbar={setModalOpenNavbar}
                            toggleOpen={toggleOpen}
                          />
                        </motion.div>
                      </BackdropLeftToRight>
                    )}
                  </AnimatePresence>
                  <AnimatePresence
                    initial={false}
                    mode="wait"
                    onExitComplete={() => modalOpenNavbar && open()}
                  >
                    {modalOpenNavbar && <ModalContact handleClose={close} />}
                  </AnimatePresence>
                  <ToggleMenu isOpen={isOpen} toggle={() => toggleOpen()} />
                </motion.nav>
              </div>
            </div>
          </TailwindGrid>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

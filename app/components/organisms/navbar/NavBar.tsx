'use client';
import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useCycle, Variants } from "framer-motion";
import { ToggleMenu } from "@/app/components/organisms/navbar";
import MainMenu from "@/app/components/organisms/navbar/main-menu/MainMenu";
import TailwindGrid from "@/app/components/templates/grid";
import { useTranslationContext } from "@/app/context/TranslationContext";
import Link from "next/link.js";
import { SelectLanguage } from "@/app/components/molecules/select-language";
import { BackdropLeftToRight } from "@/app/components/molecules/backdrop";
import { ContactModalButton } from "@/app/components/molecules/contact-button";
import { ModalContact } from "@/app/components/molecules/modal";
import { usePathname } from "next/navigation";
import { ThemeToggleButton } from "@/app/components/molecules/theme-toggle";
import { AlkituLogo } from "@/app/components/atoms/alkitu-logo";

interface Route {
  name: string;
  pathname: string;
  iconLight: string;
  iconDark: string;
}

const sidebarVariants: Variants = {
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      type: "spring",
      stiffness: 40,
      restDelta: 1,
      duration: 5,
    },
  },
  closed: {
    clipPath: "inset(0% 0% 0% 100%)",
    transition: {
      type: "spring",
      stiffness: 40,
      restDelta: 1,
      duration: 5,
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
    <AnimatePresence mode='wait'>
      {!isScrollingDown && (
        <motion.nav
          key='navbar'
          initial={{ y: "-5rem", opacity: 0 }}
          animate={{ y: "0rem", opacity: 1 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 30,
          }}
          exit={{ y: "-5rem", opacity: 0 }}
          className='h-20 w-full fixed top-0 left-0 z-50 bg-background/40 backdrop-blur-lg shadow-l border-b border-border/50'
        >
          <TailwindGrid fullSize>
            <div className='w-full lg:w-11/12 absolute top-0 right-0 col-span-full flex justify-end'>
              <div className='flex h-20 justify-between w-full lg:w-12/12 self-end'>
                <div className='ml-8 col-span-2 flex justify-center items-center'>
                  <AlkituLogo locale={locale} width={150} height={60} />
                </div>
                <div className='hidden lg:flex items-center'>
                  {routes.map((route: Route) => (
                    <div
                      className='flex justify-center items-center px-4'
                      key={route.pathname}
                    >
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
                  <div className='flex justify-center items-center px-4'>
                    <ContactModalButton
                      className='text-center text-primary bg-primary text-base font-bold !border-primary justify-center items-center gap-2.5 inline-flex'
                      setModalOpenNavbar={setModalOpenNavbar}
                    />
                  </div>
                  <div className='flex justify-center items-center px-2'>
                    <ThemeToggleButton />
                  </div>
                  <div className='flex justify-center items-center pr-8 pl-2'>
                    <SelectLanguage />
                  </div>
                </div>
                <motion.nav
                  initial={false}
                  animate={isOpen ? "open" : "closed"}
                  ref={containerRef}
                  className='lg:hidden h-20'
                >
                  <AnimatePresence
                    initial={false}
                    mode='wait'
                    onExitComplete={() => modalOpenNavbar && open()}
                  >
                    {isOpen && (
                      <BackdropLeftToRight onClick={() => toggleOpen()}>
                        <motion.div
                          className={`fixed h-dvh top-0 right-0 bottom-0 bg-white dark:bg-black ${
                            isOpen && "flex"
                          } max-w-full min-w-[300px] overflow-hidden`}
                          initial='closed'
                          animate='open'
                          exit='closed'
                          variants={sidebarVariants}
                          layout
                          layoutId='sidebar'
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
                    mode='wait'
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
      {/* Modal de contacto para desktop y mobile */}
      <AnimatePresence initial={false} mode='wait'>
        {modalOpenNavbar && <ModalContact handleClose={close} />}
      </AnimatePresence>
    </AnimatePresence>
  );
}

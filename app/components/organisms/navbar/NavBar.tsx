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
import { usePathname } from "next/navigation";
import { ThemeToggleButton } from "@/app/components/molecules/theme-toggle";
import { AlkituLogo } from "@/app/components/atoms/alkitu-logo";

interface SubMenuItem {
  name: string;
  pathname: string;
}

interface Route {
  name: string;
  pathname: string;
  iconLight: string;
  iconDark: string;
  submenu?: SubMenuItem[];
}

const sidebarVariants: Variants = {
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      type: "spring" as const,
      stiffness: 40,
      restDelta: 1,
      duration: 5,
    },
  },
  closed: {
    clipPath: "inset(0% 0% 0% 100%)",
    transition: {
      type: "spring" as const,
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
  const routes = translations?.menu?.routes || [];
  const currentPathname = usePathname();

  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const prevScrollY = useRef(0);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (pathname: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(pathname);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

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
          aria-label="Main navigation"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.5,
            type: "spring" as const,
            stiffness: 100,
            damping: 30,
          }}
          exit={{ y: -80, opacity: 0 }}
          className='h-20 w-full fixed top-0 left-0 z-50 bg-background/40 backdrop-blur-lg shadow-l border-b border-border/50'
        >
          <TailwindGrid fullSize>
            <div className='w-full absolute top-0 right-0 col-span-full flex justify-end'>
              <div className='flex h-20 justify-between w-full self-end'>
                <div className='ml-4 xl:ml-8 col-span-2 flex flex-shrink-0 justify-center items-center'>
                  <AlkituLogo locale={locale} />
                </div>
                <div className='hidden lg:flex items-center justify-end'>
                  {routes.map((route: Route) => (
                    <div
                      className='flex justify-center items-center lg:px-2 xl:px-4'
                      key={route.pathname}
                    >
                      {route.submenu ? (
                        <div
                          className='relative'
                          onMouseEnter={() => handleMouseEnter(route.pathname)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <button
                            type="button"
                            aria-haspopup="true"
                            aria-expanded={openDropdown === route.pathname}
                            className={
                              currentPathname.startsWith(`/${locale}/servicios`)
                                ? "flex items-center gap-1 text-primary font-bold px-4 h-8 uppercase cursor-pointer bg-transparent border-none"
                                : "flex items-center gap-1 text-foreground font-bold px-4 h-8 uppercase cursor-pointer bg-transparent border-none hover:scale-105 hover:text-primary active:scale-95 transition-all"
                            }
                          >
                            {route.name}
                            <svg
                              aria-hidden="true"
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === route.pathname ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <AnimatePresence>
                            {openDropdown === route.pathname && (
                              <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                role="menu"
                                className='absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] bg-background/95 backdrop-blur-lg border border-border rounded-lg shadow-lg py-2'
                              >
                                {route.submenu.map((item) => (
                                  <Link
                                    key={item.pathname}
                                    href={`/${locale}${item.pathname}`}
                                    className={
                                      currentPathname === `/${locale}${item.pathname}`
                                        ? "block px-4 py-2 text-sm font-semibold text-primary"
                                        : "block px-4 py-2 text-sm font-semibold text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                                    }
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={
                            route.pathname === "/projects"
                              ? `/${locale}/projects?category=All&page=1`
                              : `/${locale}${route.pathname}`
                          }
                          className={
                            currentPathname === `/${locale}${route.pathname}` || (route.pathname === "/" && currentPathname === `/${locale}`)
                              ? "flex items-center text-primary font-bold px-4 h-8 uppercase"
                              : "flex items-center text-foreground font-bold px-4 h-8 uppercase cursor-pointer hover:scale-105 hover:text-primary active:scale-95 transition-all"
                          }
                        >
                          {route.name}
                        </Link>
                      )}
                    </div>
                  ))}
                  <div className='flex justify-center items-center px-2'>
                    <ThemeToggleButton />
                  </div>
                  <div className='flex justify-center items-center lg:pr-4 xl:pr-8 pl-2'>
                    <SelectLanguage />
                  </div>
                </div>
                <motion.nav
                  initial={false}
                  animate={isOpen ? "open" : "closed"}
                  ref={containerRef}
                  className='lg:hidden h-20'
                >
                  <AnimatePresence initial={false} mode='wait'>
                    {isOpen && (
                      <BackdropLeftToRight onClick={() => toggleOpen()}>
                        <motion.div
                          className={`fixed h-dvh top-0 right-0 bottom-0 bg-white dark:bg-black ${
                            isOpen && "flex"
                          } w-[300px] max-w-[85vw] overflow-hidden`}
                          initial='closed'
                          animate='open'
                          exit='closed'
                          variants={sidebarVariants}
                          layout
                          layoutId='sidebar'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MainMenu isOpen={isOpen} toggleOpen={toggleOpen} />
                        </motion.div>
                      </BackdropLeftToRight>
                    )}
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

'use client';
import { useRef } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useTranslationContext } from "@/app/context/TranslationContext";
import { useTheme } from "@/app/context/ThemeContext";
import Link from "next/link.js";
import { LanguagesSwitch } from "@/app/components/molecules/switch";
import { usePathname } from "next/navigation";
import { ThemeToggleButton } from "@/app/components/molecules/theme-toggle";
import { ReactNode } from "react";

interface Route {
  name: string;
  pathname: string;
  iconLight: string;
  iconDark: string;
}

interface MainMenuProps {
  isOpen: boolean;
  toggleOpen: () => void;
}

const getRouteIcon = (pathname: string): ReactNode => {
  const icons: Record<string, ReactNode> = {
    '/': (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.33325 17.5V7.5L9.99992 2.5L16.6666 7.5V17.5H11.6666V11.6667H8.33325V17.5H3.33325Z" />
      </svg>
    ),
    '/about': (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="6" r="3"/>
        <path d="M5 17.5C5 14.1863 7.68629 11.5 11 11.5H9C12.3137 11.5 15 14.1863 15 17.5H5Z"/>
      </svg>
    ),
    '/projects': (
      <svg width="16" height="17" viewBox="0 0 16 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.20001 4.2498H0.624005C0.328005 4.2498 0.032005 4.5218 0.072005 4.9638L1.32001 13.4553C1.32001 13.4553 2.8 7.1993 3.088 5.6948C3.176 5.2443 3.57601 5.0998 3.87201 5.0998H8.00001C8.00001 5.0998 7.44001 3.3318 7.38401 3.1363C7.288 2.7623 7.11201 2.5498 6.76001 2.5498H4.112C3.824 2.5498 3.55201 2.7453 3.47201 3.0938C3.40001 3.4338 3.20001 4.2498 3.20001 4.2498ZM7.10401 4.2498H3.90401C3.90401 4.2498 4.24001 3.3998 4.60001 3.3998H6.30401C6.688 3.3998 7.10401 4.2498 7.10401 4.2498ZM2.13601 13.8123C1.88801 14.2118 1.52801 14.4498 1.12801 14.4498H13.712C14.144 14.4498 14.448 14.1863 14.536 13.7443C14.888 11.8828 15.88 6.5703 15.88 6.5703C15.936 6.1453 15.64 5.9498 15.384 5.9498H12.8V4.7003C12.8 4.5643 12.592 4.2498 12.272 4.2498H9.26401C8.84801 4.2498 8.56801 4.7428 8.56801 4.7428L8.00001 5.9498H4.47201C4.21601 5.9498 3.96801 6.1113 3.92001 6.3748C3.92001 6.3748 2.64801 12.0698 2.54401 12.6053C2.48801 12.9198 2.36801 13.4468 2.13601 13.8123ZM12.304 5.9498H8.80001C8.80001 5.9498 9.26401 5.0998 9.70401 5.0998H11.536C12.104 5.0998 12.304 5.9498 12.304 5.9498Z" />
      </svg>
    ),
    '/blog': (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 2C2.89543 2 2 2.89543 2 4V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V4C18 2.89543 17.1046 2 16 2H4ZM5 6H15V8H5V6ZM5 10H15V12H5V10ZM5 14H11V16H5V14Z"/>
      </svg>
    ),
    '/contact': (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 5.83333C2.5 5.1701 3.03976 4.63034 3.70299 4.63034H16.297C16.9602 4.63034 17.5 5.1701 17.5 5.83333V14.1667C17.5 14.8299 16.9602 15.3697 16.297 15.3697H3.70299C3.03976 15.3697 2.5 14.8299 2.5 14.1667V5.83333Z"/>
        <path d="M2.5 5.83333L10 10.8333L17.5 5.83333" stroke="white" strokeWidth="1.2"/>
      </svg>
    )
  };

  return icons[pathname] || icons['/'];
};

export default function MainMenu({ isOpen, toggleOpen }: MainMenuProps) {
  const { translations, locale } = useTranslationContext();
  const { resolvedTheme } = useTheme();
  const ref = useRef(null);
  const routes = translations?.menu?.routes || [];
  const currentPathname = usePathname();

  const itemVariants: Variants = {
    open: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 1 * i,
        delayChildren: 0.75 * i,
        staggerDirection: 1,
      },
    }),
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 1,
        staggerDirection: -1,
      },
    },
  };

  return (
    <motion.ul
      variants={itemVariants}
      initial='closed'
      animate={isOpen ? "open" : "closed"}
      exit='closed'
      className='flex-row group-first:border-b-2 top-[75px] right-0 fixed flex col-span-full h-[calc(100dvh-75px)] items-start justify-center'
      ref={ref}
    >
      <AnimatePresence mode='wait'>
        {isOpen && (
          <div className='w-full min-w-[300px] h-full bg-white dark:bg-black'>
            <div className='flex flex-col justify-between items-center h-full'>
              <div className='min-w-[300px] flex flex-col w-full'>
                {routes.map((route: Route) => (
                  <Link
                    key={route.pathname}
                    href={
                      route.pathname === "/projects"
                        ? `/${locale}/projects?category=All&page=1`
                        : `/${locale}${route.pathname}`
                    }
                    className={`relative items-center tracking-wider rounded-md w-full ${
                      currentPathname === route.pathname
                        ? "text-primary"
                        : "text-foreground hover:scale-105 hover:text-primary transition-all"
                    }`}
                  >
                    <motion.div
                      className='justify-center hover:bg-muted dark:hover:bg-zinc-800 py-5 w-full'
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className='w-full flex flex-row gap-5 mx-auto pl-5'>
                        <div className='h-6 w-6 flex items-center justify-center text-foreground'>
                          {getRouteIcon(route.pathname)}
                        </div>
                        <p className='text-foreground text-xl tracking-wider col-span-10 col-start-3 h-full'>
                          {route.name}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}

                <div className='grid grid-cols-12 py-5 px-5'>
                  <div className='col-span-12 flex items-center gap-4'>
                    <div className='h-6 w-6 flex items-center justify-center text-foreground'>
                      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <g>
                          <path d="M7 2a1 1 0 0 1 1 1v1h3a1 1 0 1 1 0 2H9.578a18.87 18.87 0 0 1-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 0 1-1.44 1.389 21.034 21.034 0 0 1-.554-.6 19.095 19.095 0 0 1-3.107 3.567 1 1 0 0 1-1.334-1.49 17.09 17.09 0 0 0 3.13-3.733 18.995 18.995 0 0 1-1.487-2.494 1 1 0 1 1 1.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 0 1 0-2h3V3a1 1 0 0 1 1-1zm6 6a1 1 0 0 1 .894.553l2.991 5.982a.88.88 0 0 1 .02.037l.99 1.98a1 1 0 1 1-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 1 1-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0 1 13 8zm-1.382 6h2.764L13 11.236z" />
                        </g>
                      </svg>
                    </div>
                    <p className='text-foreground text-xl tracking-wider flex-1'>
                      {translations?.menu?.languages}
                    </p>
                  </div>
                  <div className='flex col-span-9 col-start-3 my-5 gap-x-2 items-center'>
                    <p className='text-lg tracking-wider'>ES</p>
                    <LanguagesSwitch className='w-16' />
                    <p className='text-lg tracking-wider'>EN</p>
                  </div>
                </div>

                <div className='grid grid-cols-12 py-5 px-5 border-t border-border'>
                  <div className='col-span-12 flex items-center gap-4'>
                    <div className='h-6 w-6 flex items-center justify-center text-foreground'>
                      {resolvedTheme === 'dark' ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 1v2m0 18v2M23 12h-2M3 12H1m18.36-8.36l-1.42 1.42M6.34 17.66l-1.42 1.42m12.02 0l-1.42-1.42M6.34 6.34L4.92 4.92" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                    <p className='text-foreground text-xl tracking-wider flex-1'>
                      {translations?.menu?.theme || "Theme"}
                    </p>
                    <ThemeToggleButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.ul>
  );
}

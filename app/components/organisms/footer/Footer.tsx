"use client";
import {
  useTranslationContext,
} from "@/app/context/TranslationContext";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import TailwindGrid from "@/app/components/templates/grid";
import { usePathname } from "next/navigation";
import { AlkituLogo } from "@/app/components/atoms/alkitu-logo";

function Footer() {
  const { translations, locale } = useTranslationContext();
  const footerData = translations?.footer;
  const pathname = usePathname();

  // Check if we're on the home page (e.g., /es or /en)
  const isHomePage = pathname === `/${locale}`;

  if (!footerData?.socials) return null;

  return (
    <footer>
    <TailwindGrid fullSize>
      <div
        className={`col-span-full ${
          isHomePage ? "lg:col-start-2" : ""
        } min-h-[400px] flex-col justify-center items-center gap-y-10 inline-flex pt-20 bg-zinc-900 dark:bg-zinc-900 text-white dark:text-white`}
      >
        {/* Logo */}
        <div className='flex justify-center items-center mb-6'>
          <AlkituLogo locale={locale} width={200} />
        </div>

        {/* Social Icons */}
        <div className='flex flex-wrap gap-x-2 gap-y-4 justify-center items-center'>
          {footerData.socials?.map(
            (social, index) =>
              social.icon &&
              social.url && (
                <div
                  className={`flex justify-center min-h-9 min-w-9 items-center h-8  rounded-full w-1/6 max-w-1   ${
                    social.hidden && "hidden"
                  }`}
                  key={index + social.name}
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className='group bg-transparent cursor-pointer hover:scale-110 active:scale-90 rounded-full transition-all inline-flex'
                  >
                    <Image
                      width={40}
                      height={40}
                      alt={social.name || "Social icon"}
                      src={social.icon}
                      className='w-8 h-8 cursor-pointer'
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)",
                      }}
                    />
                  </a>
                </div>
              )
          )}
        </div>
        <div className='justify-start items-start gap-10 inline-flex  '>
          {footerData.routes?.map((route) => (
            <Link
              key={route.pathname}
              href={
                route.pathname === "/projects"
                  ? `/${locale}/projects?category=All&page=1`
                  : `/${locale}${route.pathname}`
              }
              className='flex justify-center px-4 self-center items-center text-white dark:text-white text-base font-normal cursor-pointer hover:scale-105 hover:text-primary active:scale-95 transition-all'
            >
              {route.name}
            </Link>
          ))}
        </div>
        {/* Legal Links */}
        {footerData.legal && (
          <div className='flex flex-wrap gap-x-6 gap-y-2 justify-center items-center'>
            <Link
              href={`/${locale}/privacy-policy`}
              className='text-sm text-zinc-400 hover:text-primary transition-colors'
            >
              {footerData.legal.privacyPolicy}
            </Link>
            <Link
              href={`/${locale}/cookie-policy`}
              className='text-sm text-zinc-400 hover:text-primary transition-colors'
            >
              {footerData.legal.cookiePolicy}
            </Link>
          </div>
        )}

        <div className='w-full h-0 border-zinc-700 dark:border-zinc-300 border-t'></div>
        <p className='text-xs font-light pb-10 capitalize text-white dark:text-white'>
          {footerData.website} {footerData.rights}
        </p>
      </div>
    </TailwindGrid>
    </footer>
  );
}

export default Footer;

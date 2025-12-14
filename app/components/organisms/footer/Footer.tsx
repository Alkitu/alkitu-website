"use client";
import {
  useTranslations,
  useTranslationContext,
} from "@/app/context/TranslationContext";
import Link from "next/link";
import React from "react";
import { ContactModalButton } from "@/app/components/molecules/contact-button";
import Image from "next/image";
import TailwindGrid from "@/app/components/templates/grid";
import { usePathname } from "next/navigation";
import { Logo } from "@/app/components/atoms/logo";

function Footer() {
  const { translations, locale } = useTranslationContext();
  const footerData = translations?.footer;
  const pathname = usePathname();

  // Check if we're on the home page (e.g., /es or /en)
  const isHomePage = pathname === `/${locale}`;

  if (!footerData?.socials) return null;

  return (
    <TailwindGrid fullSize>
      <div
        className={`col-span-full ${
          isHomePage ? "lg:col-start-2" : ""
        } min-h-[400px] flex-col justify-center items-center gap-y-10 inline-flex pt-20 bg-zinc-900 dark:bg-zinc-900 text-white dark:text-white`}
      >
        {/* Logo */}
        <div className='flex justify-center items-center mb-6'>
          <Logo locale={locale} size='lg' />
        </div>

        {/* Social Icons */}
        <div className='flex flex-wrap gap-x-2 gap-y-4   2xl:w-2/12   justify-center items-center'>
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
                  <button
                    className='group bg-transparent cursor-pointer hover:scale-110 active:scale-90 rounded-full transition-all'
                    onClick={() => window.open(social.url, "_blank")}
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
                  </button>
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
        <ContactModalButton
          className='text-center text-black text-base font-bold px-7 py-2 bg-primary rounded-3xl border !border-primary justify-center items-center gap-2.5 inline-flex hover:shadow-primary/50 hover:shadow-md '
          setModalOpenNavbar={undefined}
        />

        <div className='w-full h-0 border-zinc-700 dark:border-zinc-300 border-t'></div>
        <p className='text-xs font-light pb-10 capitalize text-white dark:text-white'>
          {footerData.website} {footerData.rights}
        </p>
      </div>
    </TailwindGrid>
  );
}

export default Footer;

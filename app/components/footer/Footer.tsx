"use client";
import { useTranslations, useTranslationContext } from "@/app/context/TranslationContext";
import Link from "next/link";
import React from "react";
import ContactModalButton from "../ui/buttons/ContactModalButton";
import Image from "next/image";
import TailwindGrid from "../grid/TailwindGrid";
import { usePathname } from "next/navigation";

function Footer() {
  const { translations, locale } = useTranslationContext();
  const footerData = translations?.footer;
  const pathname = usePathname();

  // Check if we're on the home page (e.g., /es or /en)
  const isHomePage = pathname === `/${locale}`;

  if (!footerData?.socials) return null;

  return (
    <TailwindGrid fullSize>
      <div className={`col-span-full ${isHomePage ? 'lg:col-start-2' : ''} min-h-[400px] flex-col justify-center items-center gap-y-10 inline-flex  pt-20 `}>
        <div className="flex flex-wrap gap-x-2 gap-y-4   2xl:w-2/12   justify-center items-center">
          {footerData.socials?.map((social, index) => (
              social.icon && social.url && (
                <div
                  className={`flex justify-center min-h-9 min-w-9 items-center h-8  rounded-full w-1/6 max-w-1   ${
                    social.hidden && "hidden"
                  }`}
                  key={index + social.name}
                >
                  <button
                    className="group bg-white cursor-pointer hover:bg-zinc-700 rounded-full transition-all shadow hover:scale-110 active:scale-90"
                    onClick={() => window.open(social.url, "_blank")}
                  >
                    <Image
                      width={40}
                      height={40}
                      alt={social.name || "Social icon"}
                      src={social.icon}
                      className="w-8 h-8 group-hover:invert cursor-pointer"
                    />
                  </button>
                </div>
              )
            ))}
        </div>
        <div className="justify-start items-start gap-10 inline-flex ">
          {footerData.routes?.map((route) => (
            <Link
              key={route.pathname}
              href={
                route.pathname === "/projects"
                  ? `/${locale}/projects?category=All&page=1`
                  : `/${locale}${route.pathname}`
              }
              className="flex justify-center px-4 self-center items-center text-foreground dark:text-white text-base font-normal cursor-pointer hover:scale-105 hover:text-primary active:scale-95 transition-all"
            >
              {route.name}
            </Link>
          ))}
        </div>
        <ContactModalButton
          className="text-center text-black text-base font-bold px-7 py-2 bg-primary rounded-3xl border border-primary justify-center items-center gap-2.5 inline-flex hover:shadow-primary/50 hover:shadow-md "
          setModalOpenNavbar={undefined}
        />

        <div className="w-full h-[0px]  border-zinc-500 border-t"></div>
        <p className="text-xs font-light pb-10 capitalize">
          {footerData.website} {footerData.rights}
        </p>
      </div>
    </TailwindGrid>
  );
}

export default Footer;

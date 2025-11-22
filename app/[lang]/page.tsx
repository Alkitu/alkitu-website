import { Locale } from "@/i18n.config";
import SideBar from "../components/sidebars/SideBar";
import { getDictionary } from "@/lib/dictionary";
import TailwindGrid from "../components/grid/TailwindGrid";
import PostPreviews from "../components/sections/blog/PostPreviews";
import Category from "../components/sections/category/Category";
import Hero from "../components/sections/hero/Hero";
import Passion from "../components/sections/passion/Passion";
import ProjectsPreview from "../components/sections/projects/ProjectsPreview";
import BigQuote from "../components/sections/quote/BigQuote";
import Skills from "../components/sections/skills/Skills";
import Testimonials from "../components/sections/testimonials/Testimonials";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  return (
    <>
      <TailwindGrid fullSize>
        <SideBar text={text} />
        <div className='gap-y-[19vw] md:gap-y-[20vw] lg:gap-y-[14vw] flex-col flex col-span-full  mt-20 md:mt-24 lg:mt-20 md:pt-8'>
          <div id='hero-section'>
            <Hero text={text} />
          </div>
          <div id='category-section'>
            <Category text={text} />
          </div>
          <div id='projects-section'>
            <ProjectsPreview text={text} />
          </div>
          <div id='skills-section'>
            <Skills text={text} />
          </div>
          {/* <div id="blog-section">
            <PostPreviews text={text} />
          </div> */}
          <div id='passion-section'>
            <Passion text={text} />
          </div>
          <div id='testimonials-section'>
            <Testimonials text={text} />
          </div>
        </div>
      </TailwindGrid>
    </>
  );
}

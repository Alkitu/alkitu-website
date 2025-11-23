import { Locale } from "@/i18n.config";
import { SideBar } from "../components/atomic/organisms/sidebar";
import { getDictionary } from "@/lib/dictionary";
import TailwindGrid from "@/app/components/atomic/templates/grid";
import { PostPreviews } from "../components/atomic/organisms/blog-section";
import { Category } from "../components/atomic/organisms/category-section";
import { Hero } from "../components/atomic/organisms/hero-section";
import { Passion } from "../components/atomic/organisms/passion-section";
import { ProjectsPreview } from "../components/atomic/organisms/projects-section";
import { BigQuote } from "../components/atomic/organisms/quote-section";
import { Skills } from "../components/atomic/organisms/skills-section";
import { Testimonials } from "../components/atomic/organisms/testimonials-section";

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

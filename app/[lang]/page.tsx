import { Metadata } from "next";
import { Locale } from "@/i18n.config";
import { getSeoAlternates } from '@/lib/seo';
import { SideBar } from "../components/organisms/sidebar";
import { getDictionary } from "@/lib/dictionary";
import TailwindGrid from "@/app/components/templates/grid";
import { PostPreviews } from "../components/organisms/blog-section";
import { Category } from "../components/organisms/category-section";
import { Hero } from "../components/organisms/hero-section";
import { Passion } from "../components/organisms/passion-section";
import { ProjectsPreview } from "../components/organisms/projects-section";
import { Skills } from "../components/organisms/skills-section";
import { Brands } from "../components/organisms/brands-section";
import { getPosts } from '@/lib/blog/queries';
import type { BlogLocale } from '@/lib/types/blog';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: lang === 'es' ? 'Alkitu | Agencia Digital en España' : 'Alkitu | Digital Agency in Spain' },
    description: lang === 'es'
      ? 'Agencia digital especializada en branding, marketing digital, desarrollo web y productos digitales a medida'
      : 'Digital agency specializing in branding, digital marketing, web development and custom digital products',
    alternates: getSeoAlternates(lang),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  // 3 most recent posts for the current locale (query returns newest-first)
  const recentPosts = (await getPosts(lang as BlogLocale)).slice(0, 3).map((post) => ({
    title: post.title,
    slug: post.slug,
    categorySlug: post.categorySlug,
    excerpt: post.excerpt ?? '',
    metaDescription: post.metaDescription ?? '',
    image: post.image ?? '',
    date: post.date ?? '',
    readTime: post.readTime ?? '',
  }));

  return (
    <>
      <TailwindGrid fullSize>
        <SideBar sections={text?.home?.sections} />
        <div className='gap-y-[19vw] md:gap-y-[20vw] lg:gap-y-[14vw] flex-col flex col-span-full'>
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
          <div id='blog-section'>
            <PostPreviews text={text} posts={recentPosts} locale={lang} />
          </div>
          <div id='passion-section'>
            <Passion text={text} />
          </div>
<div id='brands-section'>
            <Brands text={text} />
          </div>
        </div>
      </TailwindGrid>
    </>
  );
}

import { Locale } from "@/i18n.config";
import { SideBar } from "../components/organisms/sidebar";
import { getDictionary } from "@/lib/dictionary";
import TailwindGrid from "@/app/components/templates/grid";
import { PostPreviews } from "../components/organisms/blog-section";
import { Category } from "../components/organisms/category-section";
import { Hero } from "../components/organisms/hero-section";
import { Passion } from "../components/organisms/passion-section";
import { ProjectsPreview } from "../components/organisms/projects-section";
import { Skills } from "../components/organisms/skills-section";
import { Testimonials } from "../components/organisms/testimonials-section";
import { Brands } from "../components/organisms/brands-section";
import { HomeContact } from "../components/organisms/home-contact-section";
import { allBlogPosts } from 'contentlayer/generated';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const text = await getDictionary(lang);

  // Get 3 most recent blog posts for current locale
  const localePosts = allBlogPosts
    .filter(post => post.locale === lang)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Transform to simplified format for client component
  const recentPosts = localePosts.map(post => {
    const primaryCategory = Array.isArray(post.categories) && post.categories.length > 0
      ? post.categories[0]
      : 'General';
    const categorySlug = primaryCategory
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s\/]+/g, '-');

    return {
      title: post.title,
      slug: post.slug,
      categorySlug,
      excerpt: post.excerpt,
      metaDescription: post.metaDescription,
      image: post.image,
      date: post.date,
      readTime: post.readTime,
    };
  });

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
          <div id='contact-section'>
            <HomeContact text={text} />
          </div>
          <div id='testimonials-section'>
            <Testimonials text={text} />
          </div>
          <div id='brands-section'>
            <Brands text={text} />
          </div>
        </div>
      </TailwindGrid>
    </>
  );
}

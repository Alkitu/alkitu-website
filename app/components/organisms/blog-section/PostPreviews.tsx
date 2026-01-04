"use client";
import Link from "next/link";
import TailwindGrid from "@/app/components/templates/grid";
import { ResponsiveList } from "@/app/components/organisms/responsive-list";
import { ParallaxText } from "@/app/components/organisms/sliders";
import { FlexCarousel } from "@/app/components/organisms/flex-carousel";
import { Button } from "@/app/components/atoms/button";
import React from "react";
import PostsDesktopCard from "@/app/components/organisms/flex-carousel/cards/PostsDesktopCard";
import { useLocalizedPath } from "@/app/hooks";
import { Translations } from "@/app/types/translations";

interface BlogPost {
  title: string;
  slug: string;
  categorySlug: string;
  excerpt: string;
  metaDescription?: string;
  image: string;
  date: string;
  readTime: string;
}

interface PostPreviewsProps {
  text: Translations;
  posts: BlogPost[];
  locale: string;
}

function PostPreviews({ text, posts, locale }: PostPreviewsProps) {
  const dataBlogSection = text.home.blogSection;
  const localizedPath = useLocalizedPath();

  // Transform posts for display and carousel
  const processedPostData = posts.map(post => ({
    title: post.title,
    thumbnail: post.image,
    pubDate: post.date,
    description: post.metaDescription || post.excerpt,
    link: `/${locale}/blog/${post.categorySlug}/${post.slug}`,
  }));

  // For mobile carousel
  const carouselData = posts.map((post, index) => ({
    id: post.slug,
    order: index + 1,
    title: post.title,
    thumbnail: post.image,
    pubDate: post.date,
    description: post.metaDescription || post.excerpt,
    link: `/${locale}/blog/${post.categorySlug}/${post.slug}`,
  }));

  return (
    <section className='pt-[14vw] md:pt-[6vw] lg:pt-[4vw] bg-orange-500/0 relative col-span-full max-w-full'>
      <TailwindGrid fullSize>
        <section className='absolute self-center overflow-hidden w-full max-w-full z-0 -top-[17vw] md:-top-[11vw] lg:-top-[8.5vw] left-0'>
          <ParallaxText baseVelocity={dataBlogSection.velocityScroller}>
            {dataBlogSection.textScroller}
          </ParallaxText>
        </section>
      </TailwindGrid>
      <div className='col-span-full max-w-full flex flex-col justify-center content-center items-center'>
        <TailwindGrid>
          <h3 className='header-section col-span-full lg:col-start-2 text-start z-50 pointer-events-none relative'>
            {dataBlogSection.title}
            <span className='md:hidden'>
              <br />
            </span>
            <span className='text-primary'>
              {" "}
              {dataBlogSection.titlePrimary}
            </span>
          </h3>
          <div className='self-center col-start-1 lg:col-start-2 col-end-5 md:col-end-9 lg:col-end-13 w-full flex flex-col'>
            <div className='hidden md:block pt-9'>
              <ResponsiveList
                tablet={3}
                desktop={3}
                mobile={1}
                className='w-full max-w-full '
              >
                {processedPostData &&
                  processedPostData.map((post, index) => (
                    <section
                      className='w-full relative  flex flex-col  items-center justify-center'
                      key={post.title}
                    >
                      <PostsDesktopCard container={post} index={index} />
                    </section>
                  ))}
              </ResponsiveList>
            </div>
          </div>
        </TailwindGrid>
      </div>

      <div className='inline md:hidden'>
        <FlexCarousel
          dataCards={carouselData as any}
          width={70}
          reduceGap={15}
          key='post'
          type='post'
        />
      </div>

      {/* See More Button - same pattern as ProjectsPreview */}
      <TailwindGrid>
        <div className='flex justify-center items-center col-span-full lg:col-start-2 my-auto pt-9'>
          <Link href={localizedPath("/blog")}>
            <Button
              variant='primary'
              className='text-center text-md py-3 px-5 md:text-[min(2vw,22px)] md:px-[min(3vw,2.5rem)] md:py-[min(0.5vw,2rem)] rounded-full'
            >
              {dataBlogSection.button}
            </Button>
          </Link>
        </div>
      </TailwindGrid>
    </section>
  );
}

export default PostPreviews;

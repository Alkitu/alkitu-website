'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { BlogGrid } from '@/app/components/organisms/blog-grid';
import TailwindGrid from '@/app/components/templates/grid';

interface BlogPostRaw {
    _id: string;
    title: string;
    slug: string;
    locale: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    imageAlt: string;
    excerpt: string;
    categories: string[];
}

interface BlogNotFoundProps {
    allPosts: any[]; // using any[] to accept Contentlayer type, will map internally
    currentLocale: string;
}

export default function BlogNotFound({ allPosts, currentLocale }: BlogNotFoundProps) {
    const [filterLang, setFilterLang] = useState<string>('all'); // 'all', 'es', 'en'

    // Filter posts based on selected language
    const filteredPosts = allPosts.filter(post => {
        if (filterLang === 'all') return true;
        return post.locale === filterLang;
    }).map(post => ({
        // Map Contentlayer post to BlogGrid expected format
        id: post._id,
        title: post.title,
        slug: post.slug,
        categorySlug: post.categories?.[0]?.toLowerCase() || 'general',
        excerpt: post.excerpt,
        image: post.image,
        category: post.categories?.[0] || 'General',
        date: post.date,
        readTime: post.readTime,
        author: post.author,
        lang: [post.locale],
        featured: false
    }));

    const isEs = currentLocale === 'es';

    return (
        <div className="min-h-screen bg-background pb-20">
            <TailwindGrid>
                <div className="col-span-full py-12 lg:py-20 flex flex-col items-center text-center">

                    {/* Frustrated Reader Image - Robust non-absolute layout */}
                    <div className="relative mb-8 w-full max-w-[500px]">
                        <Image
                            src="/images/errors/404-blog.png"
                            alt="Frustrated Reader"
                            width={500}
                            height={400}
                            style={{ width: '100%', height: 'auto' }}
                            className="object-cover rounded-3xl shadow-2xl border-4 border-muted"
                            priority
                        />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-foreground">
                        {isEs ? 'Artículo no encontrado' : 'Article Not Found'}
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                        {isEs
                            ? 'Parece que el artículo que buscas no existe o ha sido movido. Pero no te preocupes, hay mucho más por leer.'
                            : 'It seems the article you are looking for does not exist or has been moved. But don\'t worry, there is much more to read.'}
                    </p>

                    <div className="flex gap-4 mb-16">
                        <Link
                            href={isEs ? '/es' : '/en'}
                            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all font-black"
                        >
                            <Home className="mr-2 h-4 w-4" />
                            {isEs ? 'Ir al Inicio' : 'Go Home'}
                        </Link>
                        <Link
                            href={isEs ? '/es/blog' : '/en/blog'}
                            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {isEs ? 'Volver al Blog' : 'Back to Blog'}
                        </Link>
                    </div>

                    {/* Filter Tabs */}
                    <div className="w-full max-w-4xl border-t border-border pt-12">
                        <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-2">
                            <Search className="w-5 h-5" />
                            {isEs ? 'Explora todos nuestros artículos' : 'Explore all our articles'}
                        </h2>

                        <div className="flex justify-center gap-2 mb-12">
                            <button
                                onClick={() => setFilterLang('all')}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${filterLang === 'all'
                                        ? 'bg-primary text-primary-foreground shadow-lg'
                                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                    }`}
                            >
                                All / Todo
                            </button>
                            <button
                                onClick={() => setFilterLang('en')}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${filterLang === 'en'
                                        ? 'bg-primary text-primary-foreground shadow-lg'
                                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                    }`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setFilterLang('es')}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${filterLang === 'es'
                                        ? 'bg-primary text-primary-foreground shadow-lg'
                                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                    }`}
                            >
                                Español
                            </button>
                        </div>

                        {/* Grid of Articles */}
                        <div className="text-left w-full">
                            <BlogGrid
                                posts={filteredPosts}
                                locale={currentLocale}
                                categoryTitle={isEs ? "Resultados" : "Results"}
                                columns={4}
                            />
                        </div>
                    </div>

                </div>
            </TailwindGrid>
        </div>
    );
}

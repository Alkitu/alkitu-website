"use client";
import { Suspense, useEffect, useState } from "react";
import { FilterCategories, FilterCategoriesSkeleton } from "@/app/components/organisms/filter-categories";
import { useTranslationContext } from "@/app/context/TranslationContext";
import { ProjectCard } from "@/app/components/molecules/card";
import { ResponsiveList } from "@/app/components/organisms/responsive-list";
import { Pagination } from "@/app/components/organisms/pagination";
import { PageHeader } from "@/app/components/organisms/page-header";
import { HomeContact } from "@/app/components/organisms/home-contact-section";
import { SideBar } from "@/app/components/organisms/sidebar";
import { useSearchParams } from "next/navigation";
import { useScreenWidth } from "@/app/hooks";
import TailwindGrid from "@/app/components/templates/grid";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { ProjectWithCategories, Category } from "@/lib/types";

// This component passed as a fallback to the Suspense boundary
// will be rendered in place of the search bar in the initial HTML.
// When the value is available during React hydration the fallback
// will be replaced with the `<SearchBar>` component.
function SearchBarFallback() {
  return <>placeholder</>;
}

const Portfolio = () => {
  const { translations, locale } = useTranslationContext();
  const portfolio = translations.portfolio as any;
  const searchParams = useSearchParams();
  const screenWidth = useScreenWidth();

  // State for projects and categories from database
  const [projects, setProjects] = useState<ProjectWithCategories[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Pagination state
  const [search, setSearch] = useState(searchParams.get("category") || "All");
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const itemsPerPage = 6;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        if (search !== 'All') {
          params.append('category_slug', search);
        }

        const response = await fetch(`/api/projects?${params}`);
        const data = await response.json();

        if (data.success) {
          setProjects(data.data.projects);
          setTotal(data.data.pagination.total);
          setTotalPages(data.data.pagination.total_pages);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage, search]);

  return (
    <TailwindGrid fullSize>
      <div className="col-span-1 hidden lg:block">
        <SideBar sections={translations?.portfolio?.sections} />
      </div>

      <motion.main className="col-span-full">
        <div className='col-span-full max-w-full flex flex-col justify-center content-center items-center'>
          <TailwindGrid>
            {/* Header Section */}
            <div id="projects-hero" className='col-start-1 lg:col-start-2 col-end-5 md:col-end-9 lg:col-end-13 mb-12'>
              <PageHeader
                title={portfolio.title}
                subtitle={portfolio.description}
              />
            </div>

            {/* Filter Section */}
            <section id="projects-filter" className='col-start-1 lg:col-start-2 col-end-5 md:col-end-9 lg:col-end-13 w-full flex justify-center items-center content-center pb-10 mb-12 border-b border-border'>
              {categoriesLoading ? (
                <FilterCategoriesSkeleton />
              ) : (
                <FilterCategories
                  search={search}
                  setSearch={setSearch}
                  className=""
                  setCurrentPage={setCurrentPage}
                  key={screenWidth}
                  categories={categories}
                  locale={locale}
                />
              )}
            </section>

            {/* Projects Grid Section */}
            <section id="projects-grid" className='col-start-1 lg:col-start-2 col-end-5 md:col-end-9 lg:col-end-13 w-full mb-20'>
              {loading ? (
                <div className="pt-12 w-full flex justify-center items-center min-h-[35vw]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading projects...</p>
                  </div>
                </div>
              ) : (
                <LayoutGroup>
                  <ResponsiveList
                    tablet={3}
                    className='w-full max-w-full'
                  >
                    <AnimatePresence mode="popLayout">
                      {projects.map((project, index) => (
                        <Suspense
                          key={project.id}
                          fallback={
                            <div role='status'>
                              <svg
                                aria-hidden='true'
                                className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                                viewBox='0 0 100 101'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                  fill='currentColor'
                                />
                                <path
                                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                  fill='currentFill'
                                />
                              </svg>
                              <span className='sr-only'>Loading...</span>
                            </div>
                          }
                        >
                          <ProjectCard project={project} priority={index < 3} locale={locale} />
                        </Suspense>
                      ))}
                    </AnimatePresence>
                  </ResponsiveList>
                </LayoutGroup>
              )}

              {totalPages > 1 && (
                <div className='w-full mt-12 flex justify-center'>
                  <Pagination
                    key={currentPage}
                    search={search}
                    totalPagination={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              )}
            </section>

            {/* Contact Section */}
            <section id="projects-contact" className='col-start-1 lg:col-start-2 col-end-5 md:col-end-9 lg:col-end-13 w-full pb-20'>
              <HomeContact text={translations} />
            </section>
          </TailwindGrid>
        </div>
      </motion.main>
    </TailwindGrid>
  );
};

export default Portfolio;

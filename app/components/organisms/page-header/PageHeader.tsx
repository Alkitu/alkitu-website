'use client';

import TailwindGrid from '@/app/components/templates/grid';
import { FilterButtons } from '@/app/components/molecules/filter-buttons';

interface FilterButton {
  id: string;
  label: string;
  value: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  filters: FilterButton[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function PageHeader({
  title,
  description,
  filters,
  activeFilter,
  onFilterChange,
}: PageHeaderProps) {
  return (
    <>
      {/* Title and Description Section */}
      <TailwindGrid>
        <section className='mt-20 md:mt-24 lg:mt-20 md:pt-8 flex items-center flex-col gap-6 w-full mb-6 col-span-full'>
          <h1 className='font-black pr-[min(3rem,1.5vw)] md:pr-3 xl:pr-4 leading-[min(3rem,9.5vw)] text-[min(3rem,9.5vw)] md:leading-[2.5vw] md:text-[5vw] lg:text-[5.3vw] lg:leading-[5.3vw] xl:text-[5.4vw] xl:leading-[5.4vw] 2xl:text-[5.5vw] 2xl:leading-[5.5vw] uppercase'>
            {title}
          </h1>
          {description && (
            <p className='self-center text-center md:self-start md:text-start leading-[min(3rem,3.5vw)] text-[min(3rem,3.5vw)] md:text-[1.8vw] md:leading-[1.8vw] lg:text-[1.5vw] lg:leading-[1.5vw] font-medium mx-auto uppercase'>
              {description}
            </p>
          )}
        </section>
      </TailwindGrid>

      {/* Filter Buttons Section with Bottom Border */}
      <section className='w-full flex justify-center items-center content-center pb-10 border-b border-border'>
        <FilterButtons
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </section>
    </>
  );
}

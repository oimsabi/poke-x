import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePokemonList } from '../hooks/usePokemonList';
import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import { PokemonGrid } from '../components/pokemon/list/PokemonGrid';
import { PokemonTable } from '../components/pokemon/list/PokemonTable';
import { LoadingSpinner, ErrorMessage, EmptyState, PageContainer } from '../components/ui';
import { cn } from '../utils/cn';
import { themeClasses } from '../styles/theme';

const GRID = 'grid';
const TABLE = 'table';

type ViewMode = typeof GRID | typeof TABLE;

export const PokemonListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>(GRID);
  const [isMobile, setIsMobile] = useState(false);
  const [previousPageSize, setPreviousPageSize] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pageSize = isMobile ? 12 : 24;
  
  // Get current page from URL or default to 1
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const offset = (currentPage - 1) * pageSize;
  
  const { results, loading, error, total } = usePokemonList({ limit: pageSize, offset });

  const totalPages = total ? Math.ceil(total / pageSize) : 0;

  // Adjust page number when screen size changes to maintain approximate position
  useEffect(() => {
    if (previousPageSize !== null && previousPageSize !== pageSize) {
      // Calculate the offset from the previous page size
      const previousOffset = (currentPage - 1) * previousPageSize;
      // Calculate what page that offset would be on the new page size
      const newPage = Math.max(1, Math.floor(previousOffset / pageSize) + 1);
      
      if (newPage !== currentPage) {
        setSearchParams({ page: newPage.toString() }, { replace: true });
      }
    }
    setPreviousPageSize(pageSize);
  }, [pageSize, previousPageSize, currentPage, setSearchParams]);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setSearchParams({ page: '1' });
    }
  }, [totalPages, currentPage, setSearchParams]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const goToPage = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageContainer>
      <Navigation />
      <div className="max-w-6xl mx-auto py-8 px-4 flex-1 w-full">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 mb-6">
          <div className="inline-flex rounded-md shadow-sm border border-gray-200 dark:border-gray-700" role="group">
            <button
              type="button"
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-l-md border-r border-gray-200 dark:border-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 w-full',
                viewMode === GRID
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600'
              )}
              onClick={() => setViewMode(GRID)}
            >
              Grid
            </button>
            <button
              type="button"
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-r-md',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 w-full',
                viewMode === TABLE
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600'
              )}
              onClick={() => setViewMode(TABLE)}
            >
              Table
            </button>
          </div>
        </header>

        {loading && <LoadingSpinner size="medium" message="Loading Pokemon..." />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && results.length === 0 && (
          <EmptyState message="No Pokemon found." />
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-6">
            <div>
              {viewMode === GRID ? (
                <PokemonGrid results={results} />
              ) : (
                <PokemonTable results={results} />
              )}
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className={cn('text-sm', themeClasses.text.secondary)}>
                Showing{' '}
                <span className={cn('font-semibold', themeClasses.text.primary)}>
                  {offset + 1}-{Math.min(offset + pageSize, total || offset + results.length)}
                </span>{' '}
                of <span className={cn('font-semibold', themeClasses.text.primary)}>{total || 'many'}</span> Pokémon
              </div>

              <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                  type="button"
                  disabled={currentPage === 1 || loading}
                  onClick={() => goToPage(currentPage - 1)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md border border-gray-200 dark:border-gray-700',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900/70',
                    currentPage === 1 || loading
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600'
                  )}
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="inline-flex rounded-md shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/70" role="group">
                  {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                        >
                          ...
                        </span>
                      );
                    }

                    const pageNumber = page as number;
                    const isCurrentPage = pageNumber === currentPage;

                    return (
                      <button
                        key={page}
                        type="button"
                        disabled={loading}
                        onClick={() => goToPage(pageNumber)}
                        className={cn(
                          'px-3 py-2 text-sm font-medium border-r border-gray-200 dark:border-gray-700 last:border-r-0',
                          'focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[2.5rem]',
                          isCurrentPage
                            ? 'bg-blue-600 text-white z-10'
                            : 'text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600'
                        )}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Next button */}
                <button
                  type="button"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => goToPage(currentPage + 1)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md border border-gray-200 dark:border-gray-700',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900/70',
                    currentPage >= totalPages || loading
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600'
                  )}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </PageContainer>
  );
};

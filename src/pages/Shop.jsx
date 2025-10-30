import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Filter, X, Grid, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import CategoryFilter from '../components/search/CategoryFilter';
import PriceRangeFilter from '../components/search/PriceRangeFilter';
import ProductGrid from '../components/Shop/ProductGrid';
import useProductSearch from '../hooks/useProductSearch';
import useSrisiamStore from '../store/Srisiam-store';
import { cn } from '../lib/utils';

/**
 * Shop Page Component
 * Main shop page with search, filter, and product display functionality
 */
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Zustand Store - For all products
  const { products: allProducts, getProduct } = useSrisiamStore();
  
  // Product Search Hook - For filtered products
  const {
    products: filteredProducts,
    isLoading,
    error,
    filters,
    searchProducts,
    setSearchQuery,
    setPriceRange,
    setCategoryFilter,
    clearFilters,
    hasActiveFilters,
  } = useProductSearch();

  // UI States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  /**
   * Load all products on mount
   */
  useEffect(() => {
    getProduct();
  }, [getProduct]);

  /**
   * Handle body scroll when filter is open on mobile
   */
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  /**
   * Handle ESC key to close filter
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFilterOpen) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFilterOpen]);

  /**
   * Handle URL parameters (for category and search from navbar)
   */
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    if (categoryParam) {
      // Set category filter from URL
      setCategoryFilter([Number(categoryParam)]);
    }

    if (searchParam) {
      // Set search query from URL
      setSearchQuery(searchParam);
    }
  }, [searchParams, setCategoryFilter, setSearchQuery]);

  /**
   * Trigger search when filters change
   */
  useEffect(() => {
    if (hasActiveFilters) {
      searchProducts();
    }
  }, [filters, hasActiveFilters, searchProducts]);

  

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (categoryIds) => {
    setCategoryFilter(categoryIds);
    // Update URL
    if (categoryIds.length === 1) {
      searchParams.set('category', categoryIds[0]);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  /**
   * Handle price range change
   */
  const handlePriceChange = (priceRange) => {
    setPriceRange(priceRange);
  };

  /**
   * Handle clear all filters
   */
  const handleClearFilters = () => {
    clearFilters();
    setSearchParams({});
  };

  /**
   * Toggle filter sidebar
   */
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  /**
   * Get products to display
   * Show filtered products if filters are active, otherwise show all products
   */
  const displayProducts = hasActiveFilters ? filteredProducts : allProducts;

  /**
   * Sort products
   */
  const sortedProducts = React.useMemo(() => {
    const products = [...displayProducts];
    
    switch (sortBy) {
      case 'price-low':
        return products.sort((a, b) => {
          const priceA = a.productsizes?.[0]?.price || 0;
          const priceB = b.productsizes?.[0]?.price || 0;
          return priceA - priceB;
        });
      case 'price-high':
        return products.sort((a, b) => {
          const priceA = a.productsizes?.[0]?.price || 0;
          const priceB = b.productsizes?.[0]?.price || 0;
          return priceB - priceA;
        });
      case 'name-asc':
        return products.sort((a, b) => a.title.localeCompare(b.title, 'th'));
      case 'name-desc':
        return products.sort((a, b) => b.title.localeCompare(a.title, 'th'));
      case 'newest':
      default:
        return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [displayProducts, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ร้านค้า</h1>
            
            {/* Mobile Filter Button */}
            <Button
              onClick={toggleFilter}
              variant="outline"
              size="sm"
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              ตัวกรอง
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex gap-4 lg:gap-6">
          {/* Mobile Filter Backdrop */}
          {isFilterOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleFilter}
            />
          )}

          {/* Filter Sidebar */}
          <aside
            className={cn(
              'lg:block lg:w-64 flex-shrink-0',
              'fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-80 lg:w-64',
              'bg-white lg:bg-transparent',
              'transform transition-transform duration-300 ease-in-out lg:transform-none',
              isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
              !isFilterOpen && 'lg:block hidden'
            )}
          >
            <div className="h-full lg:h-auto overflow-y-auto lg:sticky lg:top-4">
              {/* Mobile Filter Header */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
                <h2 className="text-lg font-semibold">ตัวกรอง</h2>
                <button 
                  onClick={toggleFilter}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4 lg:p-0 space-y-4 lg:space-y-6">
                {/* Category Filter */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    หมวดหมู่สินค้า
                  </h3>
                  <CategoryFilter
                    selectedCategories={filters.category}
                    onChange={handleCategoryChange}
                    showSelectAll
                  />
                </div>

                {/* Price Filter */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    ช่วงราคา
                  </h3>
                  <PriceRangeFilter
                    value={filters.price || [0, 5000]}
                    onChange={handlePriceChange}
                    min={0}
                    max={5000}
                    step={100}
                  />
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="w-full"
                  >
                    ล้างตัวกรองทั้งหมด
                  </Button>
                )}

                {/* Mobile Close Button */}
                <div className="lg:hidden pt-4 border-t">
                  <Button
                    onClick={toggleFilter}
                    variant="outline"
                    className="w-full"
                  >
                    ปิดตัวกรอง
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 gap-4">
              <p className="text-sm text-gray-600">
                {isLoading ? (
                  'กำลังโหลด...'
                ) : (
                  <>
                    แสดง <span className="font-semibold">{sortedProducts.length}</span> สินค้า
                    {hasActiveFilters && (
                      <span className="ml-1">
                        จากทั้งหมด <span className="font-semibold">{allProducts.length}</span> สินค้า
                      </span>
                    )}
                  </>
                )}
              </p>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 sm:px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001F3F] bg-white min-w-0 flex-shrink-0"
                >
                  <option value="newest">ใหม่ล่าสุด</option>
                  <option value="price-low">ราคา: ต่ำ-สูง</option>
                  <option value="price-high">ราคา: สูง-ต่ำ</option>
                  <option value="name-asc">ชื่อ: ก-ฮ</option>
                  <option value="name-desc">ชื่อ: ฮ-ก</option>
                </select>
              </div>
            </div>

            {/* Products Display */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <Button onClick={searchProducts} className="mt-4">
                  ลองอีกครั้ง
                </Button>
              </div>
            )}

            {isLoading ? (
              <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 sm:p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3 sm:mb-4" />
                    <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts}  />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  {hasActiveFilters
                    ? 'ไม่พบสินค้าที่ตรงกับการค้นหา'
                    : 'ไม่มีสินค้า'}
                </p>
                {hasActiveFilters && (
                  <Button onClick={handleClearFilters} variant="outline">
                    ล้างตัวกรอง
                  </Button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;

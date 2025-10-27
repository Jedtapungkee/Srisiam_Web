import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Filter, X, Grid, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import SearchBar from '../components/search/SearchBar';
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
  const location = useLocation();
  const navigate = useNavigate();
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
    resultsCount,
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
   * Handle search from search bar
   */
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Update URL
    if (query) {
      searchParams.set('search', query);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">ร้านค้า</h1>
            
            {/* Mobile Filter Button */}
            <Button
              onClick={toggleFilter}
              variant="outline"
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              ตัวกรอง
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <aside
            className={cn(
              'lg:block lg:w-64 flex-shrink-0',
              'fixed lg:relative inset-0 z-50 lg:z-auto',
              'bg-white lg:bg-transparent',
              isFilterOpen ? 'block' : 'hidden'
            )}
          >
            <div className="lg:sticky lg:top-4 h-full lg:h-auto overflow-y-auto">
              {/* Mobile Filter Header */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">ตัวกรอง</h2>
                <button onClick={toggleFilter}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4 lg:p-0 space-y-6">
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
              </div>
            </div>

            {/* Mobile Overlay */}
            {isFilterOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 -z-10"
                onClick={toggleFilter}
              />
            )}
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
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
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded',
                      viewMode === 'grid'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-400 hover:text-gray-600'
                    )}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded',
                      viewMode === 'list'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-400 hover:text-gray-600'
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001F3F]"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts} viewMode={viewMode} />
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

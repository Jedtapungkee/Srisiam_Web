import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ShopHeader from '../components/Shop/ShopHeader';
import ShopFilter from '../components/Shop/ShopFilter';
import ProductGrid from '../components/Shop/ProductGrid';
import useSrisiamStore from '../store/Srisiam-store';
import { SearchFilters, listProductBy } from '../api/Product';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Zustand Store
  const { products, getProduct } = useSrisiamStore();

  // console.log('Products from store:', products);
  
  // Local State
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    educationLevels: [],
    sizes: [],
    priceRange: [0, 5000],
    search: ''
  });
  
  // View & Sort States
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // URL Parameters handling
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const search = params.get('search');
    
    if (category) {
      setActiveFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }
    
    if (search) {
      setSearchQuery(search);
      setActiveFilters(prev => ({
        ...prev,
        search: search
      }));
    }
  }, [location.search]);

  // Apply filters to products from store
  const applyFilters = useCallback((filters = activeFilters, sort = sortBy) => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.title?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        product.category && filters.categories.includes(product.category.id)
      );
    }

    // Apply education level filter
    if (filters.educationLevels && filters.educationLevels.length > 0) {
      filtered = filtered.filter(product => 
        product.educationLevel && filters.educationLevels.includes(product.educationLevel.id)
      );
    }

    // Apply price filter
    if (filters.priceRange && filters.priceRange.length === 2) {
      filtered = filtered.filter(product => {
        // Get price from productSizes or fallback to product.price
        let price = 0;
        if (product.productsizes && product.productsizes.length > 0) {
          const prices = product.productsizes.map(size => parseFloat(size.price)).filter(p => !isNaN(p));
          price = prices.length > 0 ? Math.min(...prices) : 0;
        } else {
          price = parseFloat(product.price) || 0;
        }
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'price-low':
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceA - priceB;
        case 'price-high':
          const priceA2 = parseFloat(a.price) || 0;
          const priceB2 = parseFloat(b.price) || 0;
          return priceB2 - priceA2;
        case 'name-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'name-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredProducts(filtered);
    setTotalCount(filtered.length);
    setTotalPages(Math.ceil(filtered.length / 12));
  }, [products, activeFilters, sortBy]);

  // Initial load - load products from store
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        await getProduct(100); // Load products from API to store
      } catch (error) {
        console.error('Error loading products:', error);
        setError('ไม่สามารถโหลดสินค้าได้');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [getProduct]);

  // Update filtered products when store products change
  useEffect(() => {
    if (products && products.length > 0) {
      setError(null);
      applyFilters(activeFilters, sortBy);
    } else if (products && products.length === 0) {
      setFilteredProducts([]);
      setTotalCount(0);
      setTotalPages(1);
    }
  }, [products, applyFilters, activeFilters, sortBy]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
    applyFilters(newFilters, sortBy);
  };

  // Handle search
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const newFilters = { ...activeFilters, search: query };
    setActiveFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams(location.search);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    navigate({ search: params.toString() }, { replace: true });
    
    applyFilters(newFilters, sortBy);
  };

  // Handle sort change
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
    applyFilters(activeFilters, newSort);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    const clearedFilters = {
      categories: [],
      educationLevels: [],
      sizes: [],
      priceRange: [0, 5000],
      search: ''
    };
    
    setActiveFilters(clearedFilters);
    setSearchQuery('');
    setCurrentPage(1);
    
    // Clear URL params
    navigate({ search: '' }, { replace: true });
    
    applyFilters(clearedFilters, sortBy);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Note: Pagination is handled on client-side now
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle filter sidebar
  const handleToggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Shop Header
        <ShopHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          totalProducts={totalCount}
          activeFilters={activeFilters}
          onClearFilters={handleClearFilters}
          onToggleFilter={handleToggleFilter}
          isFilterOpen={isFilterOpen}
          className="mb-8"
        /> */}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className={`lg:col-span-1 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <ShopFilter
              onFilterChange={handleFilterChange}
              activeFilters={activeFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              error={error}
              viewMode={viewMode}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              totalCount={totalCount}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              hasNextPage={currentPage < totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
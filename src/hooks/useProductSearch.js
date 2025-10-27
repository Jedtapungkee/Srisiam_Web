import { useState, useCallback, useEffect } from 'react';
import { searchFilters } from '../api/Product';
import { toast } from 'sonner';

/**
 * Custom Hook for Product Search and Filtering
 * Provides state management and API integration for product search/filter functionality
 * 
 * @returns {Object} Search and filter state and methods
 */
const useProductSearch = () => {
  // State Management
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter States
  const [filters, setFilters] = useState({
    query: '',           // Search query string
    price: null,         // Price range [min, max]
    category: [],        // Array of category IDs
  });

  /**
   * Search products with current filters
   * Calls the API and updates products state
   */
  const searchProducts = useCallback(async () => {
    // Don't search if no filters are applied
    const hasFilters = filters.query || 
                       (filters.price && filters.price.length === 2) || 
                       (filters.category && filters.category.length > 0);
    
    if (!hasFilters) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare filter payload
      const payload = {};
      
      if (filters.query) {
        payload.query = filters.query;
      }
      
      if (filters.price && filters.price.length === 2) {
        payload.price = filters.price;
      }
      
      if (filters.category && filters.category.length > 0) {
        payload.category = filters.category;
      }

      const response = await searchFilters(payload);
      setProducts(response.data);
    //   console.log('Search results:', {
    //     payload,
    //     resultsCount: response.data.length,
    //     products: response.data
    //   });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการค้นหาสินค้า';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  /**
   * Update search query
   * @param {string} query - Search query string
   */
  const setSearchQuery = useCallback((query) => {
    setFilters(prev => ({
      ...prev,
      query: query
    }));
  }, []);

  /**
   * Update price range filter
   * @param {Array<number>} priceRange - [min, max] price range
   */
  const setPriceRange = useCallback((priceRange) => {
    setFilters(prev => ({
      ...prev,
      price: priceRange && priceRange.length === 2 ? priceRange : null
    }));
  }, []);

  /**
   * Update category filter
   * @param {Array<number>} categoryIds - Array of category IDs
   */
  const setCategoryFilter = useCallback((categoryIds) => {
    setFilters(prev => ({
      ...prev,
      category: categoryIds || []
    }));
  }, []);

  /**
   * Add a category to filter
   * @param {number} categoryId - Category ID to add
   */
  const addCategory = useCallback((categoryId) => {
    setFilters(prev => ({
      ...prev,
      category: [...new Set([...prev.category, categoryId])]
    }));
  }, []);

  /**
   * Remove a category from filter
   * @param {number} categoryId - Category ID to remove
   */
  const removeCategory = useCallback((categoryId) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.filter(id => id !== categoryId)
    }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({
      query: '',
      price: null,
      category: [],
    });
    setProducts([]);
    setError(null);
  }, []);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    clearFilters();
    setIsLoading(false);
  }, [clearFilters]);

  return {
    // State
    products,
    isLoading,
    error,
    filters,
    
    // Methods
    searchProducts,
    setSearchQuery,
    setPriceRange,
    setCategoryFilter,
    addCategory,
    removeCategory,
    clearFilters,
    reset,
    
    // Computed
    hasActiveFilters: !!(filters.query || filters.price || filters.category.length > 0),
    resultsCount: products.length,
  };
};

export default useProductSearch;

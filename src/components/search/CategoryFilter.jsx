import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { listCategory } from '../../api/Category';
import { toast } from 'sonner';

/**
 * CategoryFilter Component
 * Displays categories as checkboxes for filtering products
 * 
 * @param {Object} props
 * @param {Array<number>} props.selectedCategories - Array of selected category IDs
 * @param {Function} props.onChange - Callback when categories change
 * @param {boolean} props.showSelectAll - Show "Select All" option
 * @param {string} props.className - Additional CSS classes
 */
const CategoryFilter = ({
  selectedCategories = [],
  onChange,
  showSelectAll = false,
  className,
}) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch categories from API
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await listCategory();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('ไม่สามารถโหลดหมวดหมู่สินค้าได้');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /**
   * Handle category toggle
   * @param {number} categoryId - Category ID to toggle
   */
  const handleToggle = (categoryId) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    onChange?.(newSelected);
  };

  /**
   * Handle select all
   */
  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      onChange?.([]);
    } else {
      onChange?.(categories.map(cat => cat.id));
    }
  };

  /**
   * Check if category is selected
   */
  const isSelected = (categoryId) => selectedCategories.includes(categoryId);

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Select All Option */}
      {showSelectAll && categories.length > 0 && (
        <>
          <label
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div
              className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                selectedCategories.length === categories.length
                  ? 'bg-[#001F3F] border-[#001F3F]'
                  : 'border-gray-300 bg-white'
              )}
            >
              {selectedCategories.length === categories.length && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <input
              type="checkbox"
              checked={selectedCategories.length === categories.length}
              onChange={handleSelectAll}
              className="sr-only"
            />
            <span className="text-sm font-medium text-gray-900">
              เลือกทั้งหมด
            </span>
          </label>
          <hr className="my-2" />
        </>
      )}

      {/* Category Options */}
      {categories.map((category) => (
        <label
          key={category.id}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
        >
          <div
            className={cn(
              'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
              isSelected(category.id)
                ? 'bg-[#001F3F] border-[#001F3F]'
                : 'border-gray-300 bg-white group-hover:border-gray-400'
            )}
          >
            {isSelected(category.id) && (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
          <input
            type="checkbox"
            checked={isSelected(category.id)}
            onChange={() => handleToggle(category.id)}
            className="sr-only"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
            {category.name}
          </span>
        </label>
      ))}

      {/* Empty State */}
      {categories.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          ไม่พบหมวดหมู่สินค้า
        </p>
      )}
    </div>
  );
};

export default CategoryFilter;

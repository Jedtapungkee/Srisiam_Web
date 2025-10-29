import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Search,
  ShoppingBag,
  Filter,
  X,
} from 'lucide-react';

const ShopHeader = ({ 
  onSearchChange,
  totalProducts = 0,
  activeFilters = {},
  onClearFilters,
  onToggleFilter,
  isFilterOpen = false,
  className = ""
}) => {

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.categories?.length) count += activeFilters.categories.length;
    if (activeFilters.educationLevels?.length) count += activeFilters.educationLevels.length;
    if (activeFilters.sizes?.length) count += activeFilters.sizes.length;
    if (activeFilters.priceRange && (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 5000)) count += 1;
    if (activeFilters.search) count += 1;
    return count;
  };



  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filter Bar & Results */}
      <Card className="shadow-sm border-0 bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            {/* Results & Filter Toggle */}
            <div className="flex items-center space-x-4">
              {/* Filter Toggle Button */}
              <Button
                variant="outline"
                onClick={onToggleFilter}
                className={`flex items-center space-x-2 ${
                  isFilterOpen ? 'bg-blue-50 border-blue-200 text-blue-700' : ''
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>ตัวกรอง</span>
                {getActiveFilterCount() > 0 && (
                  <Badge className="bg-blue-500 text-white text-xs">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>

              {/* Results Count */}
              <div className="flex items-center space-x-2 text-gray-600">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-medium">
                  พบสินค้า {totalProducts.toLocaleString()} รายการ
                </span>
              </div>
            </div>

            {/* Clear Filters */}
            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                onClick={onClearFilters}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>ล้างตัวกรอง</span>
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {getActiveFilterCount() > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {/* Search Filter */}
                {activeFilters.search && (
                  <Badge className="bg-green-100 text-green-700 flex items-center space-x-1">
                    <Search className="w-3 h-3" />
                    <span>"{activeFilters.search}"</span>
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-green-900" 
                      onClick={() => onSearchChange?.('')}
                    />
                  </Badge>
                )}

                {/* Price Range Filter */}
                {activeFilters.priceRange && 
                 (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 5000) && (
                  <Badge className="bg-blue-100 text-blue-700 flex items-center space-x-1">
                    <span>
                      ฿{activeFilters.priceRange[0].toLocaleString()} - ฿{activeFilters.priceRange[1].toLocaleString()}
                    </span>
                  </Badge>
                )}

                {/* Category Filters */}
                {activeFilters.categories?.map((categoryId) => (
                  <Badge key={`cat-${categoryId}`} className="bg-purple-100 text-purple-700">
                    หมวดหมู่ {categoryId}
                  </Badge>
                ))}

                {/* Size Filters */}
                {activeFilters.sizes?.map((size) => (
                  <Badge key={`size-${size}`} className="bg-orange-100 text-orange-700">
                    ขนาด {size}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopHeader;
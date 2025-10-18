import React from 'react';
import ProductCard from './ProductCard';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Grid,
  List,
  ArrowUpDown,
  Package,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';

const ProductGrid = ({ 
  products = [], 
  isLoading = false, 
  error = null,
  viewMode = 'grid',
  sortBy = 'newest',
  onSortChange,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  hasNextPage = false,
  className = ""
}) => {

  const sortOptions = [
    { value: 'newest', label: 'ใหม่ล่าสุด' },
    { value: 'oldest', label: 'เก่าที่สุด' },
    { value: 'price-low', label: 'ราคาน้อยไปมาก' },
    { value: 'price-high', label: 'ราคามากไปน้อย' },
    { value: 'name-asc', label: 'ชื่อ A-Z' },
    { value: 'name-desc', label: 'ชื่อ Z-A' },
    { value: 'popular', label: 'ยอดนิยม' },
    { value: 'rating', label: 'คะแนนสูงสุด' }
  ];

  // Loading Skeleton Component
  const ProductSkeleton = () => (
    <Card className="overflow-hidden animate-pulse">
      <CardContent className="p-0">
        <div className="aspect-square bg-gray-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          ลองใหม่อีกครั้ง
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Grid Header */}
      <Card className="shadow-sm border-0 bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            {/* Results Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-800">
                  พบสินค้า {totalCount.toLocaleString()} รายการ
                </span>
              </div>
              {currentPage > 1 && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  หน้า {currentPage} จาก {totalPages}
                </Badge>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="เรียงตาม" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {isLoading ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {[...Array(12)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : products.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">ไม่พบสินค้า</h3>
          <p className="text-gray-600 mb-4">
            ลองปรับเปลี่ยนตัวกรองหรือคำค้นหาของคุณ
          </p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className={viewMode === 'list' ? 'flex-row' : ''}
              />
            ))}
          </div>

          {/* Load More / Pagination */}
          {hasNextPage && (
            <div className="flex justify-center pt-8">
              <Button
                onClick={() => onPageChange?.(currentPage + 1)}
                size="lg"
                variant="outline"
                className="px-8 py-3 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังโหลด...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    โหลดสินค้าเพิ่มเติม
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Pagination Info */}
          {totalPages > 1 && (
            <div className="text-center pt-4 text-sm text-gray-600">
              แสดงสินค้า {((currentPage - 1) * 12) + 1} - {Math.min(currentPage * 12, totalCount)} 
              จากทั้งหมด {totalCount.toLocaleString()} รายการ
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
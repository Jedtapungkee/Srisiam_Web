import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Trophy, Package, TrendingUp } from 'lucide-react';

const TopProducts = ({ products, loading }) => {
  const getRankColor = (index) => {
    switch (index) {
      case 0: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 1: return 'bg-gray-100 text-gray-800 border-gray-200';
      case 2: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '🏅';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          สินค้าขายดี
        </CardTitle>
        <CardDescription>
          5 อันดับสินค้าที่ขายดีที่สุด
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products?.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <Badge 
                    variant="outline" 
                    className={`${getRankColor(index)} font-bold text-sm px-2 py-1`}
                  >
                    <span className="mr-1">{getRankIcon(index)}</span>
                    #{index + 1}
                  </Badge>
                </div>
                
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" title={product.title}>
                    {product.title}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {product.category && (
                      <Badge variant="secondary" className="text-xs">
                        {product.category.name}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      ขาย {product.totalSold} ชิ้น
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            
            {(!products || products.length === 0) && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">ยังไม่มีข้อมูลการขาย</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopProducts;
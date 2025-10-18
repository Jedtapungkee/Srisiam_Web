import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { 
  Filter, 
  X, 
  Search,
  DollarSign,
  Tag,
  Shirt,
  RefreshCw
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import useSrisiamStore from '../../store/Srisiam-store';

const ShopFilter = ({ onFilterChange, activeFilters, onClearFilters }) => {
  // Zustand Store
  const { categories, educationLevels, getCategory, getEducationLevel } = useSrisiamStore();
  
  // Local State
  const [isOpen, setIsOpen] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedEducationLevels, setSelectedEducationLevels] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Available sizes
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Load initial data
  useEffect(() => {
    getCategory();
    getEducationLevel();
  }, [getCategory, getEducationLevel]);

  // Handle filter changes
  const handleCategoryChange = (categoryId, checked) => {
    const newCategories = checked 
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(id => id !== categoryId);
    
    setSelectedCategories(newCategories);
    updateFilters({ categories: newCategories });
  };

  const handleEducationLevelChange = (levelId, checked) => {
    const newLevels = checked
      ? [...selectedEducationLevels, levelId]
      : selectedEducationLevels.filter(id => id !== levelId);
    
    setSelectedEducationLevels(newLevels);
    updateFilters({ educationLevels: newLevels });
  };

  const handleSizeChange = (size, checked) => {
    const newSizes = checked
      ? [...selectedSizes, size]
      : selectedSizes.filter(s => s !== size);
    
    setSelectedSizes(newSizes);
    updateFilters({ sizes: newSizes });
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    updateFilters({ priceRange: value });
  };

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    updateFilters({ search: value });
  };

  const updateFilters = (newFilter) => {
    const filters = {
      categories: selectedCategories,
      educationLevels: selectedEducationLevels,
      sizes: selectedSizes,
      priceRange: priceRange,
      search: searchKeyword,
      ...newFilter
    };
    onFilterChange(filters);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedEducationLevels([]);
    setSelectedSizes([]);
    setPriceRange([0, 5000]);
    setSearchKeyword('');
    onClearFilters();
  };

  const getTotalActiveFilters = () => {
    return selectedCategories.length + 
           selectedEducationLevels.length + 
           selectedSizes.length + 
           (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0) +
           (searchKeyword ? 1 : 0);
  };

  return (
    <Card className="h-fit sticky top-4 shadow-lg border-0 bg-white">
      <CardContent className="p-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">ตัวกรอง</h3>
            {getTotalActiveFilters() > 0 && (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                {getTotalActiveFilters()}
              </Badge>
            )}
          </div>
          
          {getTotalActiveFilters() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              ล้างทั้งหมด
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <Label htmlFor="search" className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Search className="w-4 h-4 mr-1" />
            ค้นหาสินค้า
          </Label>
          <Input
            id="search"
            placeholder="ค้นหาชื่อสินค้า..."
            value={searchKeyword}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>

        {/* Price Range */}
        <Collapsible className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-gray-700">ช่วงราคา</span>
            </div>
            <span className="text-sm text-gray-500">
              ฿{priceRange[0].toLocaleString()} - ฿{priceRange[1].toLocaleString()}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pt-4">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={5000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>฿0</span>
              <span>฿5,000+</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Categories */}
        <Collapsible className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-gray-700">หมวดหมู่</span>
            </div>
            {selectedCategories.length > 0 && (
              <Badge className="bg-blue-100 text-blue-700">
                {selectedCategories.length}
              </Badge>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pt-4 space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm text-gray-600 cursor-pointer flex-1"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Education Levels */}
        <Collapsible className="mb-6">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-2">
              <Shirt className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-gray-700">ระดับการศึกษา</span>
            </div>
            {selectedEducationLevels.length > 0 && (
              <Badge className="bg-blue-100 text-blue-700">
                {selectedEducationLevels.length}
              </Badge>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pt-4 space-y-3">
            {educationLevels.map((level) => (
              <div key={level.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`level-${level.id}`}
                  checked={selectedEducationLevels.includes(level.id)}
                  onCheckedChange={(checked) => handleEducationLevelChange(level.id, checked)}
                />
                <Label
                  htmlFor={`level-${level.id}`}
                  className="text-sm text-gray-600 cursor-pointer flex-1"
                >
                  {level.name}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Sizes */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-2">
              <Shirt className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-gray-700">ขนาด</span>
            </div>
            {selectedSizes.length > 0 && (
              <Badge className="bg-blue-100 text-blue-700">
                {selectedSizes.length}
              </Badge>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pt-4">
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSizeChange(size, !selectedSizes.includes(size))}
                  className={`w-12 h-12 ${
                    selectedSizes.includes(size) 
                      ? 'bg-blue-500 text-white' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Active Filters Display */}
        {getTotalActiveFilters() > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              ตัวกรองที่เลือก
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => {
                const category = categories.find(c => c.id === categoryId);
                return category ? (
                  <Badge key={categoryId} className="bg-blue-100 text-blue-700">
                    {category.name}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => handleCategoryChange(categoryId, false)}
                    />
                  </Badge>
                ) : null;
              })}
              
              {selectedSizes.map((size) => (
                <Badge key={size} className="bg-green-100 text-green-700">
                  {size}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => handleSizeChange(size, false)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopFilter;
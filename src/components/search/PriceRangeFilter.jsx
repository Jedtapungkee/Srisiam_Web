import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

/**
 * PriceRangeFilter Component
 * Dual range slider for filtering products by price
 * 
 * @param {Object} props
 * @param {Array<number>} props.value - [min, max] price range
 * @param {Function} props.onChange - Callback when range changes
 * @param {number} props.min - Minimum price
 * @param {number} props.max - Maximum price
 * @param {number} props.step - Step increment
 * @param {string} props.currency - Currency symbol
 * @param {string} props.className - Additional CSS classes
 */
const PriceRangeFilter = ({
  value = [0, 5000],
  onChange,
  min = 0,
  max = 5000,
  step = 100,
  currency = '฿',
  className,
}) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);

  // Update local state when prop changes
  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  /**
   * Handle min value change
   */
  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(newMin);
    onChange?.([newMin, maxValue]);
  };

  /**
   * Handle max value change
   */
  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(newMax);
    onChange?.([minValue, newMax]);
  };

  /**
   * Format price with currency
   */
  const formatPrice = (price) => {
    return `${currency}${price.toLocaleString()}`;
  };

  /**
   * Calculate percentage for styling
   */
  const getPercentage = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

  const minPercentage = getPercentage(minValue, min, max);
  const maxPercentage = getPercentage(maxValue, min, max);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Price Display */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          {formatPrice(minValue)}
        </div>
        <div className="text-sm text-gray-500">-</div>
        <div className="text-sm font-medium text-gray-700">
          {formatPrice(maxValue)}
        </div>
      </div>

      {/* Dual Range Slider */}
      <div className="relative pt-2 pb-6">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 bg-gray-200 rounded-full">
          {/* Active Track */}
          <div
            className="absolute h-full bg-[#001F3F] rounded-full"
            style={{
              left: `${minPercentage}%`,
              right: `${100 - maxPercentage}%`,
            }}
          />
        </div>

        {/* Min Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#001F3F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#001F3F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: minValue > max - 100 ? 5 : 3 }}
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#001F3F] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#001F3F] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;

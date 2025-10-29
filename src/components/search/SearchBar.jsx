import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const SearchBar = ({
  value = '',
  onChange,
  onSearch,
  onClear,
  placeholder = 'ค้นหาสินค้า...',
  className,
  autoFocus = false,
  showSearchButton = false,
  variant = 'default',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
  }, [onChange]);

  /**
   * Handle Enter key press
   */
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch?.(value);
    }
  }, [value, onSearch]);

  /**
   * Handle clear button click
   */
  const handleClear = useCallback(() => {
    onChange?.('');
    onClear?.();
  }, [onChange, onClear]);

  /**
   * Handle search button click
   */
  const handleSearchClick = useCallback(() => {
    if (value.trim()) {
      onSearch?.(value);
    }
  }, [value, onSearch]);

  // Variant-specific styles
  const variantStyles = {
    default: {
      container: 'w-full max-w-2xl',
      input: 'bg-white text-gray-900 placeholder:text-gray-500 border-gray-300',
      icon: 'text-gray-500',
    },
    navbar: {
      container: 'relative group',
      input: cn(
        'bg-white/20 text-white placeholder:text-blue-200 border-white/30 rounded-full',
        'focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-500',
        'transition-all duration-200'
      ),
      icon: 'text-blue-200 group-focus-within:text-gray-500',
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <div className={cn(styles.container, className)}>
      {variant === 'navbar' && (
        <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 transform -skew-x-12 rounded-full opacity-60 group-focus-within:opacity-100 transition-opacity duration-300" />
      )}
      
      <div className="relative flex items-center">
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'pr-20',
            styles.input,
            showSearchButton ? 'rounded-l-full rounded-r-none' : 'rounded-full'
          )}
        />

        {/* Clear Button - Shows when there's text */}
        {value && (
          <button
            onClick={handleClear}
            className={cn(
              'absolute right-10 p-1 hover:bg-gray-100 rounded-full transition-colors',
              variant === 'navbar' && 'hover:bg-white/20'
            )}
            aria-label="Clear search"
            type="button"
          >
            <X className={cn('h-4 w-4', styles.icon)} />
          </button>
        )}

        {/* Search Icon/Button */}
        {showSearchButton ? (
          <Button
            onClick={handleSearchClick}
            disabled={!value.trim()}
            className="rounded-l-none rounded-r-full h-full px-4 bg-[#001F3F] hover:bg-[#003366]"
            type="button"
          >
            <Search className="h-4 w-4" />
          </Button>
        ) : (
          <Search 
            className={cn(
              'absolute right-3 h-4 w-4 pointer-events-none',
              styles.icon
            )} 
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;

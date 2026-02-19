import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, ChevronDown } from "lucide-react";

const SearchableDropdown = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select...", 
  disabled = false,
  loading = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`space-y-2 ${className}`} ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`w-full px-3 py-2 border rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            disabled || loading
              ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={value ? "text-gray-900" : "text-gray-500"}>
              {loading ? "Loading..." : value || placeholder}
            </span>
            <div className="flex items-center gap-1">
              {value && !disabled && (
                <button
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              )}
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            </div>
          </div>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {searchTerm ? "No matching options" : "No options available"}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      value === option ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableDropdown;

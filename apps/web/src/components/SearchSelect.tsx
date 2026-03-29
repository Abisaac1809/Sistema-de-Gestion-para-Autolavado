import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type SearchSelectProps<T> = {
  value: string | null;
  onChange: (value: string | null) => void;
  options: T[];
  isLoading?: boolean;
  placeholder?: string;
  error?: string;
  getOptionId: (option: T) => string;
  getOptionLabel: (option: T) => string;
  disabled?: boolean;
};

export function SearchSelect<T>({
  value,
  onChange,
  options,
  isLoading = false,
  placeholder = "Buscar...",
  error,
  getOptionId,
  getOptionLabel,
  disabled = false,
}: SearchSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = value
    ? options.find((opt) => getOptionId(opt) === value) ?? null
    : null;

  const filteredOptions = searchText.trim()
    ? options.filter((opt) =>
        getOptionLabel(opt).toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  function handleInputFocus() {
    if (!disabled) {
      setSearchText("");
      setIsOpen(true);
      setHighlightedIndex(-1);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  }

  function handleOptionSelect(option: T) {
    onChange(getOptionId(option));
    setSearchText("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    setSearchText("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchText("");
      setHighlightedIndex(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleOptionSelect(filteredOptions[highlightedIndex]);
      }
    }
  }

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchText("");
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const displayValue =
    isOpen || !selectedOption ? searchText : getOptionLabel(selectedOption);

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex items-center border rounded-lg bg-white transition-colors ${
          error
            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500"
            : "border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
        } ${disabled ? "bg-gray-50 opacity-60 cursor-not-allowed" : ""}`}
      >
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={selectedOption ? getOptionLabel(selectedOption) : placeholder}
          disabled={disabled}
          className="flex-1 px-3 py-2 text-sm text-gray-900 bg-transparent outline-none placeholder-gray-400 disabled:cursor-not-allowed"
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpiar selección"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {isOpen && !disabled && (isLoading || filteredOptions.length > 0) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500">Cargando...</div>
          ) : (
            filteredOptions.map((option, index) => {
              const optionId = getOptionId(option);
              const isSelected = optionId === value;
              const isHighlighted = index === highlightedIndex;
              return (
                <div
                  key={optionId}
                  onClick={() => handleOptionSelect(option)}
                  className={`px-3 py-2 text-sm cursor-pointer ${
                    isHighlighted ? "bg-gray-100" : "hover:bg-gray-100"
                  } ${
                    isSelected ? "bg-gray-50 font-medium text-gray-900" : "text-gray-700"
                  }`}
                >
                  {getOptionLabel(option)}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

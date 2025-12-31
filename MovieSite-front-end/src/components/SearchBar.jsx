import { useState, useEffect } from "react";

export default function SearchBar({ onChange, placeholder = "Search movies...", defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const id = setTimeout(() => {
      onChange?.(value);
    }, 400);
    return () => clearTimeout(id);
  }, [value, onChange]);

  return (
    <input
      type="search"
      autoFocus
      className="search-input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      aria-label="Search movies"
    />
  );
}

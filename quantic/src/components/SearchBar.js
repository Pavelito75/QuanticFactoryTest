'use client';

import { useState } from "react";

export default function SearchBar({ onQueryChange }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (onQueryChange) onQueryChange(e.target.value);
  };

  return (
    <div>
      <input className="search-bar-input" value={query} onChange={handleChange} placeholder="Rechercher par nom, rue, adresse, commune..."/>
    </div>
  );
}
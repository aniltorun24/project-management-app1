import React from 'react';
import './Filter.css';

const Filter = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,  // YENİ
  onCategoryFilterChange,  // YENİ
  categories,  // YENİ
  onResetFilters
}) => {
  return (
    <div className="filter-container">
      <div className="filter-wrapper">
        {/* Arama */}
        <div className="filter-group">
          <label htmlFor="search">🔍 Görev Ara</label>
          <input
            id="search"
            type="text"
            placeholder="Görev adı ile ara..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Durum Filtresi */}
        <div className="filter-group">
          <label htmlFor="status">📌 Durum</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">Tümü</option>
            <option value="todo">Yapılacak</option>
            <option value="inprogress">Devam Ediyor</option>
            <option value="done">Tamamlandı</option>
          </select>
        </div>

        {/* Öncelik Filtresi */}
        <div className="filter-group">
          <label htmlFor="priority">⭐ Öncelik</label>
          <select
            id="priority"
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">Tümü</option>
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </select>
        </div>

        {/* YENİ: Kategori Filtresi */}
        <div className="filter-group">
          <label htmlFor="category">🏷️ Kategori</label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">Tümü</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Butonu */}
        <button 
          className="reset-btn"
          onClick={onResetFilters}
          title="Filtreleri sıfırla"
        >
          🔄 Sıfırla
        </button>
      </div>
    </div>
  );
};

export default Filter;
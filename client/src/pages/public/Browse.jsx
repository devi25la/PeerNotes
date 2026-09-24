import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  Frown,
  RotateCcw,
  Sparkles,
  Layers,
  LayoutGrid,
  List
} from 'lucide-react';
import ResourceCard from '../../components/ResourceCard';
import FilterSidebar from '../../components/FilterSidebar';
import Pagination from '../../components/Pagination';
import { CardSkeleton } from '../../components/SkeletonLoader';
import api from '../../services/api';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params state
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const semesterParam = searchParams.get('semester') || 'All';
  const departmentParam = searchParams.get('department') || 'All';
  const typeParam = searchParams.get('type') || 'All';
  const sortParam = searchParams.get('sort') || 'popular';
  const pageParam = parseInt(searchParams.get('page'), 10) || 1;

  // Local inputs
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Synchronize local input with query param
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Update query params helper
  const updateQueryParam = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'All' || value === '' || value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Reset to page 1 on filter changes unless page itself is changing
    if (!updates.page) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  // Fetch filtered resources from backend API
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pageParam,
        limit: 12,
        sort: sortParam,
        status: 'approved'
      };

      if (searchQuery) params.search = searchQuery;
      if (categoryParam !== 'All') params.category = categoryParam;
      if (semesterParam !== 'All') params.semester = semesterParam;
      if (departmentParam !== 'All') params.department = departmentParam;
      if (typeParam !== 'All') params.resourceType = typeParam;

      const res = await api.get('/resources', { params });
      if (res.data.success) {
        setResources(res.data.data);
        setTotalCount(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryParam, semesterParam, departmentParam, typeParam, sortParam, pageParam]);

  useEffect(() => {
    fetchResources();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchResources]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParam({ search: searchInput.trim(), page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Academic Resource Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Discover College Notes & Study Guides
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Filter through verified student notes, previous year question papers, lab manuals, and formula sheets.
          </p>
        </div>

        {/* Search inside banner */}
        <form onSubmit={handleSearchSubmit} className="max-w-md w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search topic, subject, keywords..."
            className="w-full bg-white text-slate-900 placeholder-slate-400 pl-10 pr-24 py-3 rounded-2xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Grid: Filters Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Filter Options</span>
          </div>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold"
          >
            {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`lg:col-span-3 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <FilterSidebar
            categories={categories}
            selectedCategory={categoryParam}
            onSelectCategory={(cat) => updateQueryParam({ category: cat })}
            selectedSemester={semesterParam}
            onSelectSemester={(sem) => updateQueryParam({ semester: sem })}
            selectedDepartment={departmentParam}
            onSelectDepartment={(dept) => updateQueryParam({ department: dept })}
            selectedType={typeParam}
            onSelectType={(t) => updateQueryParam({ type: t })}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Results Area */}
        <section className="lg:col-span-9 space-y-6">
          {/* Controls Bar: Total Found + Sort Dropdown */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs font-medium text-slate-600">
              {loading ? (
                <span>Loading study resources...</span>
              ) : (
                <span>
                  Showing <strong className="text-slate-900 font-bold">{resources.length}</strong> of{' '}
                  <strong className="text-slate-900 font-bold">{totalCount}</strong> verified resources
                  {searchQuery && (
                    <span>
                      {' '}
                      for "<span className="text-indigo-600 font-bold">{searchQuery}</span>"
                    </span>
                  )}
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortParam}
                onChange={(e) => updateQueryParam({ sort: e.target.value })}
                className="text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="popular">Most Downloaded</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Recently Added</option>
                <option value="bookmarks">Most Bookmarked</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((res) => (
                <ResourceCard key={res._id} resource={res} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Frown className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching study materials found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Try adjusting your search keywords, selecting a different semester, or clearing category filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={pageParam}
            totalPages={totalPages}
            onPageChange={(page) => updateQueryParam({ page })}
          />
        </section>
      </div>
    </div>
  );
};

export default Browse;

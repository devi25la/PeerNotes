import React from 'react';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';

const FilterSidebar = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  selectedSemester,
  onSelectSemester,
  selectedDepartment,
  onSelectDepartment,
  selectedType,
  onSelectType,
  onResetFilters
}) => {
  const departments = [
    'All',
    'Computer Science & Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication',
    'Software Engineering',
    'Cyber Security',
    'Computer Engineering',
    'Mechanical Engineering',
    'Electrical Engineering'
  ];

  const semesters = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];

  const resourceTypes = [
    { value: 'All', label: 'All Formats' },
    { value: 'pdf', label: 'PDF Documents' },
    { value: 'doc', label: 'Word (DOC/DOCX)' },
    { value: 'ppt', label: 'Presentations (PPT)' },
    { value: 'image', label: 'Images & Diagram' }
  ];

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSemester !== 'All' ||
    selectedDepartment !== 'All' ||
    selectedType !== 'All';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filter Resources</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Categories
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectCategory('All')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'All' && <Check className="w-3.5 h-3.5" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id || cat.name}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="truncate pr-2">{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  selectedCategory === cat.name ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.resourceCount ?? ''}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Semester */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Semester
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {semesters.map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => onSelectSemester(sem)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center transition-all ${
                selectedSemester === sem
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {sem === 'All' ? 'All Sems' : `Sem ${sem}`}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          File Format
        </label>
        <div className="space-y-1">
          {resourceTypes.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onSelectType(t.value)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedType === t.value
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{t.label}</span>
              {selectedType === t.value && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Department Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Department
        </label>
        <select
          value={selectedDepartment}
          onChange={(e) => onSelectDepartment(e.target.value)}
          className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar;

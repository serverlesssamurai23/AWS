'use client';
import React, { useState, FormEvent } from 'react';
import { mockAdminCategories, AdminCategory } from '../mockAdminData'; // Adjust path

// Interface for category form data (slug might be auto-generated or manual)
interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
}

const initialFormState: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
};

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<AdminCategory[]>(mockAdminCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(initialFormState);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newSlug = formData.slug;
    if (name === 'name' && !editingCategory) { // Auto-generate slug only for new categories and if slug field is empty or matches old name-slug
        newSlug = value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    if (name === 'slug') {
        newSlug = value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        slug: name === 'name' && !editingCategory ? newSlug : (name === 'slug' ? newSlug : prev.slug) // only update slug if name changed or slug itself changed
    }));

    if (formErrors[name as keyof CategoryFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
     if (name === 'name' && formErrors.slug && !editingCategory) { // Clear slug error if name changes and auto-slugging
      setFormErrors(prev => ({ ...prev, slug: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required.';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) newErrors.slug = 'Slug must be lowercase alphanumeric with hyphens.';
    
    // Check for duplicate slug if not editing the same category
    const existingCategoryWithSlug = categories.find(cat => cat.slug === formData.slug);
    if (existingCategoryWithSlug && (!editingCategory || editingCategory.id !== existingCategoryWithSlug.id)) {
        newErrors.slug = 'This slug is already in use by another category.';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingCategory) {
      // Simulate update
      setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? { ...editingCategory, ...formData, productCount: cat.productCount || 0 } : cat));
      alert('Category updated (simulated).');
    } else {
      // Simulate add
      const newCategory: AdminCategory = {
        id: `cat-${Date.now()}`,
        ...formData,
        productCount: 0,
      };
      setCategories(prev => [newCategory, ...prev]);
      alert('Category added (simulated).');
    }
    setShowForm(false);
    setEditingCategory(null);
    setFormData(initialFormState);
  };

  const handleEdit = (category: AdminCategory) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug, description: category.description || '' });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This is a simulation.')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      if (editingCategory?.id === categoryId) {
        setShowForm(false);
        setEditingCategory(null);
        setFormData(initialFormState);
      }
      alert('Category deleted (simulated).');
    }
  };
  
  const handleToggleForm = () => {
    setShowForm(prev => !prev);
    setEditingCategory(null); // Reset editing state when toggling form for add
    setFormData(initialFormState); // Reset form when toggling
    setFormErrors({});
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
        <button 
            onClick={handleToggleForm}
            className={`px-4 py-2 text-white font-semibold rounded-md shadow-sm transition-colors
                        ${showForm && !editingCategory ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {showForm && !editingCategory ? 'Cancel' : 'Add New Category'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className={`mt-1 block w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} required />
              {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
              <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleInputChange} className={`mt-1 block w-full px-3 py-2 border ${formErrors.slug ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} required />
              {formErrors.slug && <p className="text-xs text-red-500 mt-1">{formErrors.slug}</p>}
              <p className="text-xs text-gray-500 mt-1">URL-friendly version of the name (e.g., 'prescription-glasses'). Auto-generated from name if left empty on add.</p>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <span className="text-xs text-gray-500">(Optional)</span></label>
              <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              {editingCategory && <button type="button" onClick={() => { setShowForm(false); setEditingCategory(null); setFormData(initialFormState);}} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel Edit</button>}
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {editingCategory ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{category.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{category.productCount || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(category)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
                 <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                        No categories found. Add one using the button above.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;

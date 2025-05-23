const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface ApiError extends Error {
  status?: number;
  details?: any;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({ message: response.statusText }));
      const error = new Error(`API Error: ${response.status} ${errorDetails.message || response.statusText}`) as ApiError;
      error.status = response.status;
      error.details = errorDetails;
      throw error;
    }
    return response.json();
  } catch (error) {
    console.error(`Fetch API error for endpoint ${endpoint}:`, error);
    throw error; // Re-throw to be caught by the caller
  }
}

// Product Types (align with backend responses)
export interface ProductVariant {
  id: string;
  name: string;
  sku_suffix?: string;
  price_modifier?: number;
  stock_quantity?: number;
  image_url?: string;
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock_quantity: number;
  main_image_url?: string;
  category_name?: string;
  category_slug?: string;
  variants?: ProductVariant[];
  // Add other fields as needed from your backend Product model
}

export interface PaginatedProducts {
  data: Product[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
}

// API Service Functions
export const getProducts = (params: { category?: string; sortBy?: string; order?: string; limit?: number; page?: number } = {}): Promise<PaginatedProducts> => {
  const queryParams = new URLSearchParams();
  if (params.category) queryParams.append('category', params.category);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.order) queryParams.append('order', params.order);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.page) queryParams.append('page', params.page.toString());
  return fetchAPI(`/products?${queryParams.toString()}`);
};

export const getProductById = (id: string): Promise<Product> => {
  return fetchAPI(`/products/${id}`);
};

export const getCategories = (): Promise<Category[]> => {
  return fetchAPI('/categories');
};

export const getCategoryBySlug = (slug: string): Promise<Category> => {
  return fetchAPI(`/categories/${slug}`);
};

export const getProductsByCategorySlug = (slug: string, params: { sortBy?: string; order?: string; limit?: number; page?: number } = {}): Promise<PaginatedProducts & { category: Category }> => {
  const queryParams = new URLSearchParams();
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.order) queryParams.append('order', params.order);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.page) queryParams.append('page', params.page.toString());
  return fetchAPI(`/categories/${slug}/products?${queryParams.toString()}`);
};

// Append these to your existing api.ts

// Prescription Types (align with backend UserPrescriptions table)
export interface UserPrescription {
  id: string;
  user_id: string;
  prescription_name?: string;
  prescription_type: string; // e.g., "eyeglass_single_vision", "eyeglass_progressive"
  patient_name: string;
  prescriber_name?: string;
  prescription_date: string; // Should be formatted as YYYY-MM-DD
  expiry_date?: string;     // Should be formatted as YYYY-MM-DD
  pd_right?: number;
  pd_left?: number;
  pd_both?: number;
  sphere_right: number;
  cylinder_right?: number;
  axis_right?: number;
  add_right?: number;
  prism_diopters_right?: number;
  prism_base_direction_right?: string;
  sphere_left: number;
  cylinder_left?: number;
  axis_left?: number;
  add_left?: number;
  prism_diopters_left?: number;
  prism_base_direction_left?: string;
  notes?: string;
  uploaded_file_url?: string;
  created_at: string;
  updated_at: string;
}

export type UserPrescriptionCreationData = Omit<UserPrescription, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UserPrescriptionUpdateData = Partial<UserPrescriptionCreationData>;


// Assumes you have a way to get the auth token (e.g., from context, localStorage)
// This is a placeholder; actual token management is more complex.
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken'); // Example: retrieve token
  }
  return null;
};

// Prescription API Service Functions
export const createPrescription = (data: UserPrescriptionCreationData): Promise<UserPrescription> => {
  const token = getAuthToken();
  if (!token) return Promise.reject(new Error('No auth token found'));
  return fetchAPI('/prescriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
};

export const getMyPrescriptions = (): Promise<UserPrescription[]> => {
  const token = getAuthToken();
  if (!token) return Promise.reject(new Error('No auth token found'));
  return fetchAPI('/prescriptions', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getMyPrescriptionById = (id: string): Promise<UserPrescription> => {
  const token = getAuthToken();
  if (!token) return Promise.reject(new Error('No auth token found'));
  return fetchAPI(`/prescriptions/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const updateMyPrescription = (id: string, data: UserPrescriptionUpdateData): Promise<UserPrescription> => {
  const token = getAuthToken();
  if (!token) return Promise.reject(new Error('No auth token found'));
  return fetchAPI(`/prescriptions/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
};

export const deleteMyPrescription = (id: string): Promise<void> => {
  const token = getAuthToken();
  if (!token) return Promise.reject(new Error('No auth token found'));
  return fetchAPI(`/prescriptions/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(() => undefined); // Ensure it resolves to void
};

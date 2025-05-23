// Re-using Product interface from main site, can be expanded for admin needs
import { Product, Category as MainCategory } from '@/services/api'; // Adjust path

export interface AdminProduct extends Product {
  // Add any admin-specific fields if needed, e.g., internal notes
  isVisible?: boolean; 
}
export interface AdminCategory extends MainCategory {
    productCount?: number; // Example admin-specific field
}


export const mockAdminProducts: AdminProduct[] = [
  { 
    id: 'prod1', name: 'Classic Aviators - Gold', sku: 'AV-GLD-001', price: 129.99, stock_quantity: 50, 
    category_name: 'Sunglasses', category_slug: 'sunglasses', isVisible: true, description: 'Timeless style.',
    requires_prescription: false, 
  },
  { 
    id: 'prod3', name: 'Blue Light Blocking Glasses - Tortoise Shell', sku: 'BLB-TOR-001', price: 75.00, stock_quantity: 120,
    category_name: 'Prescription Glasses', category_slug: 'prescription-glasses', isVisible: true, description: 'Comfort for screen time.',
    requires_prescription: true, accepted_prescription_types: "eyeglass_single_vision,eyeglass_progressive",
  },
  { 
    id: 'prod_contact1', name: 'Daily Disposable Contacts (30 pack)', sku: 'CON-DLY-30', price: 45.00, stock_quantity: 200,
    category_name: 'Contact Lenses', category_slug: 'contact-lenses', isVisible: true, description: 'Convenient daily wear.',
    requires_prescription: true, accepted_prescription_types: "contact_lens_spherical",
  },
];

export const mockAdminCategories: AdminCategory[] = [
    { id: 'cat_sunglasses', name: 'Sunglasses', slug: 'sunglasses', productCount: 10, description: 'Fashionable and protective sunglasses.' },
    { id: 'cat_rxglasses', name: 'Prescription Glasses', slug: 'prescription-glasses', productCount: 25, description: 'Frames for vision correction.' },
    { id: 'cat_contacts', name: 'Contact Lenses', slug: 'contact-lenses', productCount: 15, description: 'Various types of contact lenses.' },
    { id: 'cat_accessories', name: 'Accessories', slug: 'accessories', productCount: 30, description: 'Cases, cleaning kits, etc.' },
];

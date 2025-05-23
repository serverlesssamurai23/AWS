import { create } from 'zustand';
import { Product, ProductVariant, UserPrescription, UserPrescriptionCreationData } from '@/services/api'; // Adjust path

// Define the structure for prescription details attached to a cart item
export interface CartPrescriptionDetails {
  type: 'manual' | 'saved' | 'upload';
  data?: Partial<UserPrescriptionCreationData> | UserPrescription; // For manual or saved
  url?: string; // For upload
  // Potentially add a unique ID generated on the client for manual prescriptions not yet saved
  // to distinguish them if multiple manual Rxs are added for different items.
  tempId?: string; 
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant | null; // A product might not have variants
  quantity: number;
  prescriptionDetails?: CartPrescriptionDetails | null;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number, prescriptionDetails?: CartPrescriptionDetails | null) => void;
  removeItem: (productId: string, variantId?: string | null, prescriptionTempId?: string | null) => void;
  updateQuantity: (productId: string, variantId?: string | null, newQuantity: number, prescriptionTempId?: string | null) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

// Helper to create a unique ID for cart entries, especially for items with different prescriptions
const generateCartItemId = (productId: string, variantId?: string | null, prescription?: CartPrescriptionDetails | null): string => {
  let id = productId;
  if (variantId) {
    id += `-${variantId}`;
  }
  // If prescription makes the item unique (e.g. two same frames with different manual Rxs)
  if (prescription?.type === 'manual' && prescription.tempId) {
    id += `-rx-${prescription.tempId}`;
  } else if (prescription?.type === 'saved' && (prescription.data as UserPrescription)?.id) {
    id += `-rx-${(prescription.data as UserPrescription).id}`;
  } else if (prescription?.type === 'upload' && prescription.url) {
    // This might not be unique enough if URL isn't perfectly unique
    id += `-rxupload-${encodeURIComponent(prescription.url).substring(0,10)}`;
  }
  return id;
};


export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, variant = null, quantity = 1, prescriptionDetails = null) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          (variant ? item.variant?.id === variant.id : !item.variant) &&
          // More complex check if same product/variant can be added multiple times with different prescriptions
          // For now, assume one entry per product/variant, or prescriptions make them unique if IDs are handled.
          // This simple check will increment quantity if product/variant matches.
          // A more robust solution would involve generating a unique cart item ID based on product, variant, AND prescription.
          JSON.stringify(item.prescriptionDetails) === JSON.stringify(prescriptionDetails) // Basic check
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // If it's a manual prescription without a saved ID, generate a temporary client-side ID for uniqueness
        let currentPrescriptionDetails = prescriptionDetails;
        if (prescriptionDetails?.type === 'manual' && !prescriptionDetails.tempId) {
            currentPrescriptionDetails = { ...prescriptionDetails, tempId: Date.now().toString() };
        }
        newItems = [...state.items, { product, variant, quantity, prescriptionDetails: currentPrescriptionDetails }];
      }
      return { items: newItems };
    });
  },
  removeItem: (productId, variantId = null, prescriptionTempId = null) => {
    set((state) => ({
      items: state.items.filter(item => 
        !(item.product.id === productId && 
          (variantId ? item.variant?.id === variantId : !item.variant) &&
          (prescriptionTempId && item.prescriptionDetails?.type === 'manual' ? item.prescriptionDetails.tempId === prescriptionTempId : true)
         )
      )
    }));
  },
  updateQuantity: (productId, variantId = null, newQuantity, prescriptionTempId = null) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (
          item.product.id === productId &&
          (variantId ? item.variant?.id === variantId : !item.variant) &&
          (prescriptionTempId && item.prescriptionDetails?.type === 'manual' ? item.prescriptionDetails.tempId === prescriptionTempId : true)
        ) {
          return { ...item, quantity: Math.max(0, newQuantity) }; // Prevent negative quantity
        }
        return item;
      }).filter(item => item.quantity > 0) // Remove item if quantity becomes 0
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  getSubtotal: () => {
    return get().items.reduce((subtotal, item) => {
      const itemPrice = item.variant ? (item.product.price + (item.variant.price_modifier || 0)) : item.product.price;
      return subtotal + itemPrice * item.quantity;
    }, 0);
  },
}));

// Optional: Persist cart to localStorage ( Zustand middleware )
// import { persist, createJSONStorage } from 'zustand/middleware'
// export const useCartStore = create(
//   persist<CartState>(
//     (set, get) => ({
//        // ... (rest of your store implementation)
//     }),
//     {
//       name: 'cart-storage', // name of the item in the storage (must be unique)
//       storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
//     }
//   )
// )

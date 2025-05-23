'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Added useRouter
import Image from 'next/image';
import Link from 'next/link';
import { getProductById, Product, ProductVariant as ApiProductVariant, UserPrescription, getMyPrescriptions, UserPrescriptionCreationData } from '@/services/api'; // Renamed ProductVariant to ApiProductVariant to avoid conflict
import PrescriptionForm from '@/components/prescriptions/PrescriptionForm';
import { useCartStore, CartPrescriptionDetails } from '@/store/cartStore'; // Import cart store and types

// Rename imported ProductVariant to avoid conflict with local type if any, or ensure consistency
type ProductVariant = ApiProductVariant;


const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter(); // For navigation
  const id = params.id as string;

  const addItemToCart = useCartStore(state => state.addItem); // Get addItem action from cart store

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1); // Add quantity state

  // Prescription state
  const [prescriptionMode, setPrescriptionMode] = useState<'manual' | 'saved' | 'upload' | null>(null);
  const [manualPrescriptionData, setManualPrescriptionData] = useState<Partial<UserPrescriptionCreationData>>({});
  const [savedPrescriptions, setSavedPrescriptions] = useState<UserPrescription[]>([]);
  const [selectedSavedPrescriptionId, setSelectedSavedPrescriptionId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('authToken'));
    }

    if (id) {
      const fetchProductDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getProductById(id);
          setProduct(data);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
          if (data.requires_prescription && !prescriptionMode) { // Set default mode only if not already set
            setPrescriptionMode('manual'); 
          }
        } catch (err: any) {
          setError(err.message || `Failed to fetch product with ID: ${id}.`);
        } finally {
          setLoading(false);
        }
      };
      fetchProductDetails();
    }
  }, [id, prescriptionMode]); // Added prescriptionMode to dependency array if it influences initial loading logic

  useEffect(() => {
    if (isLoggedIn && product?.requires_prescription) {
      const fetchSavedPrescriptions = async () => {
        try {
          const data = await getMyPrescriptions();
          setSavedPrescriptions(data);
        } catch (err) {
          console.error("Failed to fetch saved prescriptions:", err);
        }
      };
      fetchSavedPrescriptions();
    }
  }, [isLoggedIn, product?.requires_prescription]);


  const handleAddToCart = () => {
    if (!product) return;

    let prescriptionDetailsForCart: CartPrescriptionDetails | null = null;

    if (product.requires_prescription) {
      if (prescriptionMode === 'manual') {
        // Basic validation for manual prescription before proceeding
        if (!manualPrescriptionData.patient_name || manualPrescriptionData.sphere_left === undefined || manualPrescriptionData.sphere_right === undefined ) {
            alert("Please fill in all required prescription fields (Patient Name, SPH for both eyes) in the form below.");
            // Optionally, focus on the form or the first invalid field.
            return;
        }
        prescriptionDetailsForCart = { type: 'manual', data: manualPrescriptionData };
      } else if (prescriptionMode === 'saved') {
        if (!selectedSavedPrescriptionId) {
            alert("Please select a saved prescription.");
            return;
        }
        const selectedRx = savedPrescriptions.find(rx => rx.id === selectedSavedPrescriptionId);
        if (!selectedRx) {
            alert("Selected saved prescription not found. Please try again.");
            return;
        }
        prescriptionDetailsForCart = { type: 'saved', data: selectedRx };
      } else if (prescriptionMode === 'upload') {
        const uploadUrlInput = document.getElementById('rx_upload_url') as HTMLInputElement;
        const uploadUrl = uploadUrlInput?.value;
        if (!uploadUrl || !uploadUrl.trim()) { // Check if URL is empty or just whitespace
            alert("Please provide a URL for your uploaded prescription.");
            uploadUrlInput?.focus();
            return;
        }
         try {
            new URL(uploadUrl); // Validate if it's a proper URL
        } catch (_) {
            alert("Please enter a valid URL for your prescription.");
            uploadUrlInput?.focus();
            return;
        }
        prescriptionDetailsForCart = { type: 'upload', url: uploadUrl };
      } else {
        // This case should ideally not be reached if a default prescriptionMode is set.
        alert("Please select or enter your prescription information.");
        return;
      }
    }

    addItemToCart(product, selectedVariant, quantity, prescriptionDetailsForCart);
    alert(`${product.name} (Quantity: ${quantity}) added to cart!`);
    // Optionally, redirect to cart page or show a more subtle notification (toast)
    // router.push('/cart'); 
  };
  
  // This function is used as a callback for the PrescriptionForm
  // to update the PDP's state when the form data changes or is "confirmed"
  // without necessarily saving to backend from the form itself.
  const handleManualPrescriptionFormConfirm = (dataFromForm: UserPrescriptionCreationData) => {
    console.log("PrescriptionForm data confirmed on PDP:", dataFromForm);
    setManualPrescriptionData(dataFromForm); 
    // Provide feedback to the user that the data is captured and they can proceed to add to cart.
    // This could be a state update that shows a message like "Prescription details ready."
    alert("Manual prescription data captured and ready for cart.");
  };


  if (loading) return <p className="text-center py-10">Loading product details...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  if (!product) return <p className="text-center py-10">Product not found.</p>;

  const placeholderImage = "/images/placeholder.png";

  return (
    <div className="container mx-auto p-4">
      <div className="md:flex md:gap-8">
        <div className="md:w-1/2 mb-4 md:mb-0">
          <Image
            src={selectedVariant?.image_url || product.main_image_url || placeholderImage}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg shadow-lg object-cover w-full"
            priority
          />
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          {product.category_name && (
            <Link href={`/categories/${product.category_slug}`} className="text-sm text-blue-500 hover:underline mb-2 block">
              {product.category_name}
            </Link>
          )}
          <p className="text-2xl font-semibold text-blue-600 mb-4">${selectedVariant ? (product.price + (selectedVariant.price_modifier || 0)).toFixed(2) : product.price.toFixed(2)}</p>
          <p className="text-gray-700 mb-4 whitespace-pre-line">{product.description}</p>
          
          {product.variants && product.variants.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-1">Select {product.variants[0].attributes?.color ? 'Color' : (product.variants[0].attributes?.size ? 'Size' : 'Option')}:</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-3 py-1 border rounded-md text-sm ${selectedVariant?.id === variant.id ? 'bg-blue-500 text-white border-blue-500' : 'bg-white hover:border-gray-400'}`}
                  >
                    {variant.name} {variant.price_modifier ? ` (${variant.price_modifier > 0 ? '+' : ''}$${variant.price_modifier.toFixed(2)})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

            <div className="mb-4">
                <label htmlFor="quantity" className="text-md font-semibold mr-2">Quantity:</label>
                <input 
                    type="number" 
                    id="quantity" 
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value,10) || 1))}
                    min="1"
                    className="w-20 p-2 border border-gray-300 rounded-md text-center"
                />
            </div>

          <p className={`text-sm mb-4 ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
            {selectedVariant && ` for ${selectedVariant.name}`}
          </p>

          {product.requires_prescription && (
            <div className="my-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h2 className="text-xl font-semibold mb-3 text-blue-700">Prescription Required</h2>
              <div className="flex border-b border-blue-200 mb-3">
                <button onClick={() => setPrescriptionMode('manual')} className={`px-4 py-2 -mb-px border-b-2 ${prescriptionMode === 'manual' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Enter Manually</button>
                {isLoggedIn && <button onClick={() => setPrescriptionMode('saved')} className={`px-4 py-2 -mb-px border-b-2 ${prescriptionMode === 'saved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Use Saved</button>}
                <button onClick={() => setPrescriptionMode('upload')} className={`px-4 py-2 -mb-px border-b-2 ${prescriptionMode === 'upload' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Upload File</button>
              </div>

              {prescriptionMode === 'manual' && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Enter Your Prescription Details:</h3>
                  <PrescriptionForm 
                    // The PrescriptionForm's own "save" button should trigger this callback.
                    // This "onSave" on PrescriptionForm is meant to be its internal submit handler's success action.
                    // It is NOT directly tied to a button on THIS PDP page.
                    onSave={handleManualPrescriptionFormConfirm} 
                  />
                  {/* Removed the redundant "Confirm Manual Prescription" button from PDP, 
                      as PrescriptionForm should handle its own submission via its internal button,
                      which then calls handleManualPrescriptionFormConfirm.
                      The user should click "Add to Cart" after the form signals data is ready (e.g. via an alert from onSave).
                  */}
                </div>
              )}

              {prescriptionMode === 'saved' && isLoggedIn && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Select a Saved Prescription:</h3>
                  {savedPrescriptions.length > 0 ? (
                    <select 
                        value={selectedSavedPrescriptionId || ''} 
                        onChange={(e) => setSelectedSavedPrescriptionId(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">-- Select a prescription --</option>
                      {savedPrescriptions.map(rx => (
                        <option key={rx.id} value={rx.id}>
                          {rx.prescription_name || `For ${rx.patient_name} (${new Date(rx.prescription_date).toLocaleDateString()})`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-600">You have no saved prescriptions. <Link href="/account/prescriptions/add" className="text-blue-500 hover:underline">Add one now?</Link></p>
                  )}
                </div>
              )}
              
              {prescriptionMode === 'upload' && (
                 <div>
                  <h3 className="text-lg font-medium mb-2">Provide Link to Your Prescription File:</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    File upload functionality is not yet implemented. 
                    If you have uploaded your prescription elsewhere, please paste the link below.
                  </p>
                  <label htmlFor="rx_upload_url" className="block text-sm font-medium text-gray-700">Link to your Prescription File*</label>
                  <input 
                    type="url" 
                    id="rx_upload_url" 
                    name="rx_upload_url"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                    placeholder="https://example.com/path/to/your/rx.pdf"
                  />
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0 || loading}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <div className="mt-4 text-sm text-gray-500">
            <p>SKU: {selectedVariant?.sku_suffix ? `${product.sku}-${selectedVariant.sku_suffix}` : product.sku}</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-3">Product Information</h2>
        <div className="prose max-w-none">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

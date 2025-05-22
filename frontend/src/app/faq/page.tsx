import React from 'react';

const FAQPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. How do I order prescription glasses?</h2>
          <p>
            Ordering is easy! First, choose your desired frames. Then, on the product page, you'll be prompted 
            to enter your prescription details or upload a copy of your prescription. You can also select 
            your preferred lens types and coatings. Our team will verify your prescription before processing your order.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">2. What if my prescription changes?</h2>
          <p>
            We recommend getting your eyes checked regularly. If your prescription changes, you'll need to 
            place a new order with your updated prescription. You can save multiple prescriptions in your account 
            for easy access.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">3. What is your return policy?</h2>
          <p>
            We offer a 30-day hassle-free return policy for most items in their original condition. 
            Custom prescription lenses may have specific return conditions. Please visit our "Shipping & Returns" 
            page for full details.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">4. How long does shipping take?</h2>
          <p>
            Shipping times vary based on your location and the complexity of your order (e.g., prescription lenses). 
            Standard shipping typically takes 5-7 business days, while orders with prescription lenses may take 7-14 business days. 
            You'll receive a tracking number once your order ships.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

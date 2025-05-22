# UX Wireframes & User Flows

## 1. Homepage

**Objective:** Welcome users, establish brand trust, highlight key product categories, showcase promotions, and guide users towards shopping or learning.

**Key Elements:**

*   **Navigation Bar (Top):**
    *   Logo (links to Homepage)
    *   Links: Prescription Glasses, Contact Lenses, Sunglasses, Accessories, Eye Health Education
    *   Search Bar
    *   User Account Icon (Login/Register, My Account)
    *   Shopping Cart Icon (with item count)
*   **Hero Section:**
    *   Compelling headline (e.g., "Clearly See Your World," "Your Vision, Our Priority")
    *   High-quality lifestyle image or short video showcasing products/brand.
    *   Primary Call-to-Action (CTA) button (e.g., "Shop Glasses," "Explore Collections").
*   **Trust Bar (Below Hero):**
    *   Icons and short text highlighting key trust signals (e.g., "Free Shipping on orders over $X," "Hassle-Free Returns," "Expert Optician Support," "Secure Payments").
*   **Featured Categories Section:**
    *   Visually distinct cards or sections for:
        *   Prescription Glasses (with CTA like "Shop Men's," "Shop Women's," "View All")
        *   Contact Lenses (with CTA like "Shop by Brand," "Shop by Type")
        *   Sunglasses (with CTA like "Shop Best Sellers," "Explore New Arrivals")
    *   High-quality images for each category.
*   **"How It Works" / Prescription Upload Section (if applicable):**
    *   Brief explanation of how to order prescription eyewear (e.g., "1. Choose Your Frames," "2. Add Your Prescription," "3. We Deliver").
    *   CTA to "Upload Prescription" or "Learn More About Prescriptions."
*   **Promotional Banner/Special Offers Section:**
    *   Area to highlight current sales, new arrivals, or special collections.
    *   Clear visuals and CTAs.
*   **Educational Snippet Section:**
    *   Teaser for the Eye Health Education section.
    *   Link to a featured article or the main education page (e.g., "Learn About Blue Light," "Tips for Healthy Eyes").
    *   Visually engaging, perhaps with an icon or illustration.
*   **Shop by Brand (Optional):**
    *   Carousel or grid of popular brand logos.
*   **Testimonials/Social Proof:**
    *   Short quotes from happy customers.
    *   Could be a rotating carousel.
*   **Footer:**
    *   Links: About Us, Contact, FAQ, Shipping & Returns, Privacy Policy, Terms of Service, Accessibility Statement.
    *   Social Media Icons.
    *   Newsletter Signup.
    *   Copyright information.

**User Flow Considerations:**

*   Clear visual hierarchy guiding the user's eye.
*   Easy access to primary shopping categories.
*   Prominent CTAs for key actions.
*   Trust signals visible early.
*   Accessibility: Good color contrast, legible fonts, keyboard navigable elements.

---
## 2. Product Listing Page (PLP)

**Objective:** Allow users to easily browse, filter, and sort products within a selected category. Display key product information concisely.

**Key Elements:**

*   **Header/Breadcrumbs:**
    *   Show the current category (e.g., "Home > Prescription Glasses > Men's").
    *   Category title (e.g., "Men's Prescription Glasses").
    *   Optional: Brief category description or banner image.
*   **Sidebar (or Top Filter Bar on Mobile):**
    *   **Filters:**
        *   **Common Filters (for all product types):**
            *   Price Range (Slider or input fields)
            *   Brand
            *   Customer Rating
            *   Color
            *   Frame Size (e.g., Small, Medium, Large - for glasses/sunglasses)
            *   Availability (In Stock)
        *   **Specific Filters for Glasses/Sunglasses:**
            *   Frame Shape (e.g., Round, Square, Aviator)
            *   Frame Material (e.g., Metal, Acetate, Titanium)
            *   Frame Type (e.g., Full-rim, Semi-rimless, Rimless)
            *   Features (e.g., Lightweight, Hypoallergenic)
        *   **Specific Filters for Contact Lenses:**
            *   Lens Type (e.g., Daily, Weekly, Monthly disposables, Toric for Astigmatism, Multifocal)
            *   Manufacturer/Brand
            *   Power/Prescription Range (if feasible to filter by, otherwise on PDP)
            *   Pack Size
        *   **Specific Filters for Accessories:**
            *   Accessory Type (e.g., Cases, Cleaning Cloths, Lens Solutions)
    *   **"Apply Filters" / "Clear All Filters" buttons.**
*   **Main Product Grid/List Area:**
    *   **Sort Options (Dropdown):**
        *   Popularity / Best Sellers
        *   New Arrivals
        *   Price: Low to High
        *   Price: High to Low
        *   Customer Rating
        *   Alphabetical (A-Z, Z-A)
    *   **Product Card (for each product):**
        *   Product Image (High quality, multiple angles on hover/click if possible)
        *   Product Name/Brand
        *   Price (and "Sale Price" if applicable)
        *   Key info snippet (e.g., "Bestseller," "New," colors available)
        *   Customer Rating (e.g., star icons)
        *   "Quick View" button (optional, opens a modal with PDP summary)
        *   "Add to Cart" button (for non-prescription items or items with saved prescription) OR "View Details" / "Choose Lenses" CTA.
*   **Pagination:**
    *   Numbered pages or "Load More" button.
*   **Items Per Page Selector (Optional):**
    *   Allow users to choose how many products to display per page (e.g., 24, 48, 96).

**User Flow Considerations:**

*   Filters should be easy to understand and apply.
*   Applied filters should be clearly visible and removable.
*   Product cards must be scannable, providing essential information at a glance.
*   High-quality imagery is crucial.
*   Responsive design: Sidebar filters might collapse into an off-canvas menu or a horizontal filter bar on smaller screens.
*   Loading states for when filters are applied or sorting changes.
*   Accessibility: Ensure all filter options and product information are accessible via keyboard and screen readers.

---
## 3. Product Detail Page (PDP)

**Objective:** Provide comprehensive information about a specific product, allow for customization (especially for prescription lenses), build trust, and encourage users to add the product to their cart.

**Key Elements:**

*   **Breadcrumbs:**
    *   e.g., "Home > Prescription Glasses > Men's > [Product Name]"
*   **Product Images & Video:**
    *   Large main image.
    *   Thumbnail gallery of multiple angles, model shots, and potentially a short product video.
    *   Zoom functionality on images.
    *   Virtual Try-On (VTO) placeholder/integration point (if planned as a feature).
*   **Product Information Area:**
    *   **Product Name/Title**
    *   **Brand Logo/Link**
    *   **Customer Rating (Stars & Number of Reviews)**
    *   **Price** (clearly displayed, showing original vs. sale price if applicable).
    *   **Short Description/Tagline**
    *   **Availability Status** (e.g., "In Stock," "Ships in X days," "Out of Stock").
    *   **Color/Variant Swatches** (if applicable, clicking updates the main image).
    *   **Size Selector** (e.g., frame size for glasses/sunglasses, pack size for contacts).
*   **Prescription Configuration Section (for prescription eyewear):**
    *   **"Usage" Selector:** (e.g., Distance, Reading, Progressive, Non-Prescription/Fashion)
    *   **Prescription Entry Options:**
        *   "Upload a new prescription" (file upload).
        *   "Enter manually" (form with fields for SPH, CYL, AXIS, ADD, PD for both eyes).
            *   Clear labels, tooltips explaining each term (e.g., linking to an educational guide).
            *   Option to save prescription to account.
        *   "Use saved prescription" (if logged in and has prescriptions on file).
        *   "Send prescription later" (with clear instructions on how/when).
    *   **Lens Options Selection:**
        *   **Lens Type:** (e.g., Standard, Thin & Light, Ultra-Thin) - with explanations and price differences.
        *   **Lens Coatings/Treatments:** (e.g., Anti-reflective, Scratch-resistant, Blue Light Filtering, Photochromic/Transitions, Polarized for sunglasses) - with explanations, benefits, and price differences (checkboxes or selection cards).
    *   **Summary of Choices & Total Price** (dynamically updates as options are selected).
*   **"Add to Cart" Button:**
    *   Prominent and clear.
    *   Quantity selector (usually "1" for glasses, but might be more for contacts/accessories).
*   **"Add to Wishlist" / "Save for Later" Button.**
*   **Product Details Tabs/Accordion:**
    *   **Full Description:** Detailed product features, materials, benefits.
    *   **Specifications:** Dimensions (frame width, lens width, bridge size, temple length for glasses), material details, lens material, base curve/diameter (for contacts), etc.
    *   **Shipping & Returns Information:** Link to policy or concise summary.
    *   **Reviews & Q&A:** Customer reviews and a section for questions and answers.
*   **"Complete the Look" / Related Products Section:**
    *   Showcases accessories (e.g., cases, cleaning kits for glasses) or similar styles.
*   **Recently Viewed Products Section.**

**User Flow Considerations:**

*   **Clarity in Prescription Process:** This is the most complex part. It must be intuitive, error-tolerant, and provide help/guidance at each step.
*   **Dynamic Updates:** Price and selection summaries should update in real-time as users make choices.
*   **Visual Hierarchy:** Guide the user from images to core info, then to configuration, and finally to CTA.
*   **Trust & Credibility:** High-quality images, detailed information, and easy access to support or FAQs are vital.
*   **Mobile Responsiveness:** Configuration options must be easy to select on smaller screens.
*   **Accessibility:** All form fields, options, and information must be accessible. Ensure good contrast for text and interactive elements.

---
## 4. Shopping Cart Page

**Objective:** Allow users to review selected products, modify quantities, remove items, see a summary of costs (including estimated shipping), and proceed to checkout.

**Key Elements:**

*   **Page Title:** "Shopping Cart" or "Your Bag"
*   **Product List Area:**
    *   For each item:
        *   Product Thumbnail Image
        *   Product Name (linked back to PDP)
        *   Variant details (e.g., Color, Size)
        *   Prescription Summary (if applicable, concise view, e.g., "Right Eye: -2.00 SPH", "Lens Type: Thin & Light") - with an "Edit Options" link if feasible to return to PDP for changes.
        *   Unit Price
        *   Quantity Selector (input field or +/- buttons)
        *   "Remove" Item button/icon
        *   Line Item Total Price
*   **Order Summary Section:**
    *   **Subtotal:** Sum of all item prices.
    *   **Estimated Shipping:**
        *   Option to enter Zip Code/Country to get shipping estimates.
        *   Link to shipping policy.
    *   **Discounts/Promo Code:**
        *   Input field for promo code.
        *   "Apply" button.
        *   Display applied discounts.
    *   **Order Total (Estimated):** Clearly displayed.
*   **Call-to-Action Buttons:**
    *   **"Proceed to Checkout" Button (Primary):** Prominently displayed.
    *   **"Continue Shopping" Link/Button (Secondary):**
*   **Trust Signals/Information:**
    *   Icons/text for secure checkout.
    *   Accepted payment methods (logos like Visa, Mastercard, PayPal).
    *   Link to return policy or customer support.
*   **"Saved for Later" / Wishlist Items (Optional):**
    *   A section displaying items previously saved from cart, with an option to move them back to the cart.

**User Flow Considerations:**

*   **Clarity:** All costs should be clearly itemized.
*   **Ease of Modification:** Users should be able to easily update quantities or remove items. Changes should reflect immediately in the order summary.
*   **No Dead Ends:** Provide clear paths to either checkout or continue shopping.
*   **Prescription Details:** For eyewear, a summary of the prescription associated with each item is crucial for user confidence. Editing should ideally take them back to the PDP with their selections pre-filled for modification.
*   **Mobile Responsiveness:** Ensure the layout is clean and usable on mobile, with easy-to-tap buttons and selectors.
*   **Accessibility:** All interactive elements (buttons, quantity adjusters, links) must be keyboard accessible and have proper labels for screen readers.

---
## 5. Checkout Process

**Objective:** Guide the user smoothly through providing shipping information, delivery method, payment details, and final order review to complete their purchase.

**General Elements Across Checkout Steps:**

*   **Checkout Header:** Consistent branding, "Secure Checkout" reassurance.
*   **Progress Indicator:** Shows current step and remaining steps (e.g., "1. Shipping > 2. Payment > 3. Review").
*   **Order Summary (Collapsed/Sidebar):** Shows items, subtotal, and running total. Allows users to see what they're buying without leaving checkout.
*   **Link to Cart / "Return to Cart"**
*   **Customer Support Link/Info**

**Step 1: Shipping Information (& Login/Guest Checkout)**

*   **User Authentication:**
    *   If not logged in: Prompt to "Login" (for returning customers) or "Continue as Guest" / "Register".
    *   Option to create an account after guest checkout.
*   **Shipping Address Form:**
    *   Full Name
    *   Address Line 1, Address Line 2 (Optional)
    *   Country (Dropdown)
    *   State/Province (Dropdown, dependent on Country)
    *   City
    *   Zip/Postal Code
    *   Phone Number (for delivery updates)
    *   Email Address (for order confirmation, especially if guest)
*   **"Use as Billing Address" Checkbox** (checked by default).
*   **Shipping Method Selection:**
    *   List available shipping methods (e.g., Standard Shipping, Express Shipping) with estimated delivery times and costs.
    *   Selected method updates the Order Summary.
*   **CTA Button:** "Continue to Payment" or "Save & Continue".

**Step 2: Billing Information & Payment**

*   **Billing Address:**
    *   If "Use as Billing Address" was unchecked, display billing address form (same fields as shipping).
    *   If checked, display the shipping address as the billing address (non-editable here, or link to change it in shipping step).
*   **Payment Method Selection:**
    *   Tabs or radio buttons for:
        *   **Credit/Debit Card:**
            *   Card Number
            *   Cardholder Name
            *   Expiry Date (MM/YY)
            *   CVV/CVC
            *   Save card option for registered users (with security considerations).
        *   **PayPal / Other Payment Gateways (e.g., Apple Pay, Google Pay):**
            *   Buttons that redirect to the respective payment provider or open their modal.
*   **Promo Code / Gift Card (Optional):**
    *   Another chance to enter a promo code if missed in the cart.
*   **CTA Button:** "Review Your Order" or "Continue to Review".

**Step 3: Order Review & Placement**

*   **Review All Information:**
    *   Shipping Address (with "Edit" link)
    *   Billing Address (with "Edit" link)
    *   Shipping Method (with "Edit" link)
    *   Payment Method (e.g., "Visa ending in XXXX", with "Edit" link)
    *   **Detailed Item List:** Product images, names, quantities, prices, prescription summaries.
*   **Final Order Summary:**
    *   Subtotal
    *   Shipping Cost
    *   Taxes (if applicable, clearly stated)
    *   Discounts
    *   **Order Total (Bold and Clear)**
*   **Terms & Conditions Checkbox:**
    *   "I agree to the Terms & Conditions and Privacy Policy" (links to relevant pages).
*   **Newsletter Signup Checkbox (Optional):**
*   **CTA Button (Primary):** "Place Order" or "Complete Purchase".

**Step 4: Order Confirmation / Thank You Page**

*   **Confirmation Message:** "Thank You! Your order has been placed."
*   **Order Number:** Prominently displayed.
*   **Order Summary:** Key details of the order.
*   **"An email confirmation has been sent to [user's email]."**
*   **Estimated Delivery Date/Window.**
*   **Next Steps (Optional):** (e.g., "Track your order," "Create an account to manage your orders easily").
*   **Links:** "Continue Shopping," "Go to My Account."

**User Flow Considerations:**

*   **Minimize Distractions:** Keep the checkout process focused. Avoid unnecessary navigation or pop-ups.
*   **Clear Error Handling:** Inline validation for form fields (e.g., "Please enter a valid email address"). Clear messages if payment fails.
*   **Security & Trust:** Display security badges (SSL), reassure users about payment security.
*   **Guest Checkout:** Essential for users who don't want to create an account, but offer account creation post-purchase.
*   **Address Autofill/Lookup:** Consider integrating services like Google Places API for easier address entry.
*   **Mobile-First Design:** Ensure forms and payment options are easy to use on mobile.
*   **Accessibility:** All form fields, labels, buttons, and summary information must be accessible. Progress indicators should be announced by screen readers.

---
## 6. User Account Pages

**Objective:** Allow registered users to manage their profile, view order history, track shipments, manage saved prescriptions, and update communication preferences.

**Common Elements for Account Pages:**

*   **Account Navigation Sidebar/Tabs:**
    *   Dashboard
    *   Order History
    *   My Prescriptions
    *   Profile Details / Personal Information
    *   Saved Addresses
    *   Payment Methods (Optional, if saving cards)
    *   Communication Preferences
    *   Logout
*   **Main Content Area:** Displays the content for the selected navigation item.

**A. Account Dashboard**

*   **Welcome Message:** "Hello, [User Name]!"
*   **Overview/Summary:**
    *   Recent Orders (e.g., last 1-3 orders with status and link to details).
    *   Quick link to "Track Package" for active orders.
    *   Number of Saved Prescriptions (with link to "My Prescriptions").
    *   Link to "Edit Profile" or "Manage Addresses."
*   **Recommended Products or Promotions (Optional):** Personalized based on purchase history.

**B. Order History**

*   **List of Past Orders:**
    *   Each order item should display:
        *   Order Number (clickable to Order Details page)
        *   Order Date
        *   Order Status (e.g., Processing, Shipped, Delivered, Cancelled, Returned)
        *   Total Amount
        *   "View Details" button
        *   "Track Shipment" button (if shipped)
        *   "Reorder" button (optional, adds items from that order to cart)
        *   "Request Return/Exchange" button (if applicable within policy)
*   **Filtering/Sorting Options (Optional for long lists):**
    *   Filter by status, date range.
*   **Order Details Page (when an order is selected):**
    *   All information from the Order Confirmation page.
    *   Shipping Address, Billing Address, Payment Method used.
    *   Product list with images, names, quantities, prices, prescription details.
    *   Shipment tracking history/link.
    *   Links to "Print Invoice," "Request Return," etc.

**C. My Prescriptions**

*   **Section for Eyeglass Prescriptions:**
    *   List of saved eyeglass prescriptions.
    *   Each entry to show:
        *   Patient Name (or a nickname for the prescription, e.g., "My Distance Glasses")
        *   Prescription Date / Expiry Date (if provided)
        *   Key values (e.g., SPH, CYL, AXIS for OD/OS) - can be partially masked or summarized.
        *   "View Details" button (shows full prescription details in a modal or separate view).
        *   "Edit" button (to update details).
        *   "Delete" button.
        *   "Shop with this Prescription" button (takes user to PLP with this prescription pre-selected or easily selectable).
    *   **"Add New Eyeglass Prescription" Button:** Opens a form similar to the PDP manual entry.
*   **Section for Contact Lens Prescriptions (Potentially separate due to different parameters):**
    *   Similar listing and management features as eyeglass prescriptions but with fields for Power, Base Curve (BC), Diameter (DIA), Brand/Type, etc.
    *   **"Add New Contact Lens Prescription" Button.**
*   **Information/Disclaimer:** Reminders to use valid, current prescriptions.

**D. Profile Details / Personal Information**

*   **Form to Edit:**
    *   First Name
    *   Last Name
    *   Email Address (may require verification if changed)
    *   Change Password (current password, new password, confirm new password)
*   **"Save Changes" Button.**

**E. Saved Addresses**

*   **List of Saved Shipping Addresses:**
    *   Each address displayed clearly.
    *   "Edit" and "Delete" buttons for each.
    *   Option to set a "Default Shipping Address."
*   **"Add New Address" Button/Form.**
*   **(Optional) Saved Billing Addresses:** If different from shipping, managed similarly.

**F. Payment Methods (If implemented)**

*   **List of Saved Credit/Debit Cards (Last 4 digits only):**
    *   Card Type (Visa, MC)
    *   Expiry Date
    *   "Delete" button.
    *   Option to set a "Default Payment Method."
*   **"Add New Payment Method" Button.**
*   **Security Note:** Emphasize that full card details are not stored locally but with the secure payment processor.

**G. Communication Preferences**

*   **Checkboxes for:**
    *   Promotional Emails / Newsletter
    *   Order Updates (Email, SMS - if SMS is implemented)
    *   Prescription Expiry Reminders (if applicable)
*   **"Save Preferences" Button.**

**User Flow Considerations:**

*   **Clear Navigation:** Easy to find different account sections.
*   **Data Security:** Reassure users about the security of their personal and prescription data.
*   **Easy Editing:** Simple forms and clear buttons for managing information.
*   **Helpful Reminders:** e.g., for prescription expiry.
*   **Accessibility:** All forms, tables, and interactive elements must be accessible.

---
## 7. Educational Content Pages

**Objective:** Provide valuable information about eye health, eyewear, and vision care to build trust, engage users, and improve SEO.

**Two Main Types of Educational Pages:**

*   **A. Main Educational Hub/Landing Page**
*   **B. Individual Article/Guide Page**

**A. Educational Hub/Landing Page**

*   **Page Title:** e.g., "Eye Health & Education," "Vision Care Resources"
*   **Introduction:** Brief overview of the topics covered and the brand's commitment to eye health.
*   **Search Functionality (within Education section):** Allow users to search for specific topics.
*   **Categorized Content Listings:**
    *   Articles/guides grouped by relevant categories (e.g., "Understanding Prescriptions," "Choosing Your Glasses," "Contact Lens Care," "Common Eye Conditions," "Children's Vision," "Digital Eye Strain").
    *   Each category could be a card or section with a title and brief description.
    *   Clicking a category leads to a filtered list of articles within that category.
*   **Featured Articles/Guides:**
    *   Highlight new, popular, or seasonally relevant content.
    *   Displayed with a thumbnail image, title, and short snippet.
*   **Visuals:** Engaging banners, icons, or illustrations related to eye care.
*   **Call to Action (Optional):**
    *   e.g., "Ask an Optician" (if there's a Q&A feature or contact form for experts).
    *   "Shop Related Products" (if an article discusses a specific product type).

**B. Individual Article/Guide Page**

*   **Article Title:** Clear and descriptive.
*   **Author & Publication/Update Date:** Builds credibility.
*   **Breadcrumbs:** e.g., "Home > Education > Understanding Prescriptions > How to Read Your Eyeglass Prescription"
*   **Table of Contents (for longer articles):** Allows easy navigation within the article.
*   **Main Content Area:**
    *   Well-structured text: Headings (H2, H3), paragraphs, lists, blockquotes.
    *   Incorporate images, diagrams, infographics, or videos where appropriate to explain concepts.
    *   Clear, easy-to-understand language, avoiding excessive jargon or explaining it well.
*   **Related Articles/Guides Sidebar or Section:** Suggest further reading.
*   **Social Sharing Buttons:** Allow users to share the content on social media.
*   **Sources/References (if applicable):** For medical or scientific information.
*   **Author Bio (Optional):** If articles are written by specific experts.
*   **Comments Section (Optional):** Allow user discussion and questions (requires moderation).
*   **Call to Action (Contextual):**
    *   e.g., If the article is about "Choosing Frame Materials," a CTA could be "Shop Lightweight Frames."
    *   Link to relevant product categories or specific products mentioned.

**User Flow Considerations:**

*   **Readability:** Use legible fonts, good line spacing, and sufficient contrast.
*   **Navigability:** Easy to find articles (search, categories) and navigate within articles (table of contents).
*   **Engagement:** Use visuals and clear writing to keep users interested.
*   **Credibility:** Clearly cite sources, show author expertise if possible.
*   **SEO:** Content should be optimized for relevant keywords.
*   **Accessibility:** Ensure content is accessible to users with disabilities (e.g., alt text for images, proper heading structure).

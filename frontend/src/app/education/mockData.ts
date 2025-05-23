export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Full content, can be markdown or HTML
  category: ArticleCategory;
  imageUrl?: string;
  author?: string;
  publishedDate: string; // YYYY-MM-DD
  isFeatured?: boolean;
}

export const mockArticleCategories: ArticleCategory[] = [
  { id: 'cat1', name: 'Understanding Your Eyes', slug: 'understanding-eyes', description: 'Learn about eye anatomy and common conditions.' },
  { id: 'cat2', name: 'Choosing Eyewear', slug: 'choosing-eyewear', description: 'Guides to selecting the perfect glasses and lenses.' },
  { id: 'cat3', name: 'Contact Lens Care', slug: 'contact-lens-care', description: 'Tips and best practices for contact lens wearers.' },
  { id: 'cat4', name: 'Digital Eye Strain', slug: 'digital-eye-strain', description: 'Protect your eyes in the digital age.' },
];

export const mockArticles: Article[] = [
  { 
    id: 'article1', title: 'How to Read Your Eyeglass Prescription', slug: 'how-to-read-prescription',
    summary: 'Demystify the terms and numbers on your eyeglass prescription. Understand what SPH, CYL, and AXIS mean for your vision.',
    content: "<p>Understanding your eyeglass prescription can seem daunting at first, but it's simpler than you think! Here’s a breakdown of common terms:</p><ul><li><strong>OD (Oculus Dexter):</strong> This refers to your right eye.</li><li><strong>OS (Oculus Sinister):</strong> This refers to your left eye.</li><li><strong>OU (Oculus Uterque):</strong> This means both eyes.</li><li><strong>Sphere (SPH):</strong> This indicates the amount of lens power, measured in diopters, prescribed to correct nearsightedness (-) or farsightedness (+).</li><li><strong>Cylinder (CYL):</strong> This indicates the amount of lens power for astigmatism. If this column is blank, it means you have little or no astigmatism that requires correction.</li><li><strong>Axis:</strong> Measured in degrees, this indicates the orientation of the astigmatism correction.</li><li><strong>Add:</strong> This is the added magnifying power applied to the bottom part of multifocal lenses to correct presbyopia (the need for reading glasses).</li><li><strong>PD (Pupillary Distance):</strong> The distance between the centers of your pupils, crucial for accurately crafting your lenses.</li></ul><p>Always consult your optometrist if you have questions about your specific prescription.</p>",
    category: mockArticleCategories[0], imageUrl: '/images/placeholder.png', author: 'Dr. Vision Well', publishedDate: '2023-05-15', isFeatured: true
  },
  { 
    id: 'article2', title: 'The Ultimate Guide to Choosing Frames for Your Face Shape', slug: 'frames-for-face-shape',
    summary: 'Find the most flattering eyeglass frames based on your face shape. Whether you have a round, oval, square, or heart-shaped face, we have tips for you.',
    content: "<p>Choosing the right frames isn't just about vision correction; it's a fashion statement! The key is to find frames that complement your face shape.</p><h4>Round Face:</h4><p>Look for angular, rectangular frames to add definition.</p><h4>Oval Face:</h4><p>Most frame shapes work well. Consider frames that are as wide as or wider than the broadest part of your face.</p><h4>Square Face:</h4><p>Round or oval frames can soften angular features.</p><h4>Heart-Shaped Face:</h4><p>Frames that are wider at the bottom, or rimless styles, can add balance.</p><p>Don't be afraid to experiment and have fun with different styles!</p>",
    category: mockArticleCategories[1], imageUrl: '/images/placeholder.png', author: 'Style Eyes', publishedDate: '2023-06-20', isFeatured: true
  },
  { 
    id: 'article3', title: 'Top 5 Tips for Comfortable Contact Lens Wear', slug: 'contact-lens-comfort-tips',
    summary: 'Maximize your comfort while wearing contact lenses with these essential tips, from hygiene to hydration.',
    content: "<p>Contact lenses offer great freedom, but comfort is key. Follow these tips:</p><ol><li><strong>Wash Your Hands:</strong> Always wash and dry your hands thoroughly before handling lenses.</li><li><strong>Follow Your Wear Schedule:</strong> Don't overwear your lenses beyond the recommended time (daily, weekly, monthly).</li><li><strong>Use Fresh Solution:</strong> Never reuse old solution. Clean your lens case regularly.</li><li><strong>Stay Hydrated:</strong> Drinking enough water can help prevent dry eyes.</li><li><strong>Give Your Eyes a Break:</strong> Have a pair of backup glasses and avoid sleeping in lenses unless prescribed for extended wear.</li></ol>",
    category: mockArticleCategories[2], imageUrl: '/images/placeholder.png', author: 'LensCare Experts', publishedDate: '2023-07-10'
  },
   { 
    id: 'article4', title: 'Combating Digital Eye Strain: Practical Advice', slug: 'combating-digital-eye-strain',
    summary: 'Spending hours on screens? Learn how to reduce digital eye strain with simple adjustments and habits.',
    content: "<p>Digital eye strain is a common issue. Here's how to fight it:</p><ul><li><strong>The 20-20-20 Rule:</strong> Every 20 minutes, look at something 20 feet away for at least 20 seconds.</li><li><strong>Adjust Screen Settings:</strong> Optimize brightness, contrast, and text size. Consider a matte screen filter.</li><li><strong>Proper Ergonomics:</strong> Position your screen slightly below eye level and at arm's length.</li><li><strong>Blink Often:</strong> We tend to blink less when staring at screens. Make a conscious effort to blink more.</li><li><strong>Consider Blue Light Filtering Glasses:</strong> Some find these helpful, though research is ongoing.</li></ul>",
    category: mockArticleCategories[3], imageUrl: '/images/placeholder.png', author: 'Dr. Screen Relief', publishedDate: '2023-08-01', isFeatured: true
  },
];

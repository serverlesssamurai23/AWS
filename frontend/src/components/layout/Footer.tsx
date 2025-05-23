const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-8 mt-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">OptiCart</h3>
          <p className="text-sm">Your vision, our priority.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="text-sm space-y-1">
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Newsletter</h4>
          <p className="text-sm mb-2">Sign up for updates and offers.</p>
          <input type="email" placeholder="Your email" className="p-2 rounded w-full text-gray-800"/>
        </div>
      </div>
      <div className="text-center text-xs mt-8 pt-4 border-t border-gray-700">
        © {new Date().getFullYear()} OptiCart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

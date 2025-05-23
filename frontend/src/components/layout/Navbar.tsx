import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">OptiCart</Link>
        <ul className="flex space-x-4">
          <li><Link href="/prescription-glasses">Prescription Glasses</Link></li>
          <li><Link href="/contact-lenses">Contact Lenses</Link></li>
          <li><Link href="/sunglasses">Sunglasses</Link></li>
          <li><Link href="/accessories">Accessories</Link></li>
          <li><Link href="/education">Eye Health Education</Link></li>
        </ul>
        <div className="flex space-x-4 items-center">
          <input type="text" placeholder="Search..." className="p-2 border rounded"/>
          <div>User</div> {/* Placeholder for User Account Icon */}
          <div>Cart</div> {/* Placeholder for Cart Icon */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

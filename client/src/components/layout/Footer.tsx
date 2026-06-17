import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from '../common/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/products' },
        { label: 'Electronics', href: '/products?category=Electronics' },
        { label: 'Fashion', href: '/products?category=Fashion' },
        { label: 'Home & Appliances', href: '/products?category=Home & Appliances' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Track Order', href: '/orders' },
        { label: 'Returns', href: '#' },
        { label: 'Shipping Info', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Blog', href: '#' },
      ]
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <Logo size="md" variant="light" />
            </Link>
            <p className="text-gray-400 mb-4 max-w-sm">
              Your one-stop destination for quality products at great prices. Shop with confidence and convenience.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>support@shopeezz.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>1-800-SHOPEEZZ</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>123 Commerce Street, NY 10001</span>
              </div>
            </div>
          </div>

          {footerLinks.map(section => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} ShopEEZZ. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map(social => (
              <a
                key={social.label}
                href={social.href}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

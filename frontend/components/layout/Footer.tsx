import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gradient mb-4">TaskFlow</h3>
            <p className="text-neutral-600 max-w-md">
              Your tasks, beautifully organized with rewards and streaks. Experience productivity reimagined.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-neutral-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-600 hover:text-primary-600 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-neutral-600 hover:text-primary-600 transition-colors">Pricing</Link></li>
              <li><Link href="/#" className="text-neutral-600 hover:text-primary-600 transition-colors">Integrations</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-neutral-900 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/#" className="text-neutral-600 hover:text-primary-600 transition-colors">Help Center</Link></li>
              <li><Link href="/#" className="text-neutral-600 hover:text-primary-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/#" className="text-neutral-600 hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-600 text-sm">
            &copy; {currentYear} TaskFlow. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/#" className="text-neutral-600 hover:text-primary-600 transition-colors text-sm">
              Terms
            </Link>
            <Link href="/#" className="text-neutral-600 hover:text-primary-600 transition-colors text-sm">
              Privacy
            </Link>
            <Link href="/#" className="text-neutral-600 hover:text-primary-600 transition-colors text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
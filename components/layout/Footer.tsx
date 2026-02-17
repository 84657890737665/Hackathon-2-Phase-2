import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold tracking-tight mb-4">Taskflow</h3>
            <p className="text-neutral-400 max-w-md leading-relaxed">
              Work Simplified. Transforming chaotic work into focused execution.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-neutral-300">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/features" className="text-neutral-400 hover:text-white transition-colors duration-200 block py-1">Features</Link></li>
              <li><Link href="/pricing" className="text-neutral-400 hover:text-white transition-colors duration-200 block py-1">Pricing</Link></li>
              <li><Link href="/integrations" className="text-neutral-400 hover:text-white transition-colors duration-200 block py-1">Integrations</Link></li>
              <li><Link href="/roadmap" className="text-neutral-400 hover:text-white transition-colors duration-200 block py-1">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-neutral-300">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-neutral-400 hover:text-white transition-colors duration-200 block py-1">About Us</Link></li>
              <li><Link href="/careers" className="text-neutral-400 hover:text-white transition-colors duration-200 block py-1">Careers</Link></li>
              <li><Link href="/contact" className="text-neutral-400 hover:text-white transition-colors duration-200 block py-1">Contact</Link></li>
              <li><Link href="/legal" className="text-neutral-400 hover:text-white transition-colors duration-200 block py-1">Legal</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            &copy; {currentYear} Taskflow Technologies. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-8">
            <Link href="/privacy-policy" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm">Privacy</Link>
            <Link href="/terms-of-service" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm">Terms</Link>
            <Link href="/security" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm">Security</Link>
            <Link href="/status" className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
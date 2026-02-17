import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Choose the plan that works best for you and your team.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {/* Free Tier */}
          <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Starter</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">$0</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </p>
              <p className="mt-6 text-gray-500">Perfect for individuals getting started</p>
              
              <ul role="list" className="mt-6 space-y-4 flex-1">
                <li className="flex">
                  <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500">Up to 5 projects</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500">Basic task management</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500">Up to 100 tasks</span>
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="mt-8 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-button hover:shadow-md"
            >
              Get started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <div className="absolute top-0 py-1.5 px-4 bg-indigo-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2">
                Most popular
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Professional</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">$12</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </p>
              <p className="mt-6 text-gray-500">Perfect for professionals and small teams</p>
              
              <ul role="list" className="mt-6 space-y-4 flex-1">
                <li className="flex">
                  <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500">Unlimited projects</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500">Advanced task management</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500">Unlimited tasks</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500">Team collaboration</span>
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="mt-8 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-button hover:shadow-md"
            >
              Get started
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Enterprise</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">$24</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </p>
              <p className="mt-6 text-gray-500">Perfect for large organizations</p>
              
              <ul role="list" className="mt-6 space-y-4 flex-1">
                <li className="flex">
                  <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500">Everything in Professional</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500">Priority support</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500">Custom integrations</span>
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-gray-500">Dedicated account manager</span>
                </li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="mt-8 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-button hover:shadow-md"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
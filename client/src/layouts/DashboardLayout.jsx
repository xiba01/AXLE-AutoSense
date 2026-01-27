import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Car, Settings, LogOut } from "lucide-react"; // Icons

export default function DashboardLayout() {
  return (
    <div className="bg-gray-50 dark:bg-neutral-900 min-h-screen">
      {/* 1. TOP HEADER (Mobile Toggle + User Profile) */}
      <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:ps-64 dark:bg-neutral-800 dark:border-neutral-700">
        <nav
          className="flex basis-full items-center w-full mx-auto px-4 sm:px-6"
          aria-label="Global"
        >
          <div className="me-5 lg:me-0 lg:hidden">
            {/* Sidebar Toggle Button (Preline Logic) */}
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600"
              data-hs-overlay="#application-sidebar"
              aria-controls="application-sidebar"
              aria-label="Toggle navigation"
            >
              <span className="sr-only">Toggle Navigation</span>
              <svg
                className="size-6"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                />
              </svg>
            </button>
          </div>

          <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
            <div className="hidden sm:block"></div> {/* Spacer */}
            <div className="flex flex-row items-center justify-end gap-2">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Demo Dealer
              </span>
              <div className="size-[38px] rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                D
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* 2. SIDEBAR NAVIGATION */}
      <div
        id="application-sidebar"
        className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700"
      >
        <div className="px-6">
          <Link
            to="/dashboard"
            className="flex-none text-xl font-semibold dark:text-white"
            aria-label="Brand"
          >
            AXLE
          </Link>
        </div>

        <nav
          className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
          data-hs-accordion-always-open
        >
          <ul className="space-y-1.5">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:bg-neutral-700 dark:text-white"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/inventory"
                className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                <Car className="size-4" />
                Inventory
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                <Settings className="size-4" />
                Settings
              </Link>
            </li>
          </ul>

          <div className="mt-auto pt-10">
            <Link
              to="/login"
              className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50"
            >
              <LogOut className="size-4" />
              Sign Out
            </Link>
          </div>
        </nav>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
        <Outlet />
      </div>
    </div>
  );
}

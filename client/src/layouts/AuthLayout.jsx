import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
      <div className="w-full max-w-md p-6">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 tracking-tighter">
            AXLE
          </h1>
          <p className="text-sm text-gray-500 mt-2">Dealer Operating System</p>
        </div>

        {/* The Login/Register Forms will render here */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <div className="p-4 sm:p-7">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

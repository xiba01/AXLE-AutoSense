import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-background to-default-100">
      <div className="w-full max-w-md px-6">
        {/* Logo Area */}
        <div className="text-center mb-6">
          <img
            src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AXLE-logo.png"
            alt="AXLE Logo"
            className="h-12 mx-auto mb-3"
          />
          <p className="text-sm text-default-500">Dealer Operating System</p>
        </div>

        {/* The Login/Register Forms will render here */}
        <div className="bg-content1 border border-divider rounded-2xl shadow-medium">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

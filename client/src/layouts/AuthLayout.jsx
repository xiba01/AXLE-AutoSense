import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-zinc-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 via-white to-violet-50/30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md px-6 py-12">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <img
            src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AXLE-logo.png"
            alt="Axle"
            className="h-10 mx-auto mb-3"
          />
          <p className="text-xs font-medium text-zinc-500 tracking-wide">
            DEALER OPERATING SYSTEM
          </p>
        </div>

        {/* The Login/Register Forms will render here */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-xl shadow-zinc-900/5">
          <div className="p-8">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-400 mt-8">© 2026 Axle</p>
      </div>
    </div>
  );
}

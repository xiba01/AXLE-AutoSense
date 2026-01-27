import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Drawer,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  Divider,
  User,
} from "@heroui/react";
import { LayoutDashboard, Car, Settings, LogOut, Menu } from "lucide-react";
import { supabase } from "../config/supabaseClient";
import { logout } from "../store/slices/authSlice";
import { clearDealerData } from "../store/slices/dealerSlice";

export default function DashboardLayout() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get Real Dealer Data from Redux
  const { profile } = useSelector((state) => state.dealer);

  // Fallbacks if profile isn't loaded yet
  const dealerName = profile?.dealership_name || "Dealer Account";
  const dealerLogo = profile?.logo_url;
  const dealerInitial = dealerName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    dispatch(clearDealerData());
    navigate("/login");
  };

  // Navigation Links Configuration
  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Inventory", path: "/dashboard/inventory", icon: Car },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  // Reusable Sidebar Content
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-divider">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-2xl tracking-tighter"
        >
          <img
            className=" w-30"
            src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/dealerships-logo/d9ed9926-ab4a-46a9-b0ee-c42dabefee6b/1769503521260.png"
            alt=""
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Button
              key={item.path}
              as={Link}
              to={item.path}
              fullWidth
              variant={isActive ? "flat" : "light"}
              color={isActive ? "primary" : "default"}
              className={`justify-start gap-3 text-medium ${isActive ? "font-semibold" : "font-normal text-default-500"}`}
              startContent={<Icon size={20} />}
            >
              {item.label}
            </Button>
          );
        })}
      </nav>

      <Divider />

      {/* Footer / Logout */}
      <div className="p-4">
        <Button
          fullWidth
          variant="light"
          color="danger"
          className="justify-start gap-3 font-medium"
          startContent={<LogOut size={20} />}
          onPress={handleLogout}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-default-50">
      {/* 1. DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside className="hidden lg:block w-64 border-r border-divider fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* 2. MOBILE SIDEBAR (Drawer) */}
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
        <DrawerContent className="max-w-[280px]">
          {(onClose) => (
            <DrawerBody className="p-0">
              <SidebarContent />
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>

      {/* 3. MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all">
        {/* TOP HEADER */}
        <header className="h-16 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-divider px-4 sm:px-6 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <Button isIconOnly variant="ghost" size="sm" onPress={onOpen}>
              <Menu size={20} />
            </Button>
            <span className="font-bold text-large tracking-tight">AXLE</span>
          </div>

          {/* Spacer for Desktop Alignment */}
          <div className="hidden lg:block"></div>

          {/* User Profile Dropdown */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-small font-semibold text-foreground">
                {dealerName}
              </span>
              <span className="text-tiny text-default-500">Pro Dealer</span>
            </div>

            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={dealerInitial}
                  size="sm"
                  src={dealerLogo}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  textValue="Signed in as"
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold text-primary">{dealerName}</p>
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  href="/dashboard/settings"
                  startContent={<Settings size={16} />}
                >
                  Settings
                </DropdownItem>
                <DropdownItem key="separator" className="p-0 h-px bg-divider" />
                <DropdownItem
                  key="logout"
                  color="danger"
                  className="text-danger"
                  startContent={<LogOut size={16} />}
                  onPress={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

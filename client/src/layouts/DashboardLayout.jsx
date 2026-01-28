import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Avatar,
  Drawer,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  Divider,
  User,
  Card,
  CardBody,
  Chip,
} from "@heroui/react";
import {
  Home,
  Car,
  Video,
  Settings,
  LogOut,
  Menu,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
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

  // Fallbacks
  const dealerName = profile?.dealership_name || "Dealer Account";
  const dealerLogo = profile?.logo_url;
  const subscription = profile?.subscription_tier || "free";
  const isPro = subscription === "pro" || subscription === "enterprise";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(logout());
    dispatch(clearDealerData());
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    { label: "Inventory", path: "/dashboard/inventory", icon: Car },
    { label: "Studio", path: "/dashboard/studio", icon: Video },
    { label: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  // ----------------------------------------------------------------------
  // 🎨 SIDEBAR CONTENT (Reused for Desktop & Mobile)
  // ----------------------------------------------------------------------
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* 1. Header & Logo */}
      <div className="h-20 flex items-center px-6">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img
            src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AXLE-logo.png"
            alt="Axle Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      {/* 2. User Profile (ACME Style) */}
      <div className="px-4 mb-6">
        <div className="p-3 rounded-xl bg-default-100/50 border border-default-100 flex items-center justify-between group cursor-pointer hover:bg-default-100 transition-colors">
          <User
            name={dealerName}
            description={
              <span className="capitalize text-default-400 text-xs">
                {subscription} Plan
              </span>
            }
            avatarProps={{
              src: dealerLogo,
              size: "sm",
              isBordered: true,
              color: isPro ? "secondary" : "default",
            }}
            classNames={{
              name: "text-sm font-semibold text-foreground truncate max-w-[120px]",
            }}
          />
          <ChevronRight className="size-4 text-default-400 group-hover:text-foreground" />
        </div>
      </div>

      {/* 3. Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
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
              className={`
                justify-start h-11 px-4 gap-3 mb-1
                ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-default-500 hover:text-foreground"
                }
              `}
              startContent={
                <Icon
                  size={20}
                  className={isActive ? "text-primary" : "text-default-400"}
                />
              }
            >
              {item.label}
            </Button>
          );
        })}

        <div className="pt-4">
          <div className="text-tiny font-bold text-default-400 px-4 mb-2 uppercase tracking-wider">
            Support
          </div>
          <Button
            fullWidth
            variant="light"
            className="justify-start h-10 px-4 gap-3 text-default-500 hover:text-foreground"
            startContent={<HelpCircle size={20} className="text-default-400" />}
          >
            Help & Info
          </Button>
        </div>
      </nav>

      {/* 4. Upgrade Card (Only if Free) */}
      {!isPro && (
        <div className="px-4 mb-4">
          <Card className="bg-gradient-to-br from-default-100 to-background border border-default-200 shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                  <Sparkles size={14} />
                </div>
                <span className="font-semibold text-small">Upgrade to Pro</span>
              </div>
              <p className="text-tiny text-default-500 mb-3 leading-relaxed">
                Unlock 4K rendering, unlimited stories, and AI chat features.
              </p>
              <Button
                size="sm"
                color="primary"
                variant="shadow"
                fullWidth
                className="font-medium"
              >
                Upgrade Plan
              </Button>
            </CardBody>
          </Card>
        </div>
      )}

      <Divider className="my-2" />

      {/* 5. Logout */}
      <div className="px-3 pb-3">
        <Button
          fullWidth
          variant="light"
          color="danger"
          className="justify-start h-11 px-4 gap-3 font-medium text-danger/80 hover:text-danger hover:bg-danger/10"
          startContent={<LogOut size={20} />}
          onPress={handleLogout}
        >
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-default-50">
      {/* 
        A. DESKTOP FLOATING SIDEBAR 
        We use padding (p-3) to create the gap, making the sidebar look like a floating card.
      */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 z-50 p-3 pr-0">
        <div className="flex-1 bg-background rounded-2xl border border-default-200 shadow-sm overflow-hidden">
          <SidebarContent />
        </div>
      </aside>

      {/* B. MOBILE SIDEBAR (Drawer) */}
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
        <DrawerContent className="max-w-[280px]">
          {(onClose) => (
            <DrawerBody className="p-0">
              {/* Reuse content, but no rounded corners for mobile drawer */}
              <div className="h-full bg-background">
                <SidebarContent />
              </div>
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>

      {/* C. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:pl-72 h-screen overflow-hidden">
        {/* Mobile Header (Only visible < lg) */}
        <header className="h-16 lg:hidden shrink-0 sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-default-200 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button isIconOnly variant="light" size="sm" onPress={onOpen}>
              <Menu size={24} />
            </Button>
          </div>
          <Avatar src={dealerLogo} size="sm" />
        </header>

        {/* Page Content */}
        {/* We add padding to create the visual separation from the floating sidebar */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

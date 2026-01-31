import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../config/supabaseClient";
import { updateSubscription } from "../../store/slices/dealerSlice";
import { Card, CardBody, Button, Input, Divider, Chip } from "@heroui/react";
import { Check, CreditCard, ShieldCheck, Zap } from "lucide-react";

export default function PaymentStep() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);

  // State
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loading, setLoading] = useState(false);

  // 1. Initialize selection from URL
  useEffect(() => {
    const planFromUrl = searchParams.get("plan");
    if (planFromUrl === "pro" || planFromUrl === "enterprise") {
      setSelectedPlan("pro");
    }
  }, [searchParams]);

  // 2. Handle The "Payment"
  const handlePayment = async () => {
    setLoading(true);

    try {
      // A. Fake Stripe Processing (Only for Pro)
      if (selectedPlan === "pro") {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s delay
      }

      // B. Update Database
      const { error } = await supabase
        .from("dealers")
        .update({ subscription_tier: selectedPlan })
        .eq("id", user.id);

      if (error) throw error;

      // C. Update Redux State
      dispatch(updateSubscription(selectedPlan));

      // D. Next Step
      navigate("/onboarding/branding");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Select your plan</h2>
        <p className="text-default-500">Upgrade anytime as you grow.</p>
      </div>

      {/* --- PLAN SELECTOR --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* FREE CARD */}
        <Card
          isPressable
          onPress={() => setSelectedPlan("free")}
          className={`border-2 transition-all ${
            selectedPlan === "free"
              ? "border-primary bg-primary/5"
              : "border-transparent hover:border-default-300"
          }`}
          shadow="sm"
        >
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  className={`size-5 ${selectedPlan === "free" ? "text-primary" : "text-default-400"}`}
                />
                <span className="font-semibold text-large">Starter</span>
              </div>
              {selectedPlan === "free" && (
                <Check className="size-5 text-primary" />
              )}
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-small text-default-500"> /mo</span>
            </div>
            <ul className="space-y-2">
              <li className="text-small text-default-500 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-default-400" /> 1
                Active Story
              </li>
              <li className="text-small text-default-500 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-default-400" />{" "}
                Standard Res
              </li>
              <li className="text-small text-default-500 flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-default-400" />{" "}
                Watermarked
              </li>
            </ul>
          </CardBody>
        </Card>

        {/* PRO CARD */}
        <div className="relative">
          {/* Badge sits outside the Card so it doesn't get clipped by overflow-hidden */}
          {selectedPlan === "pro" && (
            <Chip
              color="primary"
              size="sm"
              className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 font-bold uppercase tracking-wider shadow-md"
            >
              Recommended
            </Chip>
          )}

          <Card
            isPressable
            onPress={() => setSelectedPlan("pro")}
            className={`border-2 transition-all w-full ${
              selectedPlan === "pro"
                ? "border-primary bg-primary/5"
                : "border-transparent hover:border-default-300"
            }`}
            shadow="sm"
          >
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Zap
                    className={`size-5 ${selectedPlan === "pro" ? "text-primary" : "text-default-400"}`}
                  />
                  <span className="font-semibold text-large">Pro Dealer</span>
                </div>
                {selectedPlan === "pro" && (
                  <Check className="size-5 text-primary" />
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">$49</span>
                <span className="text-small text-default-500"> /mo</span>
              </div>
              <ul className="space-y-2">
                <li className="text-small text-default-500 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-primary" /> Unlimited
                  Stories
                </li>
                <li className="text-small text-default-500 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-primary" /> 360 car
                  interior
                </li>
                <li className="text-small text-default-500 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-primary" />{" "}
                  White-label
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      <Divider />

      {/* --- CONDITIONAL BILLING SECTION --- */}
      <div className="min-h-[180px]">
        {selectedPlan === "free" ? (
          <div className="bg-default-50 border border-default-200 p-6 rounded-large flex flex-col items-center justify-center text-center h-full animate-in fade-in">
            <div className="p-3 bg-success-50 rounded-full text-success mb-3">
              <ShieldCheck className="size-6" />
            </div>
            <p className="font-medium text-foreground">No payment required</p>
            <p className="text-small text-default-500 mt-1">
              You can upgrade to Pro at any time from your dashboard settings.
            </p>
          </div>
        ) : (
          /* SCENARIO B: PRO (Fake Stripe Elements) */
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-small uppercase tracking-wide text-default-500">
                Card Details
              </h3>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-default-200 rounded animate-pulse"></div>
                <div className="w-8 h-5 bg-default-200 rounded animate-pulse delay-75"></div>
              </div>
            </div>

            <Input
              isDisabled={loading}
              defaultValue="4242 4242 4242 4242" // FAKE DATA
              placeholder="0000 0000 0000 0000"
              startContent={
                <CreditCard className="text-default-400 pointer-events-none" />
              }
              variant="bordered"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                isDisabled={loading}
                defaultValue="12 / 25" // FAKE DATA
                placeholder="MM / YY"
                variant="bordered"
              />
              <Input
                isDisabled={loading}
                defaultValue="123" // FAKE DATA
                placeholder="CVC"
                variant="bordered"
              />
            </div>

            <div className="flex justify-between items-center text-small font-medium pt-2 px-1">
              <span>Total due today:</span>
              <span className="text-large text-primary font-bold">$49.00</span>
            </div>
          </div>
        )}
      </div>

      {/* --- SUBMIT BUTTON --- */}
      <Button
        onPress={handlePayment}
        isLoading={loading}
        color={selectedPlan === "pro" ? "primary" : "default"}
        variant={selectedPlan === "pro" ? "shadow" : "flat"}
        size="lg"
        fullWidth
        className="font-semibold"
      >
        {loading
          ? selectedPlan === "pro"
            ? "Processing Payment..."
            : "Setting up..."
          : selectedPlan === "pro"
            ? "Pay $49 & Continue"
            : "Continue for Free"}
      </Button>
    </div>
  );
}

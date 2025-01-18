"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { countryCodes } from "@/lib/country-codes";

interface RegisterPhoneFormProps {
  onSuccess: () => void;
}

export function RegisterPhoneForm({ onSuccess }: RegisterPhoneFormProps) {
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [method, setMethod] = useState<"sms" | "voice">("sms");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [cert, setCert] = useState("");

  const validatePhoneNumber = (number: string) => {
    // Basic validation - can be enhanced based on requirements
    return /^\d{10}$/.test(number);
  };

  const handleRequestCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/v1/whatsapp/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cc: countryCode.replace("+", ""),
          phone_number: phoneNumber,
          method,
          cert,
        }),
      });

      if (!response.ok) throw new Error("Failed to register account");

      toast.success("Account registration initiated successfully");
      setStep("verify");
    } catch (error) {
      console.error("[ACCOUNT_REGISTER]", error);
      toast.error("Failed to register account");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/whatsapp/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: verificationCode,
          cc: countryCode.replace("+", ""),
          phone_number: phoneNumber,
        }),
      });

      if (!response.ok) throw new Error("Failed to verify code");

      toast.success("Phone number verified successfully");
      onSuccess();
    } catch (error) {
      console.error("[CODE_VERIFY]", error);
      toast.error("Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === "request" ? (
        <>
          <div className="flex gap-2">
            <div className="w-32">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={`+${country.code}`}>
                      <div className="flex flex-col">
                        <span className="font-medium">+{country.code}</span>
                        <span className="text-muted-foreground text-xs">
                          {country.country}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="tel"
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <Select
            value={method}
            onValueChange={(v) => setMethod(v as "sms" | "voice")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Verification method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="voice">Voice Call</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Verified name certificate"
            value={cert}
            onChange={(e) => setCert(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={handleRequestCode}
            disabled={loading || !countryCode || !phoneNumber || !cert}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register Account
          </Button>
        </>
      ) : (
        <>
          <Input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setStep("request")}
              disabled={loading}
            >
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handleVerifyCode}
              disabled={loading || !verificationCode}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

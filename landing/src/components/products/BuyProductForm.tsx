"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { productService } from "@/app/api/products/route";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function BuyProductForm({
  productId,
  productTitle,
  productPrice,
  dict,
  locale,
}: {
  productId: number;
  productTitle: string;
  productPrice: string;
  dict: any;
  locale: string;
}) {
  const router = useRouter();
  const { user, loading: loadingUser } = useAuthStore();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (user) {
      setPhoneNumber(user.phone || "");
    }
  }, [user]);

  if (!isClient || loadingUser) {
    return (
      <div className="border dark:border-neutral-700 rounded-xl p-6 bg-muted/30 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="flex space-x-2 justify-center items-center">
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
          {dict.common.loading}...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="border dark:border-neutral-700 rounded-xl p-6 bg-muted/30 text-center">
        <h2 className="text-xl font-semibold mb-2">
          {dict.products.needAuth}
        </h2>
        <p className="text-sm text-muted-foreground">
          {dict.products.needAuthDesc}
        </p>
        <Image
          src="/login.png"
          alt="Tizimga kirish kerak"
          width={300}
          height={200}
          className="mx-auto mt-4 w-auto h-auto"
          priority
        />

        <div className="mt-4 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              const loginUrl = `/${locale}/login`;
              router.push(loginUrl);
            }}
            className="cursor-pointer"
          >
            {dict.auth.login}
          </Button>

          <Button
            onClick={() => {
              const registerUrl = `/${locale}/signup`;
              router.push(registerUrl);
            }}
            className="cursor-pointer"
          >
            {dict.auth.register}
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="border dark:border-neutral-700 rounded-xl p-6 bg-green-100 dark:bg-green-900/30 text-center">
        <h2 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-300">
          ✅ {dict.products.buySuccess}
        </h2>
        <p className="text-sm text-muted-foreground">
          {dict.products.responseSoon}
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phoneNumber) {
      setError(dict.products.phoneRequired);
      return;
    }

    const payload = {
      product: productId,
      phone_number: phoneNumber,
    };

    setLoading(true);
    try {
      await productService.buyProduct(payload);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(dict.products.buyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border dark:border-neutral-700 rounded-xl p-6 space-y-4"
    >
      <h2 className="text-xl font-medium mb-3">
        {dict.products.buyProduct}
      </h2>

      {/* Mahsulot ma'lumotlari */}
      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
        <p className="text-sm font-medium">{productTitle}</p>
        <p className="text-2xl font-bold text-primary">
          {productPrice} {dict.products?.currency || "so'm"}
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>{dict.products.firstName}</Label>
          <Input
            placeholder="Ism"
            value={user?.first_name || ""}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label>{dict.products.lastName}</Label>
          <Input
            placeholder="Familiya"
            value={user?.last_name || ""}
            disabled
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={user?.email || ""} disabled />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label>{dict.products.phone}</Label>
        <Input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+998..."
          disabled={!!user?.phone}
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? dict.products.sending : dict.products.submit}
      </Button>
    </form>
  );
}
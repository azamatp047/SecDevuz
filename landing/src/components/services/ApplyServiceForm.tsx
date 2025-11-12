"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { serviceService } from "@/app/api/services/route";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function ApplyServiceForm({
  serviceId,
  dict,
  locale,
}: {
  serviceId: number;
  dict: any;
  locale: string;
}) {
  const router = useRouter();
  const { user, loading: loadingUser } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false); // Formani yuborish uchun loading
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Yangi holat: Komponent client-side da montaj qilinganini tekshirish
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Komponent client-side da montaj qilinganda isClient ni true ga o'rnatamiz
    setIsClient(true);
    if (user) {
      setPhone(user.phone || "");
    }
  }, [user]); // user o'zgarganda ham ishga tushsin

  // 🔹 Agar komponent hali client-side da montaj qilinmagan bo'lsa
  // yoki foydalanuvchi ma'lumotlari yuklanayotgan bo'lsa
  if (!isClient || loadingUser) {
    return (
      // max-h-40 klassi olib tashlandi
      <div className="border dark:border-neutral-700 rounded-xl p-6 bg-muted/30 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
        {/* Chiroyliroq loader */}
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

  // 🔹 Agar foydalanuvchi tizimga kirmagan bo‘lsa (faqat isClient true bo'lganda)
  if (!user) {
    return (
      <div className="border dark:border-neutral-700 rounded-xl p-6 bg-muted/30 text-center">
        <h2 className="text-xl font-semibold mb-2">
          {dict.services.needAuth}
        </h2>
        <p className="text-sm text-muted-foreground">
          {dict.services.needAuthDesc}
        </p>
        <Image
          src="/login.png"
          alt="Tizimga kirish kerak"
          width={300}
          height={200}
          className="mx-auto mt-4 w-auto h-auto"
          priority
        />

        {/* Login and Register button */}
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

  // 🔹 Agar yuborilgan bo‘lsa
  if (submitted) {
    return (
      <div className="border dark:border-neutral-700 rounded-xl p-6 bg-green-100 dark:bg-green-900/30 text-center">
        <h2 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-300">
          ✅ {dict.services.applySuccess}
        </h2>
        <p className="text-sm text-muted-foreground">
          {dict.services.responseSoon}
        </p>
      </div>
    );
  }

  // 🔹 Formani yuborish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone) {
      setError(dict.services.phoneRequired);
      return;
    }

    const payload = {
      service: serviceId,
      note: note,
      phone: phone,
    };

    setLoading(true);
    try {
      await serviceService.applyForService(payload);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(dict.services.applyError);
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
        {dict.services.orderService}
      </h2>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {/* Full Name (Faqat ko'rsatish uchun, backendga yuborilmaydi) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>{dict.services.firstName} </Label>
          <Input
            placeholder="Ism"
            value={user?.first_name || ""}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label>{dict.services.lastName} </Label>
          <Input
            placeholder="Familiya"
            value={user?.last_name || ""}
            disabled
          />
        </div>
      </div>

      {/* Email (Faqat ko'rsatish uchun, backendga yuborilmaydi) */}
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={user?.email || ""} disabled />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label>{dict.services.phone}</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+998..."
          disabled={!!user?.phone}
        />
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label>{dict.services.note}</Label>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={dict.services.notePlaceholder}
          rows={4}
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? dict.services.sending : dict.services.submit}
      </Button>
    </form>
  );
}
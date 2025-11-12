"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { vacancyService } from "@/app/api/vacancies/route";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function ApplyForm({
  vacancyId,
  dict,
  locale
}: {
  vacancyId: number;
  dict: any;
  locale: string;
}) {
  const router = useRouter();
  const { user, loading: loadingUser } = useAuthStore(); // useAuthStore dan loading holatini ham oldik

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // Formani yuborish uchun loading
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Yangi holat: Komponent client-side da montaj qilinganini tekshirish
  const [isClient, setIsClient] = useState(false);

  // user o‘zgarganda inputlarni avtomatik to‘ldirish
  useEffect(() => {
    // Komponent client-side da montaj qilinganda isClient ni true ga o'rnatamiz
    setIsClient(true);
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhone(user.phone || "");
    }
  }, [user]); // user o'zgarganda ham ishga tushsin

  // 🔹 Agar komponent hali client-side da montaj qilinmagan bo'lsa
  // yoki foydalanuvchi ma'lumotlari yuklanayotgan bo'lsa
  if (!isClient || loadingUser) {
    return (
      <div className="border dark:border-neutral-700 rounded-xl p-6 bg-muted/30 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
        {/* Chiroyliroq loader */}
        <div className="flex space-x-2 justify-center items-center">
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
          {dict.common.loading}... {/* Lug'atdan olingan */}
        </p>
      </div>
    );
  }

  // 🔹 Agar foydalanuvchi tizimga kirmagan bo‘lsa (faqat isClient true bo'lganda)
  if (!user) {
    return (
      <div className="border dark:border-neutral-700 rounded-xl p-6 bg-muted/30 text-center">
        <h2 className="text-xl font-semibold mb-2">
          {dict.vacancies.needAuth}
        </h2>
        <p className="text-sm text-muted-foreground">
          {dict.vacancies.needAuthDesc}
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
          ✅ {dict.vacancies.applySuccess}
        </h2>
        <p className="text-sm text-muted-foreground">
          {dict.vacancies.responseSoon}
        </p>
      </div>
    );
  }

  // 🔹 Formani yuborish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resume) {
      setError(dict.vacancies.resumeRequired);
      return;
    }

    if (!phone) {
      setError(dict.vacancies.phoneRequired);
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();
    if (!fullName) {
      setError(dict.vacancies.fullName + " " + dict.vacancies.phoneRequired);
      return;
    }

    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("phone", phone);
    formData.append("email", user.email);
    formData.append("vacancy", String(vacancyId));
    formData.append("resume", resume);

    setLoading(true);
    try {
      await vacancyService.applyToVacancy(formData);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(dict.vacancies.applyError);
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
        {dict.vacancies.apply_btn}
      </h2>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>{dict.vacancies.fullName} (Ism)</Label>
          <Input
            placeholder="Ism"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={!!user?.first_name}
          />
        </div>

        <div className="space-y-2">
          <Label>{dict.vacancies.fullName} (Familiya)</Label>
          <Input
            placeholder="Familiya"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!!user?.last_name}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={user?.email || ""} disabled />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label>{dict.vacancies.phone}</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+998..."
          disabled={!!user?.phone} // 🔹 faqat agar user.phone bo‘lsa — disable
        />
      </div>

      {/* Resume */}
      <div className="space-y-2">
        <Label>{dict.vacancies.selectFile}</Label>
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
        />
        <p className="text-xs text-muted-foreground">
          {dict.vacancies.fileTypes}
        </p>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? dict.vacancies.sending : dict.vacancies.apply_btn}
      </Button>
    </form>
  );
}
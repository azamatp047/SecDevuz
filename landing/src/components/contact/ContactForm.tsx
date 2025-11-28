// components/contact/ContactForm.tsx
"use client"; // This component is a client component

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore"; // Assuming this is a client-side Zustand store

export default function ContactForm({ dict }: { dict: any }) {
  const { user } = useAuthStore(); // Accessing the client-side auth store
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill user data when available (runs only on the client after mount)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "",
        email: user.email || "",
        phone: user.phone || "",
        message: "",
      });
    }
  }, [user]); // Dependency on 'user' ensures this runs when 'user' changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > 500) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { name, email, phone, message } = formData;
    if (!name || !email || !phone || !message) {
      setError(dict.contact.fill_all);
      return;
    }

    setLoading(true);
    try {
      // Use fetch to call the API route
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let message = dict.contact.send_error;
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
          else if (data?.message) message = data.message;
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(message);
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || dict.contact.send_error);
    } finally {
      setLoading(false);
    }
  };

  const handeAnother = () => {
    setFormData({ name: "", email: "", phone: "", message: "" });
    setSubmitted(false);
    setError(null);
  };

  if (submitted) {
    return (
      <div className="p-6 bg-green-100 dark:bg-green-900/30 rounded-xl text-center">
        <h3 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-300">
          ✅ {dict.contact.success_title}
        </h3>
        <p>{dict.contact.success_desc}</p>
        <Button onClick={handeAnother} className="mt-4">
          {dict.contact.send_another}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
      <div className="space-y-2">
        <Label>{dict.contact.name} *</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!!user && !!user.first_name} // Disabled if user data is pre-filled
          aria-label={dict.contact.name}
        />
      </div>
      <div className="space-y-2">
        <Label>{dict.contact.email} *</Label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={!!user && !!user.email} // Disabled if user data is pre-filled
          aria-label={dict.contact.email}
        />
      </div>
      <div className="space-y-2">
        <Label>{dict.contact.phone} *</Label>
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={!!user && !!user.phone} // Disabled if user data is pre-filled
          aria-label={dict.contact.phone}
        />
      </div>
      <div className="space-y-2">
        <Label>{dict.contact.message} *</Label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          aria-label={dict.contact.message}
        />
        <p className="text-xs text-muted-foreground text-right">{formData.message.length}/500</p>
      </div>

      {error && (
        <div role="alert" className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? dict.contact.sending : dict.contact.send}
      </Button>

      <hr />
      {/* OLDIN MASLAHAT MATNI */}
      {!submitted && !error && (
        <p className="text-md text-gray-600 dark:text-gray-300">
          ℹ️ {dict.contact.info_before_send}
        </p>
      )}
    </form>
  );
}
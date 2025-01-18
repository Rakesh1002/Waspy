"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fadeIn } from "@/lib/animations";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas/contact";
import { toast } from "sonner";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit form");
      toast.success("Message sent successfully!");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative container max-w-lg mx-auto px-4 py-24"
    >
      {/* Background gradients */}

      <motion.div variants={fadeIn} className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          Get in Touch
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Have questions? Send us a message.
        </p>
      </motion.div>

      <motion.div variants={fadeIn}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 backdrop-blur-sm bg-white/30 dark:bg-black/20 p-8 rounded-2xl shadow-lg"
        >
          <div>
            <Input
              {...register("name")}
              placeholder="Name"
              className={`w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border-slate-200 dark:border-slate-800 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              type="email"
              {...register("email")}
              placeholder="Email"
              className={`w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border-slate-200 dark:border-slate-800 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Textarea
              {...register("message")}
              placeholder="Your message..."
              className={`w-full h-24 resize-none bg-white/50 dark:bg-black/30 backdrop-blur-sm border-slate-200 dark:border-slate-800 ${
                errors.message ? "border-red-500" : ""
              }`}
            />
            {errors.message && (
              <p className="text-xs text-red-500 mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </motion.section>
  );
}

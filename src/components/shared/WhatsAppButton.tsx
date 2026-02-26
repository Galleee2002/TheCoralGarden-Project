"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5491100000000"; // Placeholder — update with real number
const WHATSAPP_MESSAGE =
  "Hola! Me interesa conocer más sobre sus productos y servicios de purificación de agua.";

export function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
    >
      <MessageCircle className="h-7 w-7 fill-white" />
    </a>
  );
}

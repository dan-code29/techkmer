'use client';

import Image from 'next/image';
import { useState } from 'react';

const cannedQuestions = [
  'Comment obtenir un devis ?',
  'Quels sont vos services ?',
  'Avez-vous une assistance technique ?',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Bonjour ! Je suis votre assistant Tech Innov' Solutions. Posez une question ou contactez-nous sur WhatsApp.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+237697654023';
  const whatsappNumber = contactPhone.replace(/[^0-9]/g, '');
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const addMessage = (text: string, from: 'user' | 'bot') => {
    setMessages((current) => [...current, { from, text }]);
  };

  const handleSend = () => {
    const question = inputValue.trim();
    if (!question) return;
    addMessage(question, 'user');
    setInputValue('');

    setTimeout(() => {
      addMessage(
        "Merci pour votre question ! Nous y répondrons sous peu. Vous pouvez aussi nous joindre immédiatement sur WhatsApp.",
        'bot'
      );
    }, 300);
  };

  const handleQuickQuestion = (question: string) => {
    addMessage(question, 'user');
    setTimeout(() => {
      addMessage(
        "Bonne question ! Pour un suivi rapide, contactez-nous directement sur WhatsApp.",
        'bot'
      );
    }, 300);
  };

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col items-end space-y-3">
      {isOpen && (
        <div className="w-80 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-lg">
          <div className="flex items-center justify-between border-b pb-3 mb-3 gap-3">
            <div>
              <p className="text-sm font-semibold">Assistant Tech Innov'Solutions</p>
              <p className="text-xs text-slate-500">Chat en direct / WhatsApp</p>
            </div>
            <div className="relative h-12 w-12 rounded-full overflow-hidden border border-slate-200">
              <Image
                src="/images/photobackgroundchat.jpg"
                alt="Support image"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-900"
              aria-label="Fermer le chat"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pb-2">
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`rounded-2xl px-3 py-2 ${
                  message.from === 'bot'
                    ? 'bg-slate-100 text-slate-900 self-start'
                    : 'bg-blue-600 text-white self-end'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="grid gap-2">
              {cannedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleQuickQuestion(question)}
                  className="rounded-full border border-slate-200 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                >
                  {question}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Écrire une question..."
                className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleSend}
                className="rounded-2xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Envoyer
              </button>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
            >
              Contacter sur WhatsApp
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-3 rounded-full bg-blue-600 px-4 py-3 text-white shadow-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <div className="text-left">
          <div className="font-semibold">Besoin d'aide ?</div>
          <div className="text-xs text-cyan-100/90">Chat / WhatsApp</div>
        </div>
        <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/60 bg-white">
          <Image
            src="/images/photobackgroundchat.jpg"
            alt="Support"
            fill
            className="object-cover"
          />
        </div>
      </button>
    </div>
  );
}

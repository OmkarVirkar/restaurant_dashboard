"use client";

import { createPortal } from "react-dom";
import { useState, type FormEvent } from "react";

import type { LoginContent } from "@/types/login";
import { FormField } from "./ui/form-field";

export type RequestAccessContent = Pick<
  LoginContent,
  | "invite"
  | "inviteAction"
  | "requestAccessTitle"
  | "requestAccessText"
  | "fullName"
  | "email"
  | "requestReason"
  | "placeholderName"
  | "placeholderEmail"
  | "placeholderReason"
  | "sendRequest"
  | "requestSent"
  | "requestSentText"
  | "close"
>;

type RequestAccessModalProps = {
  content: RequestAccessContent;
};

export function RequestAccessModal({ content }: RequestAccessModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);

  function close() {
    setIsOpen(false);
    setIsSent(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSent(true);
  }

  return (
    <>
      <p className="mt-8 text-center text-sm text-stone-500">
        {content.invite}{" "}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="font-semibold text-amber-700 hover:text-amber-800"
        >
          {content.inviteAction}
        </button>
      </p>

      {isOpen
        ? createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/45 px-4 py-8 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-access-title"
            className="w-full max-w-lg rounded-[28px] border border-amber-200 bg-[#fffaf5] p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-amber-700">
                  {content.invite}
                </p>
                <h2 id="request-access-title" className="text-2xl font-semibold text-stone-900">
                  {isSent ? content.requestSent : content.requestAccessTitle}
                </h2>
                {!isSent ? <p className="mt-2 text-sm leading-6 text-stone-600">{content.requestAccessText}</p> : null}
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={content.close}
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-amber-100 hover:text-stone-900"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {isSent ? (
              <div className="space-y-6">
                <p className="text-sm leading-6 text-stone-600">{content.requestSentText}</p>
                <button
                  type="button"
                  onClick={close}
                  className="w-full rounded-2xl bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  {content.close}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField
                  id="request-name"
                  type="text"
                  label={content.fullName}
                  placeholder={content.placeholderName}
                  icon="user"
                  required
                />
                <FormField
                  id="request-email"
                  type="email"
                  label={content.email}
                  placeholder={content.placeholderEmail}
                  icon="mail"
                  required
                />
                <div className="space-y-2">
                  <label htmlFor="request-reason" className="text-sm font-medium text-stone-700">
                    {content.requestReason}
                  </label>
                  <textarea
                    id="request-reason"
                    required
                    placeholder={content.placeholderReason}
                    className="min-h-28 w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900 outline-none placeholder:text-stone-400 transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:translate-y-[-1px] hover:shadow-xl hover:shadow-orange-500/30"
                >
                  {content.sendRequest}
                </button>
              </form>
            )}
          </section>
        </div>,
          document.body,
        )
        : null}
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { CategoryDirectory } from "@/components/CategoryDirectory";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AP Score Calculator — Estimate Your AP Exam Score Instantly" },
      {
        name: "description",
        content:
          "Free AP score calculators for every AP exam. Enter your MCQ and FRQ answers to estimate your 1–5 score using the latest curves.",
      },
      { property: "og:title", content: "AP Score Calculator — Estimate Your AP Exam Score" },
      {
        property: "og:description",
        content:
          "Instantly estimate your AP exam score across every AP subject — Calculus, Biology, U.S. History and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: CategoryDirectory,
});

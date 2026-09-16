import { Fraunces, Manrope } from "next/font/google";

// Display font: warm, editorial serif with personality - used for headings,
// the wordmark, and anywhere the brand's emotional tone should come through.
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Body/UI font: clean, highly legible geometric sans - used for everything
// people have to read quickly under stress (forms, case details, alerts).
export const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

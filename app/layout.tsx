import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { QuizProvider } from "@/lib/quiz-context";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuizGen AI - Generate Quizzes from Your Content",
  description: "Upload your study materials and let AI create personalized quizzes with detailed explanations",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.className}`}>
      <body>
        <ThemeProvider attribute="class" enableSystem forcedTheme="dark">
          <AuthProvider>
            <QuizProvider>
              <Toaster position="top-center" richColors />
              {children}
            </QuizProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { LogIn, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Noto'g'ri email yoki parol");
      } else {
        // If successful, determine where to redirect based on email or role.
        // For simplicity, we just go to dashboard and let middleware handle it,
        // or we can push to a general dashboard route.
        if (email.includes("admin")) {
          router.push("/dashboard/admin");
        } else if (email.includes("mentor")) {
          router.push("/dashboard/mentor");
        } else {
          router.push("/dashboard/student");
        }
      }
    } catch (err) {
      setError("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-panel w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">Tizimga kirish</CardTitle>
        <CardDescription className="text-muted-foreground">
          Hisobingizga kirish uchun email va parolingizni kiriting.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-background/50"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Parol</Label>
              <a href="#" className="ml-auto inline-block text-sm text-primary hover:underline">
                Parolni unutdingizmi?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-background/50 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">
                  {showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                </span>
              </button>
            </div>
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 bg-transparent border-t-0 pb-6 pt-2">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
            Kirish
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Hisobingiz yo'qmi?{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Administratorga murojaat qiling
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

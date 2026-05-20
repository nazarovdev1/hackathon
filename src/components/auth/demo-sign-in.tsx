"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const accounts = {
  STUDENT: { email: "student@edumetric.uz", password: "student123", callbackUrl: "/dashboard/student" },
  ADMIN: { email: "admin@edumetric.uz", password: "admin123", callbackUrl: "/dashboard/admin" },
  MENTOR: { email: "mentor@edumetric.uz", password: "mentor123", callbackUrl: "/dashboard/mentor" },
} as const;

type AccountKey = keyof typeof accounts;

export function DemoSignIn() {
  const [role, setRole] = useState<AccountKey>("STUDENT");
  const account = accounts[role];

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Role Access</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Select value={role} onValueChange={(value) => setRole(value as AccountKey)}>
          <SelectTrigger>
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MENTOR">Mentor</SelectItem>
          </SelectContent>
        </Select>
        <Input readOnly value={account.email} />
        <Input readOnly value={account.password} type="password" />
        <Button
          onClick={() =>
            signIn("credentials", {
              email: account.email,
              password: account.password,
              callbackUrl: account.callbackUrl,
            })
          }
        >
          <LogIn className="h-4 w-4" /> Sign in
        </Button>
      </CardContent>
    </Card>
  );
}

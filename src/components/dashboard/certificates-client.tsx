"use client";

import React, { useState, useEffect } from "react";
import type { StudentAnalytics } from "@/services/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Award, Upload, CheckCircle2, Clock, AlertCircle, FileText, PlusCircle } from "lucide-react";
import { MotionPanel } from "@/components/providers/motion-panel";

type Achievement = {
  title: string;
  score: number;
  category: string;
  status: "APPROVED" | "PENDING";
  dateAdded: string;
};

export function CertificatesClient({ student }: { student: StudentAnalytics }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Academic");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize achievements from student prop
  useEffect(() => {
    if (student) {
      const initial = student.achievements.map((item) => ({
        title: item.title,
        score: item.score,
        category: item.category,
        status: "APPROVED" as const,
        dateAdded: "2026-04-10",
      }));
      setAchievements(initial);
    }
  }, [student]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setToastMessage(null);

    // Simulate server request delay
    setTimeout(() => {
      const newAchievement: Achievement = {
        title,
        category,
        score: 0, // Pending evaluation
        status: "PENDING",
        dateAdded: new Date().toISOString().split("T")[0],
      };

      setAchievements((prev) => [newAchievement, ...prev]);
      setTitle("");
      setCategory("Academic");
      setSelectedFile(null);
      setIsSubmitting(false);
      setToastMessage("Sertifikat muvaffaqiyatli yuklandi! Hozirda ko'rib chiqilmoqda.");
      
      // Clear toast after 4 seconds
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  // Calculate sum of approved scores
  const totalApprovedScore = achievements
    .filter((a) => a.status === "APPROVED")
    .reduce((sum, item) => sum + item.score, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Chap ustun: Yuklash va Ro'yxat */}
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <MotionPanel>
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-md text-sm font-medium">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </MotionPanel>
        )}

        {/* Yangi sertifikat yuklash */}
        <MotionPanel delay={0.05}>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Yangi sertifikat yuklash
              </CardTitle>
              <CardDescription>
                Erishgan yutuqlaringizni tasdiqlovchi sertifikat yoki hujjatlarni ushbu form orqali yuboring.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Yutuq / Hujjat nomi</Label>
                  <Input
                    id="title"
                    placeholder="Masalan: IELTS 7.5 sertifikati, Hackathon g'olibi"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Yo'nalish / Kategoriya</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <option value="Academic">Akademik faoliyat (Maqola, olimpiada)</option>
                    <option value="Innovation">Innovatsiya & Loyihalar (Hackathon, startap)</option>
                    <option value="Language">Chet tillari (IELTS, CEFR)</option>
                    <option value="Social">Ijtimoiy faoliyat (Volontyorlik)</option>
                    <option value="Sport">Sport yutuqlari</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="file">Hujjat fayli (PDF yoki Rasm)</Label>
                  <div className="border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors rounded-md p-6 flex flex-col items-center justify-center cursor-pointer relative bg-secondary/10">
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isSubmitting}
                    />
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Faylni sudrab joylashtiring yoki tanlang</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG (maksimal 5MB)</p>
                    {selectedFile && (
                      <div className="mt-3 flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs px-2.5 py-1 rounded">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting || !title.trim()}>
                  {isSubmitting ? (
                    <>Fayl yuborilmoqda...</>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" /> Sertifikatni jo'natish
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </MotionPanel>

        {/* Sertifikatlar Ro'yxati */}
        <MotionPanel delay={0.1}>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Mening sertifikatlarim</CardTitle>
              <CardDescription>Yuklangan va tasdiqlanish jarayonidagi yutuqlaringiz ro'yxati.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Award className="h-10 w-10 mx-auto opacity-30 mb-2" />
                  Hozircha yuklangan yutuqlar yo'q
                </div>
              ) : (
                achievements.map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="flex items-start justify-between p-4 border border-border/40 rounded-md bg-secondary/10 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{item.category}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{item.dateAdded}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1.5 flex-shrink-0">
                      {item.status === "APPROVED" ? (
                        <>
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0">
                            <CheckCircle2 className="h-3 w-3 mr-1 inline" /> Tasdiqlangan
                          </Badge>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+{item.score} ball</span>
                        </>
                      ) : (
                        <>
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] px-1.5 py-0">
                            <Clock className="h-3 w-3 mr-1 inline" /> Ko'rilmoqda
                          </Badge>
                          <span className="text-xs text-muted-foreground font-semibold">Baholanmoqda</span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </MotionPanel>
      </div>

      {/* O'ng ustun: Qo'llanma va Statistika */}
      <div className="space-y-6">
        {/* Yutuqlar Statistikasi */}
        <MotionPanel delay={0.15}>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Statistika</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-sm text-muted-foreground">Jami yuklangan sertifikatlar</span>
                <span className="text-lg font-bold">{achievements.length} ta</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-sm text-muted-foreground">Tasdiqlangan yutuqlar</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {achievements.filter((a) => a.status === "APPROVED").length} ta
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-sm text-muted-foreground">Ko'rib chiqilmoqda</span>
                <span className="text-lg font-bold text-amber-500">
                  {achievements.filter((a) => a.status === "PENDING").length} ta
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-semibold">Qo'shimcha reyting ballari</span>
                <span className="text-xl font-bold text-primary">+{totalApprovedScore} ball</span>
              </div>
            </CardContent>
          </Card>
        </MotionPanel>

        {/* Qo'llanma */}
        <MotionPanel delay={0.2}>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Sertifikat yuklash qoidalari
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                1. <strong>Faqat shaxsiy yutuqlar:</strong> Yuklanadigan hujjat aynan sizning nomingizga yozilgan va joriy o'quv yili davomida olingan bo'lishi lozim.
              </p>
              <p>
                2. <strong>Sifat va format:</strong> Hujjatlar aniq o'qiladigan PDF yoki tasvir (JPEG, PNG) formatida, o'lchami 5MB dan oshmagan holda yuklanishi kerak.
              </p>
              <p>
                3. <strong>Ko'rib chiqish muddati:</strong> Adminlar va tyutorlar tomonidan sertifikatlar 24-48 soat davomida tekshiriladi va tasdiqlansa, reytingingizga qo'shimcha ball sifatida qo'shiladi.
              </p>
              <p>
                4. <strong>Notog'ri ma'lumot:</strong> Soxta yoki noto'g'ri hujjat taqdim etish reyting ballarining kamayishiga (jarima) sabab bo'lishi mumkin.
              </p>
            </CardContent>
          </Card>
        </MotionPanel>
      </div>
    </div>
  );
}

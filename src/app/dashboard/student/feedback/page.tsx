import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { students } from "@/services/mock-data";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MessageSquare, Star, Calendar, StarHalf, Heart, CheckCircle2 } from "lucide-react";
import { MotionPanel } from "@/components/providers/motion-panel";

export const metadata = {
  title: "Mentor Feedback - PDP METRIC",
  description: "Mentor va tyutorlar tomonidan berilgan baholar hamda fikr-mulohazalar.",
};

type FeedbackItem = {
  id: string;
  mentorName: string;
  role: "Java Mentor" | "React Mentor" | "Tyutor" | "Coordinator" | "Discipline Inspector";
  date: string;
  subject: string;
  grade: number; // Out of 5
  score: number; // Added to KPI
  comment: string;
  category: "Assignment" | "Activity" | "Tutor" | "Discipline";
};

// Mock feedbacks linked to student index
const mockFeedbacks: Record<string, FeedbackItem[]> = {
  "stu_001": [
    {
      id: "f1",
      mentorName: "Rustam Qodirov",
      role: "Java Mentor",
      date: "2026-05-18",
      subject: "Backend Spring Boot & Database Loyihasi",
      grade: 5.0,
      score: 15,
      comment: "Loyiha arxitekturasi juda yaxshi tuzilgan. JPA relation-lardan to'g'ri foydalanilgan va transaction management mukammal ishlaydi. Clean code standartlariga 100% javob beradi. Ajoyib natija!",
      category: "Assignment",
    },
    {
      id: "f2",
      mentorName: "Dilfuza Alimova",
      role: "Tyutor",
      date: "2026-05-12",
      subject: "Faollik va jamoaviy ish",
      grade: 4.8,
      score: 4,
      comment: "Madina darslarda juda faol va guruh sardori sifatida boshqalarni ham doim rag'batlantirib keladi. Soft-skills bo'yicha yuqori natijalar ko'rsatmoqda. Faqat darslarga biroz vaqtliroq kelish tavsiya etiladi.",
      category: "Tutor",
    },
    {
      id: "f3",
      mentorName: "Sardor Salimov",
      role: "Discipline Inspector",
      date: "2026-05-05",
      subject: "Akademik intizom va tartib-qoidalar",
      grade: 5.0,
      score: 8,
      comment: "PDP akademiyasidagi barcha tartib va qoidalarga mukammal darajada rioya qilingan. Dars qoldirish yoki kechikish holatlari deyarli kuzatilmadi.",
      category: "Discipline",
    }
  ],
  "stu_002": [
    {
      id: "f4",
      mentorName: "Rustam Qodirov",
      role: "Java Mentor",
      date: "2026-05-15",
      subject: "Spring Core & MVC",
      grade: 3.5,
      score: 10,
      comment: "Loyiha o'z vaqtida topshirilmadi. Dependency Injection va Bean scopes mavzulari bo'yicha bilimingizni qayta ko'rib chiqishingiz kerak. Kod takrorlanishi juda ko'p.",
      category: "Assignment",
    },
    {
      id: "f5",
      mentorName: "Dilfuza Alimova",
      role: "Tyutor",
      date: "2026-05-10",
      subject: "Tashqi faollik",
      grade: 3.0,
      score: 2,
      comment: "Tyutorlik darslariga tayyorgarliksiz keladi, so'ralgan hisobotlarni kechiktirib topshiradi. Akademiyadan tashqari loyihalarda faollik ko'rsatmadi.",
      category: "Tutor",
    }
  ],
  "stu_003": [
    {
      id: "f6",
      mentorName: "Nozima Karimova",
      role: "React Mentor",
      date: "2026-05-19",
      subject: "Next.js & State Management Project",
      grade: 5.0,
      score: 14,
      comment: "Komponentlar mukammal darajada bo'lingan va Tailwind CSS yordamida responsive dizayn to'liq ta'minlangan. Custom hook-lardan va Context API dan juda o'rinli foydalanilgan. Tabriklayman!",
      category: "Assignment",
    },
    {
      id: "f7",
      mentorName: "Dilfuza Alimova",
      role: "Tyutor",
      date: "2026-05-14",
      subject: "Darsga qatnashish va faollik",
      grade: 5.0,
      score: 5,
      comment: "Guruhning eng namunali va intizomli talabalaridan biri. Hamma topshiriqlarni eng birinchilardan bo'lib yakunlaydi. Darsdan tashqari tadbirlarni tashkil etishda faol yordam berdi.",
      category: "Tutor",
    }
  ]
};

export default async function StudentFeedbackPage() {
  const session = await getServerSession(authOptions);
  const currentStudent = students.find((s) => s.email === session?.user?.email) || students[0];
  const feedbacks = mockFeedbacks[currentStudent.id] || [];

  const averageGrade = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, item) => sum + item.grade, 0) / feedbacks.length).toFixed(1)
    : "N/A";

  const totalScoreAdded = feedbacks.reduce((sum, item) => sum + item.score, 0);

  // Render Stars function
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star className="h-4 w-4 fill-amber-400 text-amber-400" key={i} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<StarHalf className="h-4 w-4 fill-amber-400 text-amber-400" key="half" />);
      } else {
        stars.push(<Star className="h-4 w-4 text-muted-foreground/30" key={i} />);
      }
    }
    return stars;
  };

  return (
    <DashboardShell title="Mentor Feedback va Baholari" eyebrow="Ustozlar fikrlari">
      <div className="grid gap-6">
        
        {/* Yuqori qism: Statistika kartalari */}
        <div className="grid gap-5 md:grid-cols-3">
          <MotionPanel delay={0.05}>
            <Card className="glass-panel">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">O'rtacha baho</p>
                  <h3 className="text-3xl font-bold mt-1 text-foreground">{averageGrade} / 5.0</h3>
                  <div className="flex items-center gap-1 mt-2">
                    {renderStars(Number(averageGrade) || 0)}
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Star className="h-6 w-6 fill-current" />
                </div>
              </CardContent>
            </Card>
          </MotionPanel>

          <MotionPanel delay={0.1}>
            <Card className="glass-panel">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jami baholanganlar</p>
                  <h3 className="text-3xl font-bold mt-1 text-foreground">{feedbacks.length} ta</h3>
                  <p className="text-xs text-muted-foreground mt-2">Darslar, amaliyot va intizom</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                  <MessageSquare className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </MotionPanel>

          <MotionPanel delay={0.15}>
            <Card className="glass-panel">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Olingan jami KPI balli</p>
                  <h3 className="text-3xl font-bold mt-1 text-foreground">+{totalScoreAdded} ball</h3>
                  <p className="text-xs text-muted-foreground mt-2">Reyting jadvaliga qo'shilgan</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </MotionPanel>
        </div>

        {/* Fikrlar ro'yxati */}
        <MotionPanel delay={0.2}>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Tafsilotli fikr-mulohazalar</h2>
            
            {feedbacks.length === 0 ? (
              <Card className="glass-panel">
                <CardContent className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto opacity-30 mb-3" />
                  Sizga hali mentor yoki tyutorlar tomonidan feedback berilmagan.
                </CardContent>
              </Card>
            ) : (
              feedbacks.map((item, idx) => (
                <Card key={item.id} className="glass-panel relative overflow-hidden transition-all hover:border-border">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{item.mentorName}</p>
                          <p className="text-xs text-muted-foreground">{item.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs font-semibold">
                          {item.category}
                        </Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                          +{item.score} KPI Ball
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        {item.subject}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-medium">Baho: {item.grade} / 5.0</span>
                        <div className="flex items-center gap-0.5 ml-1">
                          {renderStars(item.grade)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/20 border border-border/40 rounded-lg p-4 text-sm leading-relaxed text-muted-foreground">
                      "{item.comment}"
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Baholangan sana: {item.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </MotionPanel>

      </div>
    </DashboardShell>
  );
}

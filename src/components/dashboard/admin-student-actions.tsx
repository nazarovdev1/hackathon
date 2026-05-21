"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Award, FileCheck2, Loader2, MoreHorizontal, ShieldX, TriangleAlert, Wrench } from "lucide-react";
import {
  assignRecoveryTask,
  approveAchievement,
  awardAdminBonus,
  createGrantDecision,
  createPenalty,
  expelStudent,
} from "@/actions/grant-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GrantCalculationResult, StudentStatus } from "@/types/grant";

type AdminStudentActionRow = {
  id: string;
  name: string;
  status: StudentStatus;
  grant: GrantCalculationResult;
  achievements: {
    id: string;
    title: string;
    score: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
  }[];
};

type DialogKey = "bonus" | "penalty" | "recovery" | "grant" | "achievement" | "expel";
type ActionStatus = { kind: "success" | "error"; message: string };

export function AdminStudentActions({ student }: { student: AdminStudentActionRow }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogKey | null>(null);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<ActionStatus | null>(null);

  const [bonusScore, setBonusScore] = useState(1);
  const [bonusReason, setBonusReason] = useState("Admin tomonidan qo'shimcha bonus ball");
  const [penaltyType, setPenaltyType] = useState<"ATTENDANCE" | "ASSIGNMENT" | "DISCIPLINE" | "ACADEMIC" | "OTHER">(
    "DISCIPLINE",
  );
  const [penaltyScore, setPenaltyScore] = useState(1);
  const [penaltyReason, setPenaltyReason] = useState("Nizom bo'yicha qoidabuzarlik");
  const [recoveryTitle, setRecoveryTitle] = useState("Recovery vazifasi");
  const [recoveryDescription, setRecoveryDescription] = useState("Qo'shimcha topshiriq orqali natijani tiklash.");
  const [recoveryScore, setRecoveryScore] = useState(1);
  const [recoveryDeadline, setRecoveryDeadline] = useState(defaultDeadline());
  const [decisionStatus, setDecisionStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [decisionReason, setDecisionReason] = useState("Admin qarori");
  const pendingAchievements = student.achievements.filter((achievement) => achievement.status === "PENDING");
  const [achievementId, setAchievementId] = useState(pendingAchievements[0]?.id ?? "");
  const [achievementScore, setAchievementScore] = useState(1);
  const [achievementStatus, setAchievementStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [expelReason, setExpelReason] = useState("O'qishdan chetlashtirish bo'yicha admin qarori");

  const disabled = student.status === "EXPELLED";
  const finalScore = useMemo(() => Number(student.grant.finalScore.toFixed(2)), [student.grant.finalScore]);

  function runAction(action: () => Promise<unknown>, successMessage: string) {
    setStatus(null);
    startTransition(async () => {
      try {
        await action();
        setDialog(null);
        setStatus({ kind: "success", message: successMessage });
        router.refresh();
      } catch (error) {
        setStatus({ kind: "error", message: error instanceof Error ? error.message : "Amal bajarilmadi." });
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {status && (
        <span className={status.kind === "success" ? "text-xs text-emerald-400" : "text-xs text-rose-400"}>
          {status.message}
        </span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={disabled} onClick={() => setDialog("bonus")}>
            <Award className="mr-2 h-4 w-4" /> Bonus ball
          </DropdownMenuItem>
          <DropdownMenuItem disabled={disabled} onClick={() => setDialog("penalty")}>
            <TriangleAlert className="mr-2 h-4 w-4" /> Jarima
          </DropdownMenuItem>
          <DropdownMenuItem disabled={disabled} onClick={() => setDialog("recovery")}>
            <Wrench className="mr-2 h-4 w-4" /> Recovery
          </DropdownMenuItem>
          <DropdownMenuItem disabled={disabled} onClick={() => setDialog("grant")}>
            <FileCheck2 className="mr-2 h-4 w-4" /> Grant qarori
          </DropdownMenuItem>
          <DropdownMenuItem disabled={disabled || pendingAchievements.length === 0} onClick={() => setDialog("achievement")}>
            <Award className="mr-2 h-4 w-4" /> Achievement
          </DropdownMenuItem>
          <DropdownMenuItem disabled={disabled} onClick={() => setDialog("expel")}>
            <ShieldX className="mr-2 h-4 w-4" /> Chetlashtirish
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialog === "bonus"} onOpenChange={(open) => setDialog(open ? "bonus" : null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Bonus ball berish</DialogTitle>
            <DialogDescription>{student.name} uchun auditli admin bonus yozuvi yaratiladi.</DialogDescription>
          </DialogHeader>
          <FormShell>
            <Field label="Bonus ball">
              <Input type="number" min={0.5} max={20} step={0.5} value={bonusScore} onChange={(event) => setBonusScore(Number(event.target.value))} />
            </Field>
            <TextareaField label="Sabab" value={bonusReason} onChange={setBonusReason} />
            <DialogFooter>
              <Button
                type="button"
                disabled={isPending || bonusScore < 0.5 || !bonusReason.trim()}
                onClick={() =>
                  runAction(
                    () => awardAdminBonus({ studentId: student.id, score: bonusScore, reason: bonusReason }),
                    "Bonus ball qo'shildi.",
                  )
                }
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
                Saqlash
              </Button>
            </DialogFooter>
          </FormShell>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "penalty"} onOpenChange={(open) => setDialog(open ? "penalty" : null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Jarima berish</DialogTitle>
            <DialogDescription>Jarima KPI qayta hisoblanishiga ta'sir qiladi.</DialogDescription>
          </DialogHeader>
          <FormShell>
            <Field label="Jarima turi">
              <select
                value={penaltyType}
                onChange={(event) => setPenaltyType(event.target.value as typeof penaltyType)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="ATTENDANCE">Davomat</option>
                <option value="ASSIGNMENT">Topshiriq</option>
                <option value="DISCIPLINE">Intizom</option>
                <option value="ACADEMIC">Akademik</option>
                <option value="OTHER">Boshqa</option>
              </select>
            </Field>
            <Field label="Jarima ball">
              <Input type="number" min={1} max={20} step={1} value={penaltyScore} onChange={(event) => setPenaltyScore(Number(event.target.value))} />
            </Field>
            <TextareaField label="Sabab" value={penaltyReason} onChange={setPenaltyReason} />
            <DialogFooter>
              <Button
                type="button"
                disabled={isPending || penaltyScore < 1 || !penaltyReason.trim()}
                onClick={() =>
                  runAction(
                    () =>
                      createPenalty({
                        studentId: student.id,
                        type: penaltyType,
                        score: penaltyScore,
                        reason: penaltyReason,
                      }),
                    "Jarima saqlandi.",
                  )
                }
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <TriangleAlert className="h-4 w-4" />}
                Saqlash
              </Button>
            </DialogFooter>
          </FormShell>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "recovery"} onOpenChange={(open) => setDialog(open ? "recovery" : null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Recovery vazifa</DialogTitle>
            <DialogDescription>Talabaga recovery ball bilan vazifa biriktiriladi.</DialogDescription>
          </DialogHeader>
          <FormShell>
            <Field label="Vazifa nomi">
              <Input value={recoveryTitle} onChange={(event) => setRecoveryTitle(event.target.value)} />
            </Field>
            <TextareaField label="Tavsif" value={recoveryDescription} onChange={setRecoveryDescription} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Recovery ball">
                <Input type="number" min={1} max={10} step={0.5} value={recoveryScore} onChange={(event) => setRecoveryScore(Number(event.target.value))} />
              </Field>
              <Field label="Deadline">
                <Input type="date" value={recoveryDeadline} onChange={(event) => setRecoveryDeadline(event.target.value)} />
              </Field>
            </div>
            <DialogFooter>
              <Button
                type="button"
                disabled={isPending || recoveryScore < 1 || !recoveryTitle.trim() || !recoveryDeadline}
                onClick={() =>
                  runAction(
                    () =>
                      assignRecoveryTask({
                        studentId: student.id,
                        title: recoveryTitle,
                        description: recoveryDescription,
                        recoveryScore,
                        deadline: new Date(`${recoveryDeadline}T23:59:59`),
                      }),
                    "Recovery vazifa biriktirildi.",
                  )
                }
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wrench className="h-4 w-4" />}
                Biriktirish
              </Button>
            </DialogFooter>
          </FormShell>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "achievement"} onOpenChange={(open) => setDialog(open ? "achievement" : null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Achievement tekshirish</DialogTitle>
            <DialogDescription>Pending achievement tasdiqlanadi yoki rad etiladi.</DialogDescription>
          </DialogHeader>
          <FormShell>
            <Field label="Achievement">
              <select
                value={achievementId}
                onChange={(event) => setAchievementId(event.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {pendingAchievements.map((achievement) => (
                  <option key={achievement.id} value={achievement.id}>
                    {achievement.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Qaror">
              <select
                value={achievementStatus}
                onChange={(event) => setAchievementStatus(event.target.value as typeof achievementStatus)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="APPROVED">Tasdiqlash</option>
                <option value="REJECTED">Rad etish</option>
              </select>
            </Field>
            <Field label="Ball">
              <Input
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={achievementScore}
                onChange={(event) => setAchievementScore(Number(event.target.value))}
                disabled={achievementStatus === "REJECTED"}
              />
            </Field>
            <DialogFooter>
              <Button
                type="button"
                disabled={isPending || !achievementId}
                onClick={() =>
                  runAction(
                    () =>
                      approveAchievement({
                        achievementId,
                        score: achievementStatus === "REJECTED" ? 0 : achievementScore,
                        status: achievementStatus,
                      }),
                    "Achievement qarori saqlandi.",
                  )
                }
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
                Saqlash
              </Button>
            </DialogFooter>
          </FormShell>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "grant"} onOpenChange={(open) => setDialog(open ? "grant" : null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Grant qarori</DialogTitle>
            <DialogDescription>Joriy final score: {finalScore}. Qaror tarixga yoziladi.</DialogDescription>
          </DialogHeader>
          <FormShell>
            <Field label="Qaror">
              <select
                value={decisionStatus}
                onChange={(event) => setDecisionStatus(event.target.value as typeof decisionStatus)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="PENDING">Ko'rib chiqilmoqda</option>
                <option value="APPROVED">Tasdiqlash</option>
                <option value="REJECTED">Rad etish</option>
              </select>
            </Field>
            <TextareaField label="Sabab" value={decisionReason} onChange={setDecisionReason} />
            <DialogFooter>
              <Button
                type="button"
                disabled={isPending || !decisionReason.trim()}
                onClick={() =>
                  runAction(
                    () =>
                      createGrantDecision({
                        studentId: student.id,
                        semester: "2026 Spring",
                        status: decisionStatus,
                        finalScore,
                        reason: decisionReason,
                      }),
                    "Grant qarori saqlandi.",
                  )
                }
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck2 className="h-4 w-4" />}
                Saqlash
              </Button>
            </DialogFooter>
          </FormShell>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "expel"} onOpenChange={(open) => setDialog(open ? "expel" : null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>O'qishdan chetlashtirish</DialogTitle>
            <DialogDescription>{student.name} profili tarixda qoladi, login esa yopiladi.</DialogDescription>
          </DialogHeader>
          <FormShell>
            <TextareaField label="Sabab" value={expelReason} onChange={setExpelReason} />
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                disabled={isPending || !expelReason.trim()}
                onClick={() =>
                  runAction(
                    () => expelStudent({ studentId: student.id, reason: expelReason }),
                    "Talaba chetlashtirildi.",
                  )
                }
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldX className="h-4 w-4" />}
                Chetlashtirish
              </Button>
            </DialogFooter>
          </FormShell>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FormShell({ children }: { children: React.ReactNode }) {
  return (
    <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
      {children}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="min-h-24 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </Field>
  );
}

function defaultDeadline() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

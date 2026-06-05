import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NavBar } from "../components/NavBar";
import { TextField } from "../components/ui/TextField";
import { Button } from "../components/ui/Button";
import { useCreateProject } from "../hooks/useProjects";
import { CATEGORIES, CATEGORY_LABELS, DIFFICULTIES, DIFFICULTY_LABELS } from "../lib/projectMeta";
import type { CreateProjectPayload } from "../types/project";

const schema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().min(10, "Tell us a bit more"),
  category: z.enum(CATEGORIES as [string, ...string[]]),
  difficulty: z.enum(DIFFICULTIES as [string, ...string[]]),
  duration: z.string().optional(),
  maxMembers: z.number().int().min(1).max(50),
  isRemote: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

export default function CreateProjectPage() {
  const createProject = useCreateProject();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { maxMembers: 5, isRemote: false, category: "HACKATHON", difficulty: "INTERMEDIATE" },
  });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.some((x) => x.toLowerCase() === s.toLowerCase())) setSkills([...skills, s]);
    setSkillInput("");
  };

  const onSubmit = (values: FormValues) => {
    const payload: CreateProjectPayload = {
      ...(values as CreateProjectPayload),
      requiredSkills: skills,
    };
    createProject.mutate(payload);
  };

  return (
    <div className="min-h-full">
      <NavBar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="font-display text-3xl font-bold">Start a project</h1>
        <p className="mt-1 text-ink/60">Describe what you’re building and who you need.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
          <TextField label="Title" placeholder="AI study buddy for finals" error={errors.title?.message} {...register("title")} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink/80">Description</label>
            <textarea
              {...register("description")}
              rows={5}
              placeholder="What's the goal? What will you build? What's the vibe?"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
            />
            {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink/80">Category</label>
              <select {...register("category")} className="rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-brand-500">
                {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink/80">Difficulty</label>
              <select {...register("difficulty")} className="rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-brand-500">
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Duration (optional)" placeholder="e.g. 2 weeks" {...register("duration")} />
            <TextField label="Max members" type="number" error={errors.maxMembers?.message} {...register("maxMembers", { valueAsNumber: true })} />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input type="checkbox" {...register("isRemote")} className="h-4 w-4 rounded" />
            This is a remote project
          </label>

          {/* Required skills */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink/80">Required skills</label>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="text-brand-600/60 hover:text-brand-700">×</button>
                </span>
              ))}
            </div>
            <div className="mt-1 flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="e.g. React, then press Enter"
                className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-brand-500"
              />
              <button type="button" onClick={addSkill} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Add</button>
            </div>
          </div>

          <Button type="submit" loading={createProject.isPending} className="mt-2 w-full">
            Create project
          </Button>
          {createProject.isError && <p className="text-sm text-red-500">Couldn’t create project. Check the fields and try again.</p>}
        </form>
      </main>
    </div>
  );
}

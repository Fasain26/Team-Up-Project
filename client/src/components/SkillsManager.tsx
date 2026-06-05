import { useState } from "react";
import type { Skill } from "../types/profile";
import { useAddSkill, useRemoveSkill, useSkillCatalog } from "../hooks/useProfile";

export function SkillsManager({ skills }: { skills: Skill[] }) {
  const [name, setName] = useState("");
  const { data: catalog } = useSkillCatalog();
  const addSkill = useAddSkill();
  const removeSkill = useRemoveSkill();

  const userSkillNames = new Set(skills.map((s) => s.name.toLowerCase()));

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed || userSkillNames.has(trimmed.toLowerCase())) {
      setName("");
      return;
    }
    addSkill.mutate(trimmed, { onSuccess: () => setName("") });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 && <span className="text-sm text-ink/40">No skills yet.</span>}
        {skills.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700"
          >
            {s.name}
            <button
              onClick={() => removeSkill.mutate(s.id)}
              className="text-brand-600/60 hover:text-brand-700"
              aria-label={`Remove ${s.name}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          list="skill-catalog"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          placeholder="Add a skill (e.g. React)…"
          className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
        />
        <datalist id="skill-catalog">
          {catalog?.map((s) => <option key={s.id} value={s.name} />)}
        </datalist>
        <button
          onClick={handleAdd}
          disabled={addSkill.isPending}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}

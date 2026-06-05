import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useProfile, useUpdateProfile, useUploadAvatar } from "../hooks/useProfile";
import { SkillsManager } from "../components/SkillsManager";
import { TextField } from "../components/ui/TextField";
import { Button } from "../components/ui/Button";
import type { UpdateProfilePayload } from "../types/profile";

type FormValues = {
  fullName: string;
  bio: string;
  university: string;
  major: string;
  graduationYear?: number;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
};

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>();

  if (isLoading) return <Centered>Loading profile…</Centered>;
  if (isError || !profile) return <Centered>Couldn’t load your profile.</Centered>;

  const startEditing = () => {
    reset({
      fullName: profile.fullName,
      bio: profile.bio ?? "",
      university: profile.university ?? "",
      major: profile.major ?? "",
      graduationYear: profile.graduationYear ?? undefined,
      linkedinUrl: profile.linkedinUrl ?? "",
      githubUrl: profile.githubUrl ?? "",
      websiteUrl: profile.websiteUrl ?? "",
    });
    setEditing(true);
  };

  const onSubmit = (values: FormValues) => {
    const payload: UpdateProfilePayload = {
      ...values,
      graduationYear: values.graduationYear ? Number(values.graduationYear) : undefined,
    };
    updateProfile.mutate(payload, { onSuccess: () => setEditing(false) });
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/dashboard" className="text-sm text-ink/50 hover:text-ink">
          ← Dashboard
        </Link>
        {!editing && <Button onClick={startEditing}>Edit profile</Button>}
      </div>

      {/* Header: avatar + identity */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="h-24 w-24 overflow-hidden rounded-2xl bg-brand-100 ring-1 ring-black/5">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-brand-600">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadAvatar.isPending}
            className="absolute -bottom-2 -right-2 rounded-full bg-ink px-3 py-1 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {uploadAvatar.isPending ? "…" : "Change"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">{profile.fullName}</h1>
          <p className="text-ink/60">{profile.email}</p>
        </div>
      </div>

      {uploadAvatar.isError && (
        <p className="mt-3 text-sm text-red-500">
          Avatar upload failed — is Cloudinary configured on the server?
        </p>
      )}

      {/* Body */}
      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 flex flex-col gap-4">
          <TextField label="Full name" {...register("fullName")} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink/80">Bio</label>
            <textarea
              {...register("bio")}
              rows={3}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40"
              placeholder="A sentence about what you build…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="University" {...register("university")} />
            <TextField label="Major" {...register("major")} />
          </div>
          <TextField label="Graduation year" type="number" {...register("graduationYear")} />
          <TextField label="LinkedIn URL" placeholder="https://…" {...register("linkedinUrl")} />
          <TextField label="GitHub URL" placeholder="https://…" {...register("githubUrl")} />
          <TextField label="Website URL" placeholder="https://…" {...register("websiteUrl")} />

          <div className="mt-2 flex gap-3">
            <Button type="submit" loading={updateProfile.isPending}>
              Save changes
            </Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
          {updateProfile.isError && (
            <p className="text-sm text-red-500">Couldn’t save — check the URL fields are valid.</p>
          )}
        </form>
      ) : (
        <div className="mt-10 space-y-8">
          {profile.bio && <p className="text-ink/80">{profile.bio}</p>}

          <dl className="grid gap-4 sm:grid-cols-2">
            <Detail label="University" value={profile.university} />
            <Detail label="Major" value={profile.major} />
            <Detail label="Graduation" value={profile.graduationYear?.toString()} />
          </dl>

          <div className="flex flex-wrap gap-4 text-sm">
            {profile.linkedinUrl && <ExtLink href={profile.linkedinUrl}>LinkedIn</ExtLink>}
            {profile.githubUrl && <ExtLink href={profile.githubUrl}>GitHub</ExtLink>}
            {profile.websiteUrl && <ExtLink href={profile.websiteUrl}>Website</ExtLink>}
          </div>

          <section>
            <h2 className="mb-3 font-display text-lg font-bold">Skills</h2>
            <SkillsManager skills={profile.skills} />
          </section>
        </div>
      )}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full items-center justify-center text-ink/50">{children}</div>;
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink/40">{label}</dt>
      <dd className="mt-0.5 text-ink/80">{value || "—"}</dd>
    </div>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-brand-700 hover:underline"
    >
      {children} ↗
    </a>
  );
}

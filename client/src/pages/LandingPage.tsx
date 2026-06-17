import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-full">
      {/* Top bar */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl font-bold">TeamUp</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-ink/70 hover:text-ink">
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 text-center sm:pt-24">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
          For students, by students
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
          Find the people who <span className="text-brand-600">finish what you start.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink/60">
          TeamUp matches you with students by skill — so you can build teams for
          hackathons, startups, research, and competitions, and actually ship.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/register"
            className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Create your profile
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-black/10 px-6 py-3 font-semibold transition hover:bg-black/5"
          >
            I have an account
          </Link>
        </div>
      </section>

      {/* Feature strip */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <Feature
            title="Skill-based matching"
            body="Every project shows your fit as a percentage, computed from the skills you list against what the team needs."
          />
          <Feature
            title="Apply in one click"
            body="Send a note, get accepted, and you're on the team. Owners review applicants with their skills at a glance."
          />
          <Feature
            title="Built for real teams"
            body="Projects across startups, hackathons, research and more — with roles, members, and a dashboard that tracks it all."
          />
        </div>
      </section>

      <footer className="border-t border-black/5 py-8 text-center text-sm text-ink/40">
        TeamUp — a student collaboration platform.
      </footer>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-ink/60">{body}</p>
    </div>
  );
}

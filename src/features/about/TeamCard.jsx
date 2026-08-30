import Reveal from '../../components/shared/Reveal.jsx';

/** Team member card — monogram avatar (initials), name, role, one-liner. */
export default function TeamCard({ member, index = 0 }) {
  return (
    <Reveal delay={(index % 3) * 0.07}>
      <div className="group h-full rounded-xl border border-white/8 bg-base-200 p-6 transition-colors duration-300 hover:border-white/20">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-white/[0.07] to-transparent font-display text-sm font-bold tracking-[0.12em] text-base-content/90"
          >
            {member.initials}
          </span>
          <div>
            <h3 className="font-display text-base font-bold tracking-tight">{member.name}</h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{member.role}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">{member.focus}</p>
      </div>
    </Reveal>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="mb-3 text-sm font-bold uppercase text-bayanihan-green">{eyebrow}</p> : null}
      <h1 className="text-3xl font-bold text-bayanihan-ink sm:text-4xl">{title}</h1>
      {copy ? <p className="mt-4 text-base leading-7 text-bayanihan-muted">{copy}</p> : null}
    </div>
  );
}

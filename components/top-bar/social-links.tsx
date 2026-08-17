const links = [
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
  { label: "Email", href: "#" },
];

export function SocialLinks() {
  return (
    <div className="glass flex items-center gap-1 rounded-full px-2 py-1.5">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-utility uppercase text-cream-dim transition hover:text-cream"
        >
          {link.label[0]}
        </a>
      ))}
    </div>
  );
}

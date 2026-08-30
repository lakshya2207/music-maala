import { HamburgerMenu } from "./hamburger-menu";
import { ListenerCount } from "./listener-count";
import { SocialLinks } from "./social-links";
import Link from "next/link";

export function TopBar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between safe-t safe-l safe-r px-2.5 sm:px-4 py-1.5">
      {/* Left side: Hamburger Menu & Listener Count */}
      <div className="pointer-events-auto flex items-center gap-2">
        <HamburgerMenu />
        <ListenerCount />
      </div>

      {/* Right side: Quick Raags link + GitHub */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/raags"
          className="glass flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-cream/90 hover:text-amber hover:border-amber/40 transition-all active:scale-95"
          title="Explore Classical Raags & 8 Prahars"
        >
          <span className="text-xs">🎼</span>
          <span className="hidden xs:inline">राग & प्रहर</span>
          <span className="xs:hidden">राग</span>
        </Link>
        <SocialLinks />
      </div>
    </header>
  );
}

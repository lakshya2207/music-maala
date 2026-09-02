import { FlowerShower } from "./flower-shower";
import { ListenerCount } from "./listener-count";
import { Clock } from "./clock";

export function TopBar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between safe-t safe-l safe-r px-2.5 sm:px-4 py-1.5">
      {/* Left side: Sacred Flower Shower Offering & Live Listener Count (No Navigation) */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
        <FlowerShower />
        <ListenerCount />
      </div>

      {/* Right side: Live Indian Standard Time (IST) Clock */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
        <Clock />
      </div>
    </header>
  );
}

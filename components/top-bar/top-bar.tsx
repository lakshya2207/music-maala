import { Clock } from "./clock";
import { ListenerCount } from "./listener-count";
import { SocialLinks } from "./social-links";

export function TopBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-10 flex items-start justify-between safe-t safe-l safe-r px-4">
      <div className="pointer-events-auto">
        <Clock />
      </div>
      <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2">
        <ListenerCount />
      </div>
      <div className="pointer-events-auto">
        <SocialLinks />
      </div>
    </div>
  );
}

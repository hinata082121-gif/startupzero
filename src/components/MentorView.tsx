import type { GameState } from "../gameState";
import { SidebarAd } from "./AdPanels";
import MentorPanel from "./MentorPanel";

type MentorViewProps = {
  state: GameState;
  isPremiumUser: boolean;
};

export default function MentorView({ state, isPremiumUser }: MentorViewProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <MentorPanel state={state} isPremiumUser={isPremiumUser} />
      <SidebarAd />
    </div>
  );
}

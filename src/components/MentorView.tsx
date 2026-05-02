import type { GameState } from "../gameState";
import { SidebarAd } from "./AdPanels";
import MentorPanel from "./MentorPanel";

type MentorViewProps = {
  state: GameState;
};

export default function MentorView({ state }: MentorViewProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <MentorPanel state={state} />
      <SidebarAd />
    </div>
  );
}

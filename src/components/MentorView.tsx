import type { GameState } from "../gameState";
import MentorPanel from "./MentorPanel";

type MentorViewProps = {
  state: GameState;
};

export default function MentorView({ state }: MentorViewProps) {
  return (
    <div className="space-y-4">
      <MentorPanel state={state} />
    </div>
  );
}

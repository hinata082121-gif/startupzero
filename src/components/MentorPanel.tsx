import AIMentorPanel from "./AIMentorPanel";
import type { GameState } from "../gameState";

type MentorPanelProps = {
  state: GameState;
  isPremiumUser: boolean;
};

export default function MentorPanel({ state, isPremiumUser }: MentorPanelProps) {
  return <AIMentorPanel state={state} isPremiumUser={isPremiumUser} />;
}

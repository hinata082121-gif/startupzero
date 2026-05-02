import AIMentorPanel from "./AIMentorPanel";
import type { GameState } from "../gameState";

type MentorPanelProps = {
  state: GameState;
};

export default function MentorPanel({ state }: MentorPanelProps) {
  return <AIMentorPanel state={state} />;
}

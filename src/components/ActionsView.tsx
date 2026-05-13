import type { ActionType, GameState } from "../gameState";
import ActionPanel from "./ActionPanel";

type ActionsViewProps = {
  state: GameState;
  onAction: (action: ActionType) => void;
};

export default function ActionsView({ state, onAction }: ActionsViewProps) {
  return (
    <div className="space-y-4">
      <ActionPanel status={state.status} onAction={onAction} />
    </div>
  );
}

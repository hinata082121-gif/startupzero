import type { ActionType, GameState } from "../gameState";
import ActionPanel from "./ActionPanel";
import { RewardAd } from "./AdPanels";

type ActionsViewProps = {
  state: GameState;
  onAction: (action: ActionType) => void;
  onRewardAd: () => void;
};

export default function ActionsView({ state, onAction, onRewardAd }: ActionsViewProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <ActionPanel status={state.status} onAction={onAction} />
      <div className="space-y-4">
        <RewardAd status={state.status} watched={state.rewardAdWatched} onWatch={onRewardAd} />
      </div>
    </div>
  );
}

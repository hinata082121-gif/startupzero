import type { LogEntry } from "../gameState";
import EventLog from "./EventLog";

export default function LogView({ logs }: { logs: LogEntry[] }) {
  return <EventLog logs={logs} />;
}

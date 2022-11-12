import { h } from "preact";
import { useState } from "preact/compat";
import { useGameState } from "./state/state";
import { SendToServer } from "./server/serverTypes";
import { Router } from "./views/Router";
import { BaseLayout } from "./layouts/BaseLayout";

export function App() {
  const [send, setSend] = useState<SendToServer>(
    (type, data) =>
      new Promise(() =>
        console.error("not yet connected", {
          type,
          data,
        })
      )
  );
  const [state, updateEvent] = useGameState(send);

  return (
    <BaseLayout
      playerName={state.user.name}
      loadingMessage={state.loadingMessage}
      connectionStatus={state.connectionStatus}
    >
      <Router state={state} updateEvent={updateEvent} setSend={setSend} />
    </BaseLayout>
  );
}

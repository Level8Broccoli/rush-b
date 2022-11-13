import { h } from "preact";
import { useState } from "preact/compat";
import { useGameState } from "./state/state";
import { SendToServer } from "./api/ClientEventTypes";
import { Router } from "./views/Router";
import { BaseLayout } from "./layouts/BaseLayout";

export function App() {
  const [send, setSend] = useState<SendToServer>({
    send: () => {
      throw new Error("not yet connected", ...arguments);
    },
  });
  const [state, updateEvent] = useGameState(send);

  return (
    <BaseLayout
      playerName={state.user.name}
      loadingMessage={state.loadingMessage}
      connectionStatus={state.connectionStatus}
    >
      <Router state={state} updateGuiEvent={updateEvent} setSend={setSend} />
    </BaseLayout>
  );
}

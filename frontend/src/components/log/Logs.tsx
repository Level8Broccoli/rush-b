import { h } from "preact";
import { ConnectionStatus } from "../../api/ClientEventTypes";

type Props = {
  logs: string[];
  connectionStatus: ConnectionStatus;
};

export default function Logs(props: Props): JSX.Element {
  function getConnectionStatus(status: ConnectionStatus): string {
    switch (status) {
      case ConnectionStatus.CLOSED:
        return "Verbindung geschlossen";
      case ConnectionStatus.CONNECTING:
        return "Verbindung wird aufgebaut";
      case ConnectionStatus.OPEN:
        return "Verbindung offen";
      case ConnectionStatus.CLOSING:
        return "Verbindung wird geschlossen";
    }
  }

  return (
    <div>
      <h2>Logs</h2>
      <small>
        <strong>Status:</strong> {getConnectionStatus(props.connectionStatus)}
      </small>
      <ul>
        {props.logs.map((m) => (
          <li>{m}</li>
        ))}
      </ul>
    </div>
  );
}

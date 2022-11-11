import { h } from "preact";
import classes from "./BaseLayout.module.css";
import backgroundImg from "./img/background.png";
import { Loader } from "../components/general/Loader";
import { ConnectionStatus } from "../websocket/websocketTypes";
import { Icon } from "../components/general/Icon";

type Props = {
  playerName: string;
  children: JSX.Element;
  loadingMessage: string;
  connectionStatus: ConnectionStatus;
};

export function BaseLayout(props: Props): JSX.Element {
  const connectionStatus = (): JSX.Element => {
    switch (props.connectionStatus) {
      case ConnectionStatus.CLOSED:
        return (
          <Icon icon={"link-slash"} title={"Keine Verbinung zum Server."} />
        );
      case ConnectionStatus.CONNECTING:
        return <Icon icon={"spinner"} title={"Verbindung wird aufgebaut."} />;
      case ConnectionStatus.OPEN:
        return <Icon icon={"link"} title={"Verbinung zum Server aufgebaut."} />;
      case ConnectionStatus.CLOSING:
        return (
          <Icon icon={"spinner"} title={"Verbinung zum Server wird beendet."} />
        );
    }
  };
  return (
    <>
      <nav class="navbar has-background-danger-dark">
        <div class={classes.navbarContainer}>
          <h1 class="title has-text-white p-5">
            rush-b <em class="is-size-7">by Lena & Oliver</em>
          </h1>
          <div class={classes.navbarRight}>
            <h1 class="is-size-7 has-text-white p-5 has-text-right ">
              {props.playerName.trim().length > 0 ? "Spielername" : ""}
              <br />
              <span class="is-uppercase">{props.playerName}</span>
            </h1>
            <div className={`has-text-danger p-3 ${classes.connectionIcon}`}>
              {connectionStatus()}
            </div>
          </div>
        </div>
      </nav>
      <main style={`--bgImg: url(${backgroundImg})`}>{props.children}</main>
      <footer class="has-background-danger-dark has-text-white p-5">
        <small>2022 @ FFHS</small>
      </footer>
      {props.loadingMessage && <Loader label={props.loadingMessage} />}
    </>
  );
}

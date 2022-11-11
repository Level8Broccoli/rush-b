import { h } from "preact";
import classes from "./BaseLayout.module.css";
import backgroundImg from "./img/background.png";
import { Loader } from "../components/general/Loader";

type Props = {
  playerName: string;
  children: JSX.Element;
  loadingMessage: string;
};

export function BaseLayout(props: Props): JSX.Element {
  return (
    <>
      <nav class="navbar has-background-danger-dark">
        <div class={classes.navbarContainer}>
          <h1 class="title has-text-white p-5">
            rush-b <em class="is-size-7">by Lena & Oliver</em>
          </h1>
          <h1 class="is-size-7 has-text-white p-5 has-text-right ">
            {props.playerName.trim().length > 0 ? "Spielername" : ""}
            <br />
            <span class="is-uppercase">{props.playerName}</span>
          </h1>
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

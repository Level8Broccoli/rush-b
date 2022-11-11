import { h } from "preact";
import "./BaseLayout.module.css";
import backgroundImg from "./img/background.png";

type Props = {
  playerName: string;
  children: JSX.Element;
};

export function BaseLayout(props: Props): JSX.Element {
  return (
    <>
      <nav class="navbar has-background-danger-dark">
        <div class="navbar-start">
          <h1 class="title has-text-white p-5">
            rush-b <em class="is-size-7">by Lena & Oliver</em>
          </h1>
        </div>
        <div class="navbar-end">
          <h1 class="is-size-7 has-text-white p-5 has-text-right">
            <span class="">
              {props.playerName.trim().length > 0 ? "Spielername" : ""}
            </span>
            <br />
            <span class="is-uppercase">{props.playerName}</span>
          </h1>
        </div>
      </nav>
      <main style={`--bgImg: url(${backgroundImg})`}>{props.children}</main>
      <footer class="has-background-danger-dark has-text-white p-5">
        <small>2022 @ FFHS</small>
      </footer>
    </>
  );
}

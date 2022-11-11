import { h } from "preact";
import "./BaseLayout.module.css";
import backgroundImg from "./img/background.png";

type Props = {
  children: JSX.Element;
};

export function BaseLayout(props: Props): JSX.Element {
  return (
    <>
      <nav class="navbar has-background-danger-dark">
        <h1 class="title has-text-white p-5">
          rush-b <em class="is-size-7">by Lena & Oliver</em>
        </h1>
      </nav>
      <main style={`--bgImg: url(${backgroundImg})`}>{props.children}</main>
      <footer class="has-background-danger-dark has-text-white p-5">
        <small>2022 @ FFHS</small>
      </footer>
    </>
  );
}

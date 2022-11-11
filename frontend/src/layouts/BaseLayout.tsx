import { h } from "preact";
import "./BaseLayout.module.css";

type Props = {
  children: JSX.Element;
};

export function BaseLayout(props: Props): JSX.Element {
  return <div>{props.children}</div>;
}

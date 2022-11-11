import { h } from "preact";

type Props = {
  label: string;
  variant?: "black" | "ghost" | "light";
};

export function Button(props: Props): JSX.Element {
  const classes = ["button", props.variant ? "is-" + props.variant : ""].join(
    " "
  );
  return <button class={classes}>{props.label}</button>;
}

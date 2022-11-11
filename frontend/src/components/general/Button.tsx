import { h } from "preact";

type Props = {
  label: string;
  variant?: "black" | "ghost" | "light";
  onClick: () => void;
  size?: "md" | "sm";
};

export function Button(props: Props): JSX.Element {
  const classes = [
    "button",
    props.variant ? "is-" + props.variant : "",
    props.size === "sm" ? "is-small" : "",
  ].join(" ");

  return (
    <button class={classes} onClick={props.onClick}>
      {props.label}
    </button>
  );
}

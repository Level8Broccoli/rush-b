import { h } from "preact";

type Props = {
  icon: "link-slash" | "link" | "spinner";
  title: string;
};

export function Icon(props: Props): JSX.Element {
  return (
    <span class="icon" title={props.title}>
      <i class={`fa-sharp fa-solid fa-${props.icon}`}></i>
    </span>
  );
}

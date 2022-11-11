import { h } from "preact";

type Props = {
  icon: "link-slash" | "link" | "spinner";
  title: string;
};

export function Icon(props: Props): JSX.Element {
  return (
    <span className="icon" title={props.title}>
      <i className={`fa-sharp fa-solid fa-${props.icon}`}></i>
    </span>
  );
}

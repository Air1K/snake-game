import { FunctionComponent } from "react";
import styles from "./Button.module.scss";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
}

const Button: FunctionComponent<ButtonProps> = ({text, ...props}) => {
  return <button {...props} className={styles.button}>{text}</button>;
};

export default Button;

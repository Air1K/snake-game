import { FunctionComponent, useEffect, useState } from "react";
import Button from "../Button/Button";
import styles from "./ItemSetting.module.scss"

interface ItemSettingProps {
  label: string;
  value: string;
  onChange: (onEnd: () => void) => void;
}

const ItemSetting: FunctionComponent<ItemSettingProps> = ({
  label,
  value,
  onChange,
}) => {
    const [isPress, setIsPress] = useState(false)
    useEffect(() => {
      if (isPress) {
        onChange(() => {
          setIsPress(false)
        });
      }
    })
  return (
    <div className={styles.item}>
      <span style={{ marginRight: "10px" }}>{label}</span>

      <Button
        onClick={() => {
          setIsPress(!isPress)
        }}
        text={isPress ? "Нажмите на кнопку" : value}
      />
    </div>
  );
};

export default ItemSetting;

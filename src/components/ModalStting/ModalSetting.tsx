import { useState } from "react";
import { KeyBindings } from "../Area/Area";
import styles from "./ModalSetting.module.scss";
import ItemSetting from "../ItemSetting/ItemSetting";
interface SettingsModalProps {
  keyBindings: KeyBindings;
  onClose: () => void;
  onSave: (newBindings: KeyBindings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  keyBindings,
  onClose,
  onSave,
}) => {
  const [newBindings, setNewBindings] = useState<KeyBindings>(keyBindings);

  const handleChange = (key: keyof KeyBindings, onEnd: () => void) => {
    console.log(key);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.removeEventListener('keydown', handleKeyDown);
        onEnd();
      } else {
        setNewBindings((prevBindings) => ({
          ...prevBindings,
          [key]: e.key,
        }));
        window.removeEventListener('keydown', handleKeyDown);
        onEnd();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
  };

  const handleSubmit = () => {
    onSave(newBindings);
    onClose();
  };
  
  interface ItemSettingProps {
    id: "up" | "down" | "left" | "right";
    label: string;
    value: string;
  }

  const keySettings: ItemSettingProps[] = [
    {
      id: "up",
      label: "Вверх",
      value: newBindings.up,
    },
    {
      id: "down",
      label: "Вниз",
      value: newBindings.down,
    },
    {
      id: "left",
      label: "Влево",
      value: newBindings.left,
    },
    {
      id: "right",
      label: "Вправо",
      value: newBindings.right,
    },
  ];

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Настройки управления</h2>
        {keySettings.map((setting) => (
          <ItemSetting
            key={setting.id}
            label={setting.label}
            value={setting.value}
            onChange={(onEnd)=>handleChange(setting.id, onEnd)}
          />
        ))}
        {/* <label>
          Вверх:
          <input
            type="text"
            value={newBindings.up}
            onChange={(e) => handleChange(e, "up")}
          />
        </label>
        <label>
          Вниз:
          <input
            type="text"
            value={newBindings.down}
            onChange={(e) => handleChange(e, "down")}
          />
        </label>
        <label>
          <span style={{ marginRight: "10px" }}>Влево:</span>

          <Button text={newBindings.left} />
          <input
            type="text"
            value={newBindings.left}
            onChange={(e) => handleChange(e, "left")}
          />
        </label>
        <label>
          Вправо:
          <input
            type="text"
            value={newBindings.right}
            onChange={(e) => handleChange(e, "right")}
          />
        </label> */}
        <button onClick={handleSubmit}>Сохранить</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
};

export default SettingsModal;

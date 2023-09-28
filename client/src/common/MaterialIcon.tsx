import Icon from "../types/icons";

interface MaterialIconProps {
  icon: Icon;
  fill?: number;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  grade?: number;
  opticalSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function MaterialIcon(props: MaterialIconProps) {
  return (
    <span
      style={{
        ...props.style,
        fontVariationSettings: `'FILL' ${props.fill || 0}, 'wght' ${
          props.weight || 400
        }, 'GRAD' ${props.grade || 0}, 'opsz' ${props.grade || 48}`,
      }}
      className={`material-symbols-outlined ${props.className}`}
    >
      {props.icon}
    </span>
  );
}

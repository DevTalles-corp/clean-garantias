import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  color: string;
}

export function SearchIcon({ color }: Props) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Circle cx={7} cy={7} r={5.2} stroke={color} strokeWidth={1.6} />
      <Path d="M11 11l3.5 3.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function BackIcon({ color }: Props) {
  return (
    <Svg width={9} height={14} viewBox="0 0 9 14" fill="none">
      <Path
        d="M7.5 1.5L2 7l5.5 5.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from '../../theme/index.ts';

interface SearchOutlineIconProps {
  size?: number;
  color?: string;
}

export const SearchOutlineIcon: React.FC<SearchOutlineIconProps> = (props: SearchOutlineIconProps) => {
  const theme = useTheme();
  const iconColor = props.color || theme.colors.textSecondary;

  return (
<Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill={iconColor}
      d="M17.89 17.86c1.513-2.194 2.649-5.603 2.356-8.305-.294-2.702-1.536-5.186-3.48-6.956-1.942-1.77-4.443-2.696-7-2.591C7.207.113 4.78 1.24 2.971 3.164 1.162 5.087.104 7.666.007 10.384c-.096 2.718.776 5.374 2.443 7.438 1.668 2.063 4.007 3.381 6.55 3.691 2.543.31 5.75-.898 7.813-2.507h-.001c.047.066.097.13.153.19l4.472 4.179c.293.311.69.486 1.105.487.414 0 .164.31.457 0 .293-.312 0-.045 0-.486 0-.44-.164-.862-.457-1.174l-4.472-4.178a1.577 1.577 0 0 0-.18-.165Zm.861-7.071c0 1.199-.222 2.386-.654 3.494a9.187 9.187 0 0 1-1.863 2.963 8.58 8.58 0 0 1-2.788 1.979 8.156 8.156 0 0 1-3.288.695 8.157 8.157 0 0 1-3.289-.695 8.58 8.58 0 0 1-2.788-1.98 9.19 9.19 0 0 1-1.863-2.962 9.629 9.629 0 0 1-.654-3.494c0-2.422.905-4.745 2.517-6.457 1.612-1.713 3.797-2.675 6.077-2.675 2.279 0 4.465.962 6.076 2.675 1.612 1.712 2.517 4.035 2.517 6.457Z"
    />
  </Svg>
  );
};

export default SearchOutlineIcon;

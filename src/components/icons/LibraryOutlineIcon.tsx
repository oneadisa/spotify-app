import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { useTheme } from '../../theme/index.ts';

interface LibraryOutlineIconProps {
  size?: number;
  color?: string;
}

export const LibraryOutlineIcon: React.FC<LibraryOutlineIconProps> = (props: LibraryOutlineIconProps) => {
  const theme = useTheme();
  const iconColor = props.color || theme.colors.textSecondary;

  return (
<Svg
    width={22}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#BFBFBF"
      d="M1 .5c.163 0 .251.04.3.072a.379.379 0 0 1 .128.152.73.73 0 0 1 .071.268l.001.014v21.991l-.001.01a.708.708 0 0 1-.071.27.378.378 0 0 1-.127.15A.524.524 0 0 1 1 23.5a.524.524 0 0 1-.3-.072.378.378 0 0 1-.128-.152.73.73 0 0 1-.071-.268L.5 22.994V1.006L.501.992A.708.708 0 0 1 .572.724.38.38 0 0 1 .7.572.524.524 0 0 1 1 .5Zm6 0c.163 0 .251.04.3.072a.379.379 0 0 1 .128.152.73.73 0 0 1 .071.268l.001.014v21.991l-.001.01a.708.708 0 0 1-.071.27.378.378 0 0 1-.127.15A.524.524 0 0 1 7 23.5a.524.524 0 0 1-.3-.072.378.378 0 0 1-.128-.152.73.73 0 0 1-.071-.268l-.001-.014V1.006l.001-.014a.708.708 0 0 1 .071-.268A.379.379 0 0 1 6.7.572.524.524 0 0 1 7 .5Zm6.482.017c.07.03.17.077.298.143.257.132.603.323 1.011.556a139.99 139.99 0 0 1 2.888 1.712c1.03.624 2.044 1.247 2.8 1.716l.913.566.108.067V23a.51.51 0 0 1-.166.334.51.51 0 0 1-.334.166h-8a.51.51 0 0 1-.334-.166A.51.51 0 0 1 12.5 23V1c0-.163.04-.243.07-.285a.387.387 0 0 1 .178-.126c.193-.077.444-.088.692-.089l.042.017Z"
    />
  </Svg>
  );
};

export default LibraryOutlineIcon;

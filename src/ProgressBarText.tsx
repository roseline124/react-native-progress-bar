import React from 'react';
import { FontWeight, Text, TextAnchor } from 'react-native-svg';

export interface ProgressBarTextProps {
  text?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: FontWeight;
  textAlign?: TextAnchor;
  textPosition?: `${number}%`;
}

export const ProgressBarText = ({
  text,
  color,
  fontSize,
  fontWeight,
  textAlign,
  textPosition,
}: ProgressBarTextProps) => {
  let textX;
  switch (textAlign) {
    case 'start':
      textX = '10%';
      break;
    case 'middle':
      textX = '50%';
      break;
    case 'end':
      textX = '80%';
      break;
    default:
      textX = '50%';
  }

  return (
    <Text
      fill={color}
      fontSize={fontSize}
      fontWeight={fontWeight}
      x={textPosition ?? textX} // 계산된 텍스트 위치 사용
      y="50%" // SVG의 높이 중간
      dy=".3em" // 세로 위치 조정
      textAnchor={textAlign} // 텍스트 정렬
    >
      {text}
    </Text>
  );
};

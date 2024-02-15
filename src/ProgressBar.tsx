import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const INDETERMINATE_WIDTH_FACTOR = 0.3;
const BAR_WIDTH_ZERO_POSITION =
  INDETERMINATE_WIDTH_FACTOR / (1 + INDETERMINATE_WIDTH_FACTOR);

interface ProgressBarProps {
  animated?: boolean;
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  children?: React.ReactNode;
  color?: string;
  // @TODO progress bar 안에 컴포넌트 넣을 수 있게(title 이런 거)
  lineCap?: 'square' | 'round';
  height?: number;
  width?: number | `${number}%`;
  indeterminate?: boolean;
  indeterminateAnimationDuration?: number;
  onLayout?: (event: LayoutChangeEvent) => void;
  progress?: number;
  containerStyle?: StyleProp<ViewStyle>;
  unfilledColor?: string;
  useNativeDriver?: boolean;
  animationType?: 'decay' | 'timing' | 'spring';
  animationConfig?: Animated.AnimationConfig;
}

export const ProgressBar = ({
  animated = true,
  borderColor,
  height = 6,
  borderRadius = height / 2,
  borderWidth = 1,
  children,
  color = 'rgba(0, 122, 255, 1)',
  indeterminate = false,
  indeterminateAnimationDuration = 1000,
  onLayout,
  progress = 0,
  containerStyle,
  unfilledColor = 'rgba(0,0,0,0)',
  width = '100%',
  animationConfig = { useNativeDriver: false },
  animationType = 'spring',
  lineCap = 'round',
}: ProgressBarProps) => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const progressValue = useRef(
    new Animated.Value(
      indeterminate
        ? INDETERMINATE_WIDTH_FACTOR
        : Math.min(Math.max(progress, 0), 1)
    )
  ).current;
  const animationValue = useRef(
    new Animated.Value(BAR_WIDTH_ZERO_POSITION)
  ).current;

  useEffect(() => {
    if (indeterminate) {
      animate();
    }
  }, [indeterminate]);

  useEffect(() => {
    const toValue = indeterminate
      ? INDETERMINATE_WIDTH_FACTOR
      : Math.min(Math.max(progress, 0), 1);
    if (animated) {
      Animated[animationType](progressValue, {
        toValue,
        ...animationConfig,
      } as any).start();
    } else {
      progressValue.setValue(toValue);
    }
  }, [progress, indeterminate]);

  const animate = () => {
    animationValue.setValue(0);
    Animated.timing(animationValue, {
      toValue: 1,
      duration: indeterminateAnimationDuration,
      easing: Easing.linear,
      isInteraction: false,
      useNativeDriver: animationConfig?.useNativeDriver ?? false,
    }).start((endState) => {
      if (endState.finished) {
        animate();
      }
    });
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setLayoutWidth(width); // 부모 컨테이너의 너비를 측정하여 상태 업데이트
    onLayout?.(event);
  };

  const actualWidth = (
    typeof width === 'string' && width.endsWith('%')
      ? (parseFloat(width) / 100) * layoutWidth
      : width
  ) as number;
  const progressWidth = actualWidth * Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={[
        {
          borderWidth,
          borderColor: borderColor || color,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: unfilledColor,
        },
        containerStyle,
      ]}
      onLayout={handleLayout}
    >
      <Svg height={height} width={actualWidth - borderWidth * 2}>
        {/* background */}
        <Rect
          x={borderWidth}
          y={borderWidth}
          width={actualWidth}
          height={height}
          fill={unfilledColor}
        />
        {/* progress */}
        <Rect
          x={borderWidth}
          y={borderWidth}
          width={progressWidth}
          height={height}
          fill={color}
          rx={lineCap === 'round' ? height / 2 : undefined}
        />
      </Svg>
      {children}
    </View>
  );
};

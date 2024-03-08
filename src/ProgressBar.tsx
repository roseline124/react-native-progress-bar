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
import { ProgressBarText, ProgressBarTextProps } from './ProgressBarText';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const INDETERMINATE_WIDTH_FACTOR = 0.3;

export interface ProgressBarProps {
  animated?: boolean;
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  children?: React.ReactNode;
  color?: string;
  lineCap?: 'square' | 'round';
  width?: number | `${number}%`;
  height?: number;
  loop?: boolean;
  loopAnimationDuration?: number;
  progress?: number;
  unfilledColor?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  containerStyle?: StyleProp<ViewStyle>;
  animationType?: 'decay' | 'timing' | 'spring';
  animationConfig?: Animated.AnimationConfig;
  textProps?: ProgressBarTextProps;
}

export const ProgressBar = ({
  textProps,
  borderColor,
  children,
  onLayout,
  containerStyle,
  animated = true,
  height = 6,
  borderRadius = height / 2,
  borderWidth = 0,
  color = 'rgba(0, 122, 255, 1)',
  loop = false,
  loopAnimationDuration = 1000,
  progress = 0,
  unfilledColor = 'rgba(0,0,0,0)',
  width = '100%',
  animationConfig = { useNativeDriver: false },
  animationType = 'spring',
  lineCap = 'round',
}: ProgressBarProps) => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const progressValue = useRef(
    new Animated.Value(Math.min(Math.max(progress, 0), 1))
  ).current;
  const animationValue = useRef(
    new Animated.Value(INDETERMINATE_WIDTH_FACTOR)
  ).current;

  /**
   * loop animation
   */
  useEffect(() => {
    if (loop) {
      animate();
    }
  }, []);

  /**
   * animate once
   */
  useEffect(() => {
    if (loop) {
      return;
    }
    const toValue = Math.min(Math.max(progress, 0), 1);
    if (animated) {
      Animated[animationType](progressValue, {
        toValue: Math.min(Math.max(progress, 0), 1),
        ...animationConfig,
      } as any).start();
    } else {
      progressValue.setValue(toValue);
    }
    return () => {
      // initialize value when unmounted
      progressValue.setValue(0);
    };
  }, [progress, loop]);

  const animate = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: loopAnimationDuration,
      easing: Easing.linear,
      isInteraction: false,
      useNativeDriver: animationConfig?.useNativeDriver ?? false,
    }).start((endState) => {
      if (endState.finished) {
        animationValue.setValue(0);
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

  // const progressWidth = actualWidth * Math.min(Math.max(progress, 0), 1);
  const progressWidth = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, actualWidth],
  });
  const animatedWidth = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, actualWidth],
  });

  return (
    <View
      style={[
        {
          borderWidth,
          borderColor: borderColor || color,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: 'trasparent',
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
        {/* when indeterminate prop is true */}
        {loop ? (
          <AnimatedRect
            x={borderWidth}
            y={borderWidth}
            width={animatedWidth}
            height={height}
            fill={color}
            rx={lineCap === 'round' ? height / 2 : undefined}
          />
        ) : (
          <AnimatedRect
            x={borderWidth}
            y={borderWidth}
            width={progressWidth}
            height={height}
            fill={color}
            rx={lineCap === 'round' ? height / 2 : undefined}
          />
        )}
        {textProps && <ProgressBarText {...textProps} />}
      </Svg>
      {children}
    </View>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  View,
  I18nManager,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
} from 'react-native';

type AnimationConfigMap = {
  timing: Animated.DecayAnimationConfig;
  spring: Animated.SpringAnimationConfig;
  decay: Animated.TimingAnimationConfig;
};

interface ProgressBarProps {
  animated?: boolean;
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  children?: React.ReactNode;
  color?: string;
  // @TODO progress bar 안에 컴포넌트 넣을 수 있게(title 이런 거)
  // @TODO 안에 채워지는 Linecap 설정할 수 있게.
  // @TODO width, height number인 게 맘에 안듦
  height?: number;
  width?: number;
  indeterminate?: boolean;
  indeterminateAnimationDuration?: number;
  onLayout?: (event: LayoutChangeEvent) => void;
  progress?: number;
  style?: StyleProp<ViewStyle>;
  unfilledColor?: string;
  useNativeDriver?: boolean;
  animationType?: 'decay' | 'timing' | 'spring';
  animationConfig?: AnimationConfigMap['decay' | 'timing' | 'spring'];
}

const INDETERMINATE_WIDTH_FACTOR = 0.3;
const BAR_WIDTH_ZERO_POSITION =
  INDETERMINATE_WIDTH_FACTOR / (1 + INDETERMINATE_WIDTH_FACTOR);

export const ProgressBar: React.FC<ProgressBarProps> = ({
  animated = true,
  borderColor,
  borderRadius = 4,
  borderWidth = 1,
  children,
  color = 'rgba(0, 122, 255, 1)',
  height = 6,
  indeterminate = false,
  indeterminateAnimationDuration = 1000,
  onLayout,
  progress = 0,
  style,
  unfilledColor,
  width = 150,
  animationConfig = { bounciness: 0, useNativeDriver: false },
  animationType = 'spring',
}) => {
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

  const handleLayout = (event: LayoutChangeEvent) => {
    if (!width) {
      setLayoutWidth(event.nativeEvent.layout.width);
    }
    if (onLayout) {
      onLayout(event);
    }
  };

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

  const innerWidth = Math.max(0, width || layoutWidth) - borderWidth * 2;
  const containerStyle: ViewStyle = {
    width,
    borderWidth,
    borderColor: borderColor || color,
    borderRadius,
    overflow: 'hidden',
    backgroundColor: unfilledColor,
  };
  const progressStyle: ViewStyle | any = {
    backgroundColor: color,
    height,
    transform: [
      {
        translateX: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [innerWidth * -INDETERMINATE_WIDTH_FACTOR, innerWidth],
        }),
      },
      {
        translateX: progressValue.interpolate({
          inputRange: [0, 1],
          outputRange: [innerWidth / (I18nManager.isRTL ? 2 : -2), 0],
        }),
      },
      {
        scaleX: progressValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.0001, 1],
        }),
      },
    ],
  };

  return (
    <View style={[containerStyle, style]} onLayout={handleLayout}>
      <Animated.View style={progressStyle} />
      {children}
    </View>
  );
};

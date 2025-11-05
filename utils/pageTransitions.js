// utils/pageTransitions.js
import { 
    useSharedValue, 
    withTiming, 
    withSpring, 
    withSequence,
    Easing 
  } from 'react-native-reanimated';
  
  export const TRANSITION_TYPES = {
    SLIDE_HORIZONTAL: 'slideHorizontal',
    SLIDE_VERTICAL: 'slideVertical',
    SCALE: 'scale',
    ROTATE: 'rotate',
    FLIP: 'flip',
    CAROUSEL: 'carousel',
    PARALLAX: 'parallax'
  };
  
  export const createPageTransition = (type, direction = 'right') => {
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(direction === 'right' ? 100 : -100);
    const translateY = useSharedValue(direction === 'up' ? 100 : -100);
    const scale = useSharedValue(0.8);
    const rotateY = useSharedValue('90deg');
    
    const animateIn = (duration = 600) => {
      const config = {
        damping: 20,
        stiffness: 200,
        mass: 0.8
      };
      
      switch (type) {
        case TRANSITION_TYPES.SLIDE_HORIZONTAL:
          opacity.value = withTiming(1, { duration: duration * 0.8 });
          translateX.value = withSpring(0, config);
          break;
          
        case TRANSITION_TYPES.SLIDE_VERTICAL:
          opacity.value = withTiming(1, { duration: duration * 0.8 });
          translateY.value = withSpring(0, config);
          break;
          
        case TRANSITION_TYPES.SCALE:
          opacity.value = withTiming(1, { duration: duration * 0.8 });
          scale.value = withSpring(1, config);
          break;
          
        case TRANSITION_TYPES.ROTATE:
          opacity.value = withTiming(1, { duration: duration * 0.8 });
          rotateY.value = withSpring('0deg', config);
          scale.value = withSpring(1, config);
          break;
          
        case TRANSITION_TYPES.FLIP:
          opacity.value = withTiming(1, { duration: duration * 0.6 });
          rotateY.value = withSequence(
            withTiming('180deg', { duration: duration * 0.3 }),
            withTiming('0deg', { duration: duration * 0.3 })
          );
          break;
          
        case TRANSITION_TYPES.CAROUSEL:
          opacity.value = withTiming(1, { duration: duration * 0.7 });
          translateX.value = withSpring(0, { ...config, damping: 25 });
          scale.value = withSpring(1, { ...config, damping: 30 });
          break;
          
        default:
          opacity.value = withTiming(1, { duration });
          translateX.value = withSpring(0, config);
      }
    };
    
    const animateOut = (duration = 400) => {
      switch (type) {
        case TRANSITION_TYPES.SLIDE_HORIZONTAL:
          opacity.value = withTiming(0, { duration: duration * 0.6 });
          translateX.value = withTiming(direction === 'right' ? -100 : 100, { duration });
          break;
          
        case TRANSITION_TYPES.SLIDE_VERTICAL:
          opacity.value = withTiming(0, { duration: duration * 0.6 });
          translateY.value = withTiming(direction === 'up' ? -100 : 100, { duration });
          break;
          
        case TRANSITION_TYPES.SCALE:
          opacity.value = withTiming(0, { duration: duration * 0.8 });
          scale.value = withTiming(0.8, { duration });
          break;
          
        default:
          opacity.value = withTiming(0, { duration });
      }
    };
    
    return {
      opacity,
      translateX,
      translateY,
      scale,
      rotateY,
      animateIn,
      animateOut
    };
  };
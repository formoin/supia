import {useRef} from 'react'; // React 훅에서 useRef를 가져옵니다.
import {Animated, PanResponder} from 'react-native'; // 애니메이션과 팬 응답기를 가져옵니다.

const useDrag = () => {
  // Animated.ValueXY()는 x와 y 좌표를 모두 관리하는 애니메이션 값을 생성합니다.
  const pan = useRef(new Animated.ValueXY()).current;

  // PanResponder를 생성하여 제스처 이벤트를 처리합니다.
  const panResponder = useRef(
    PanResponder.create({
      // 드래그를 시작할 준비가 되었는지 확인하는 콜백입니다. 항상 true를 반환하여 드래그를 허용합니다.
      onMoveShouldSetPanResponder: () => true,

      // 사용자가 드래그를 시작했을 때 호출되는 콜백입니다.
      onPanResponderGrant: () => {
        // 현재 위치를 기준으로 오프셋을 설정합니다. 드래그를 시작할 때 현재 위치를 기준으로 합니다.
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },

      // 드래그 중일 때 호출되는 콜백입니다.
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false, // 애니메이션 드라이버를 네이티브로 하지 않고 JS로 처리합니다.
      }),

      // 드래그를 끝냈을 때 호출되는 콜백입니다.
      onPanResponderRelease: () => {
        // 오프셋을 플래튼하여 최종 위치를 기록합니다. 드래그가 끝난 후 위치를 평평하게 만듭니다.
        pan.flattenOffset();
      },
    }),
  ).current;

  // 드래그의 위치를 애니메이션 스타일로 변환합니다.
  const style = {
    transform: [{translateX: pan.x}, {translateY: pan.y}],
  };

  // PanResponder와 스타일을 반환하여 드래그 가능한 컴포넌트에서 사용할 수 있게 합니다.
  return {panResponder, style};
};

export default useDrag;

// import React from 'react';
// import {StyleSheet, Dimensions, View, Text} from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   useAnimatedGesture,
// } from 'react-native-reanimated';
// import {PanGestureHandler} from 'react-native-gesture-handler';
// import {useNavigation} from '@react-navigation/native';

// const {width} = Dimensions.get('window');

// const SlidePanel = () => {
//   const navigation = useNavigation();
//   const translateX = useSharedValue(width); // 패널을 화면 오른쪽 바깥에 시작
//   const panelWidth = width * 0.8; // 패널의 너비

//   const animatedPanelStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{translateX: translateX.value}],
//     };
//   });

//   const handleGesture = useAnimatedGesture({
//     onActive: event => {
//       // 패널의 최대 이동 범위를 화면의 절반으로 제한
//       if (event.translationX < 0) {
//         translateX.value = Math.max(
//           width + event.translationX,
//           width - panelWidth, // 패널이 화면의 오른쪽 끝에 붙어 있도록 제한
//         );

//         // 화면의 절반 이상으로 이동하지 않도록 제한
//         translateX.value = Math.min(
//           translateX.value,
//           width - panelWidth / 2.5, // 패널이 화면의 절반까지만 이동하도록 제한
//         );
//       }
//     },
//     onEnd: () => {
//       console.log('TranslateX value on end:', translateX.value); // 값 확인

//       // 패널의 최종 위치를 결정
//       if (translateX.value < width - panelWidth / 2.5) {
//         translateX.value = withSpring(width - panelWidth, {}, () => {
//           if (typeof navigation.navigate === 'function') {
//             navigation.navigate('Search'); // 페이지 이동
//           } else {
//             console.error('Navigation object does not have navigate function');
//             translateX.value = withSpring(width);
//           }
//         });
//       } else {
//         translateX.value = withSpring(width); // 패널을 다시 숨김
//       }
//     },
//   });

//   return (
//     <View style={styles.container}>
//       <PanGestureHandler onGestureEvent={handleGesture}>
//         <Animated.View style={[styles.panel, animatedPanelStyle]}>
//           <Text style={styles.panelText}>도감으로</Text>
//         </Animated.View>
//       </PanGestureHandler>
//       <PanGestureHandler onGestureEvent={handleGesture}>
//         <Animated.View style={[styles.slideHandle, animatedPanelStyle]} />
//       </PanGestureHandler>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     right: 200, // 화면 오른쪽 끝에 배치
//     width: width * 0.6, // 슬라이드 핸들의 너비
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//   },
//   panel: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     right: 0,
//     width: width * 0.55, // 패널의 너비
//     backgroundColor: 'white',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//     elevation: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   panelText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   slideHandle: {
//     width: 10,
//     height: 100,
//     backgroundColor: 'rgba(0, 0, 0, 0.1)',
//     borderRadius: 5,
//     position: 'absolute',
//     left: 0, // 슬라이드 핸들이 패널과 동일한 위치에 있도록 설정
//   },
// });

// export default SlidePanel;

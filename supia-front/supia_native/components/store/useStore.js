import {create} from 'zustand';
import axios from 'axios';
import Sound from 'react-native-sound';
import {KAKAO_API_KEY, Server_IP} from '@env';
import useLoginStore from './useLoginStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {token} = useLoginStore.getState();
import testWalkData from '../Pages/User/walkTest.json'; // 로컬 JSON 파일 가져오기

const useStore = create(set => ({
  memberId: null,
  memberName: null,
  setMemberId: id => set({memberId: id}),
  setMemberName: name => set({memberName: name}),

  // search
  activeText: 'text1',
  setActiveText: text => set({activeText: text}),
  resetActiveText: () => set({activeText: 'text1'}),

  // Dictionarysearch
  activeDic: 'text1',
  setActiveDic: text => set({activeDic: text}),
  resetActiveDic: () => set({activeDic: 'text1'}),

  // walk
  time: 0, // 총 시간(초) 상태
  isActive: false, // 스톱워치 활성 상태
  isPaused: false, // 스톱워치 일시 정지 상태
  startStopwatch: () => set({isActive: true, isPaused: false}),
  stopStopwatch: () => set({isActive: false, isPaused: false}),
  pauseStopwatch: () => set({isPaused: true}),
  resetStopwatch: () => set({time: 0, isActive: false, isPaused: false}),
  incrementTime: () => set(state => ({time: state.time + 1})),

  // 산책이 끝나고 산책 경로 표시
  routeWidth: 0,
  setRouteWidth: value => set({routeWidth: value}),

  // 산책이 끝나고 산책 거리 표시
  finalDistance: 0,
  setFinalDistance: distance => set({finalDistance: distance}),

  // 산책이 끝나고 산책 거리 이미지 url
  capturedImageUri: null,
  setCapturedImageUri: uri => set({capturedImageUri: uri}),

  // Walk Button Press Time
  walkStartTime: null, // 산책 시작 시간을 저장할 상태
  setWalkStartTime: time => set({walkStartTime: time}), // 산책 시작 시간 설정 함수

  // Walk End Time
  walkEndTime: null, // 산책 종료 시간을 저장할 상태
  setWalkEndTime: time => set({walkEndTime: time}), // 산책 종료 시간 설정 함수

  // Current Location
  currentLocation: null, // 현재 위치를 저장할 상태
  setCurrentLocation: location => set({currentLocation: location}), // 현재 위치 설정 함수

  // 찍은 아이템
  items: [], // 아이템을 저장할 상태
  addItem: item => set(state => ({items: [...state.items, item]})), // 아이템 추가 함수
  clearItems: () => set({items: []}), // 아이템 초기화 함수

  // s3 이미지
  getS3Url: imgurl => {
    // s3:// 형식에서 bucket-name과 image path 추출
    const s3Path = imgurl.split('/').slice(3).join('/'); // 'background/image/forest_1.png'

    return `https://supia.s3.ap-northeast-2.amazonaws.com/${s3Path}`;
  },

  // 숲 스티커
  // 초기 상태
  droppedImages: [],
  // 이미지를 추가, 삭제하는 함수
  addDroppedImage: (itemId, imageUrl, position, soundOn) =>
    set(state => ({
      droppedImages: [
        ...state.droppedImages,
        {itemId, imageUrl, position, soundOn},
      ],
    })),
  removeDroppedImage: itemId =>
    set(state => ({
      droppedImages: state.droppedImages.filter(img => img.itemId !== itemId),
    })),

  // 이미지 위치를 업데이트하는 함수
  updateImagePosition: (itemId, translationX, translationY) => {
    set(state => {
      const updatedImages = [...state.droppedImages];
      const image = updatedImages.find(img => img.itemId === itemId);

      image.position.x += translationX;
      image.position.y += translationY;

      return {
        droppedImages: updatedImages,
      };
    });
  },
  forestId: null,
  setForestId: id => set(() => ({forestId: id})),

  // api로 받아온 데이터를 저장하는 함수
  setDroppedImages: images =>
    set(() => ({
      droppedImages: images,
    })),

  BGI: null,
  setBGI: bgi => set(() => ({BGI: bgi})),
  BGM: null,
  setBGM: bgm => set(() => ({BGM: bgm})),

  BGI: null,
  setBGI: bgi => set(() => ({BGI: bgi})),
  BGM: null,
  setBGM: bgm => set(() => ({BGM: bgm})),

  // s3 이미지
  getS3Url: imgurl => {
    // s3:// 형식에서 bucket-name과 image path 추출
    const s3Path = imgurl.split('/').slice(3).join('/'); // 'background/image/forest_1.png'

    return `https://supia.s3.ap-northeast-2.amazonaws.com/${s3Path}`;
  },

  // 위치 정보 동 정보
  fetchLocationData: async (lon, lat) => {
    try {
      const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
      });
      // 동 정보 설정
      // console.log(response.data.documents);
      const locationData = response.data.documents[0];
      return {
        dong: locationData.region_3depth_name,
        ri: locationData.region_4depth_name,
        code: locationData.address_name,
      };
    } catch (error) {
      console.log('실패:', error);
      return null;
    }
  },

  // BGM
  currentSound: null,
  playingSoundId: null, // 현재 재생 중인 소리의 ID
  playSound: (url, soundId, onPlayEnd) => {
    set(state => {
      // 현재 재생 중인 소리가 있다면 중지
      if (state.currentSound) {
        state.currentSound.stop(() => {
          state.currentSound.release();
        });
      }

      // 새로운 소리 재생
      const sound = new Sound(url, null, error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        sound.play(success => {
          if (success) {
            console.log('Sound played successfully');
          } else {
            console.log('Playback failed');
          }
          // 재생이 끝나면 소리 객체를 해제하고 상태를 업데이트
          sound.release();
          set({currentSound: null, playingSoundId: null});
          if (onPlayEnd) onPlayEnd();
        });
      });

      // 새로운 소리 상태 업데이트
      return {currentSound: sound, playingSoundId: soundId};
    });
  },

  // 산책 거리 불러오기
  weeklyWalkHistory: null,
  monthlyWalkHistory: null,
  yearlyWalkHistory: null,
  setWeeklyWalkHistory: data => set(() => ({weeklyWalkHistory: data})),
  setMonthlyWalkHistory: data => set(() => ({monthlyWalkHistory: data})),
  setYearlyWalkHistory: data => set(() => ({yearlyWalkHistory: data})),
  fetchWalkHistory: async () => {
    console.log('걷기 기록');
    try {
      const token = await AsyncStorage.getItem('key');
      if (token) {
        console.log(token);
        const response = await axios.post(
          //ContextPath
          `${Server_IP}/walk/history`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.status === 200) {
          // 컨텍스트 내에서 setState 함수들에 접근
          set(state => ({
            monthlyWalkHistory: response.data.monthly,
            yearlyWalkHistory: response.data.yearly,
            weeklyWalkHistory: response.data.monthly.slice(-7),
          }));
          console.log('월별 데이터:', response.data.monthly);
          console.log('연도별 데이터:', response.data.yearly);
          console.log('주별 데이터:', response.data.monthly.slice(-7));
        } else {
          throw new Error('걷기 기록 가져오기 실패 : response.status !== 200');
        }
      }
    } catch (err) {
      console.error(err);
    }
  },

  // fetchWalkHistory: async () => {
  //   try {
  //     // Axios 요청처럼 데이터를 가공
  //     const response = {
  //       data: testWalkData,
  //       status: 200,
  //       statusText: 'OK',
  //       headers: {},
  //       config: {},
  //       request: {},
  //     };

  //     // 데이터를 기존 axios 요청처럼 처리
  //     if (response.status === 200) {
  //       // 컨텍스트 내에서 setState 함수들에 접근
  //       set(state => ({
  //         monthlyWalkHistory: response.data.monthly,
  //         yearlyWalkHistory: response.data.yearly,
  //         weeklyWalkHistory: response.data.monthly.slice(-7),
  //       }));

  //       console.log('월별 데이터:', response.data.monthly);
  //       console.log('연도별 데이터:', response.data.yearly);
  //       console.log('주별 데이터:', response.data.monthly.slice(-7));
  //     } else {
  //       throw new Error('걷기 기록 가져오기 실패 : response.status !== 200');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },
}));

export default useStore;

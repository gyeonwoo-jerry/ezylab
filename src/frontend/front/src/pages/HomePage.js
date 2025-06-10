// HomePage.js
import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { register } from 'swiper/element/bundle';

import 'swiper/css';
import 'swiper/css/pagination';

import SlideContent from '../components/SlideContent';

import '../styles/homepage.css';

// Swiper 모듈 등록
register();

const HomePage = () => {
  const [swiper, setSwiper] = useState(null);
  const videoRef = useRef(null);

  const handleScrollDown = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  // 슬라이드 자동 전환 핸들러
  const handleSlideNext = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  // 비디오 자동 재생 강제 실행
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          console.log('비디오 자동 재생 성공');
        } catch (error) {
          console.log('비디오 자동 재생 실패:', error);
          // 사용자 상호작용 후 재생 시도
          const handleUserInteraction = async () => {
            try {
              await videoRef.current.play();
              console.log('사용자 상호작용 후 비디오 재생 성공');
              // 이벤트 리스너 제거
              document.removeEventListener('click', handleUserInteraction);
              document.removeEventListener('keydown', handleUserInteraction);
            } catch (err) {
              console.log('사용자 상호작용 후에도 재생 실패:', err);
            }
          };
          
          document.addEventListener('click', handleUserInteraction);
          document.addEventListener('keydown', handleUserInteraction);
        }
      }
    };

    playVideo();
  }, []);

  return (
      <div className="homepage">

        <Swiper
            modules={[Pagination]}
            direction="vertical"
            mousewheel={true}
            pagination={{ clickable: true }}
            className="mySwiper"
            onSwiper={setSwiper}
        >
          <SwiperSlide><SlideContent slideNum={1} onSlideNext={handleSlideNext} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={2} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={3} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={4} /></SwiperSlide>
        </Swiper>

      </div>
  );
};

export default HomePage;
import React from 'react';

// 각 슬라이드의 콘텐츠를 표시하는 컴포넌트
const SlideContent = ({ slideNum }) => {
  switch (slideNum) {
    case 1:
      return (
          <div className="swiper-slide sec_01">
            <div className="inner">
              <div className="content">
                <div className="word">
                  살다보면<br /><font className="mint">"이런거 있으면 좋겠다~"</font><br />싶은거 있죠?
                </div>
                <div className="img_group">
                  <div className="topimg">
                    <img
                        src="/images/sec_01_img_01.png"
                        srcSet="/images/sec_01_img_01@2x.png 2x, /images/sec_01_img_01@3x.png 3x"
                        alt="이미지 1"
                    />
                  </div>
                  <div className="botimg">
                    <img
                        src="/images/sec_01_img_02.png"
                        srcSet="/images/sec_01_img_02@2x.png 2x, /images/sec_01_img_02@3x.png 3x"
                        alt="이미지 2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
      );
    case 2:
      return (
          <div className="swiper-slide sec_02">
            <div className="inner">
              <div className="content">
                <div className="word">
                  이지랩은 그런걸 만들어요<br /><font className="mint">"이런거 있으면 좋겠다"</font><br />싶은 것들,
                </div>
                <div className="img_group">
                  <div className="topimg">
                    <img
                        src="/images/sec_02_img_01.png"
                        srcSet="/images/sec_02_img_01@2x.png 2x, /images/sec_02_img_01@3x.png 3x"
                        alt="이미지 1"
                    />
                  </div>
                  <div className="botimg">
                    <img
                        src="/images/sec_02_img_02.png"
                        srcSet="/images/sec_02_img_02@2x.png 2x, /images/sec_02_img_02@3x.png 3x"
                        alt="이미지 2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
      );
    case 3:
      return (
          <div className="swiper-slide sec_03">
            <div className="inner">
              <div className="content">
                <div className="word">
                  원하는 노래를 바로 부를 수 있는 앱<br />아무곳에서나 쓸 수 있는 메모장<br />내 반려동물을 위한 앱<br />지하철이 언제 오는지 알려 주는 앱<br />.<br />.
                </div>
              </div>
            </div>
          </div>
      );
    default:
      return (
          <div className="swiper-slide">
            Slide {slideNum}
          </div>
      );
  }
};

export default SlideContent;
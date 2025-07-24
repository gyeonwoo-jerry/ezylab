// src/config/index.js

// 로컬 개발 환경 (npm start로 실행 시)
const local = {
  apiUrl: "http://211.110.44.79:48080", // 로컬 개발 서버 URL
};

// 개발 서버 환경 (빌드된 파일이 개발 서버의 Spring Boot static에서 서빙될 때)
const development = {
  apiUrl: "", // 상대경로 사용
};

// 운영 서버 환경 (빌드된 파일이 운영 서버의 Spring Boot static에서 서빙될 때)
const production = {
  apiUrl: "", // 상대경로 사용
};

// REACT_APP_ENV 환경 변수를 기반으로 환경 결정
const getConfig = () => {
  const env = process.env.REACT_APP_ENV;

  switch (env) {
    case "development":
      return development;
    case "production":
      return production;
    default:
      return local; // 기본값은 로컬 환경 (npm start)
  }
};

const config = getConfig();

export default config;

import axios from "axios";
import config from "./config";

// URL 결합 시 중복된 슬래시 제거 함수
const joinUrl = (base, path) => {
  const normalizedBase = base.replace(/\/+$/, ''); // 끝의 슬래시 제거
  const normalizedPath = path.replace(/^\/+/, '/'); // 앞의 중복 슬래시를 하나로 만들기
  return normalizedBase + normalizedPath;
};

// axios 인스턴스 생성
const API = axios.create({
  baseURL: joinUrl(config.apiUrl, "/api"),
  withCredentials: true, // 쿠키 사용 시 true (선택)
});

// 요청 인터셉터: accessToken 추가
API.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      config.headers["Content-Type"] =
          config.headers["Content-Type"] || "application/json";

      return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 처리
API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // 로그인 페이지로 이동
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
);

export default API;

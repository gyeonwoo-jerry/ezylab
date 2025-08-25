import React, { useEffect, useMemo, useRef, useState } from "react";

// Simple styles scoped to this component
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: "20px",
};

const countdownStyle = {
  marginTop: "50px",
};

const titleStyle = {
  fontSize: "60px",
  fontWeight: "bold",
  color: "#555",
  marginBottom: "30px",
};

const numberStyle = {
  fontSize: "150px",
  fontWeight: "bold",
  color: "#333",
};

const actionButtonsStyle = {
  marginTop: "20px",
};

const buttonBase = {
  padding: "10px 20px",
  fontSize: "16px",
  margin: "5px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const startBtnStyle = {
  ...buttonBase,
  backgroundColor: "#28a745",
  color: "white",
};
const pauseBtnStyle = {
  ...buttonBase,
  backgroundColor: "#ffc107",
  color: "white",
};
const stopBtnStyle = {
  ...buttonBase,
  backgroundColor: "#dc3545",
  color: "white",
};

const queueContainerStyle = {
  marginTop: "20px",
  maxHeight: "300px",
  overflowY: "auto",
  border: "1px solid #ddd",
  padding: "10px",
  width: "90%",
  maxWidth: "600px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "10px 20px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "grab",
};

const cardContentStyle = { flexGrow: 1 };
const cardButtonsStyle = { display: "flex", gap: "5px" };
const delBtnStyle = {
  ...buttonBase,
  background: "#dc3545",
  color: "white",
  fontSize: "12px",
  padding: "5px 10px",
};
const editBtnStyle = {
  ...buttonBase,
  background: "#ffc107",
  color: "white",
  fontSize: "12px",
  padding: "5px 10px",
};

// Helpers
const UNIT_KEY = "meetingTimer.unit";
const DEFAULT_UNIT = "m"; // m as default (분)

function toSecondsByUnit(value, unit) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  if (unit === "h") return Math.floor(value * 3600);
  if (unit === "m") return Math.floor(value * 60);
  return Math.floor(value);
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0)
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function MeetingTimer() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [unit, setUnit] = useState(() => {
    try {
      return localStorage.getItem(UNIT_KEY) || DEFAULT_UNIT;
    } catch {
      return DEFAULT_UNIT;
    }
  });

  const intervalRef = useRef(null);
  const timeLeftRef = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(UNIT_KEY, unit);
    } catch {}
  }, [unit]);

  const isRunning = currentIndex >= 0 && intervalRef.current !== null;

  const visibleQueue = useMemo(
    () => items.filter((_, idx) => idx !== currentIndex),
    [items, currentIndex]
  );

  function clearTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function startCountdown(index) {
    if (index >= items.length) {
      clearTimer();
      setCurrentIndex(-1);
      setIsPaused(false);
      return;
    }

    setCurrentIndex(index);
    const currentItemSeconds = items[index].seconds;
    timeLeftRef.current = currentItemSeconds;
    clearTimer();
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        timeLeftRef.current -= 1;
        if (timeLeftRef.current <= 0) {
          clearTimer();
          const nextIndex = index + 1;
          const isLast = nextIndex >= items.length;
          // Show alert and proceed only after user confirms
          if (isLast) {
            window.alert("모든 타이머가 완료되었습니다.");
            setCurrentIndex(-1);
            setIsPaused(false);
          } else {
            const nextTitle = items[nextIndex]?.title || "다음 항목";
            window.alert(`다음 항목으로 이동합니다: ${nextTitle}`);
            startCountdown(nextIndex);
          }
        } else {
          // trigger re-render
          setItems((prev) => prev.slice());
        }
      }
    }, 1000);
  }

  function handleAdd() {
    const value = Number(timeInput);
    if (!titleInput || !Number.isFinite(value) || value <= 0) return;
    const seconds = toSecondsByUnit(value, unit);
    const next = { title: titleInput, seconds };
    setItems((prev) => [...prev, next]);
    setTitleInput("");
    setTimeInput("");
  }

  function handleDelete(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleEdit(index) {
    const target = items[index];
    if (!target) return;
    const newTitle = window.prompt("새로운 대제목을 입력하세요:", target.title);
    if (newTitle === null || newTitle.trim() === "") return;
    const secondsValue = target.seconds;
    const valueByUnit =
      unit === "h"
        ? secondsValue / 3600
        : unit === "m"
        ? secondsValue / 60
        : secondsValue;
    const newTimeStr = window.prompt(
      "새로운 시간을 입력하세요:",
      String(Math.floor(valueByUnit))
    );
    if (newTimeStr === null) return;
    const newTime = Number(newTimeStr);
    if (!Number.isFinite(newTime) || newTime <= 0) return;
    const newSeconds = toSecondsByUnit(newTime, unit);
    setItems((prev) =>
      prev.map((it, i) =>
        i === index ? { ...it, title: newTitle, seconds: newSeconds } : it
      )
    );
  }

  function handleStop() {
    clearTimer();
    setCurrentIndex(-1);
    setIsPaused(false);
  }

  const currentItem = currentIndex >= 0 ? items[currentIndex] : null;
  const currentTitle = currentItem ? currentItem.title : "항목을 설정하세요";
  const currentTime = currentItem ? timeLeftRef.current : 0;

  return (
    <div style={containerStyle}>
      <div style={countdownStyle}>
        <div style={titleStyle}>{currentTitle}</div>
        <div style={numberStyle}>{formatTime(currentTime)}</div>
        <div style={actionButtonsStyle}>
          {!isRunning && (
            <button
              style={startBtnStyle}
              onClick={() =>
                items.length > 0
                  ? startCountdown(0)
                  : alert("항목을 추가하세요!")
              }
            >
              시작
            </button>
          )}
          {isRunning && (
            <>
              <button
                style={pauseBtnStyle}
                onClick={() => setIsPaused((p) => !p)}
              >
                {isPaused ? "다시 시작" : "일시정지"}
              </button>
              <button style={stopBtnStyle} onClick={handleStop}>
                종료
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>항목 추가</h3>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <input
            type="text"
            placeholder="대제목"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          />
          <input
            type="number"
            placeholder={unit === "h" ? "시간" : unit === "m" ? "분" : "초"}
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              width: "140px",
            }}
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <option value="h">시간 (시)</option>
            <option value="m">분</option>
            <option value="s">초</option>
          </select>
          <button style={startBtnStyle} onClick={handleAdd}>
            추가
          </button>
        </div>
        <div style={{ marginTop: "8px", color: "#666" }}>
          기본 단위는 분입니다. 단위를 변경하면 선택이 로컬스토리지에 저장되어
          다음에도 기본값으로 사용됩니다.
        </div>
      </div>

      <div style={queueContainerStyle}>
        {visibleQueue.map((item, index) => (
          <div key={`${item.title}-${index}`} style={cardStyle}>
            <div style={cardContentStyle}>
              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                {item.title}
              </h4>
              <p style={{ margin: "5px 0 0", color: "#666" }}>
                {formatTime(item.seconds)}
              </p>
            </div>
            <div style={cardButtonsStyle}>
              <button
                style={editBtnStyle}
                onClick={() => handleEdit(items.findIndex((it) => it === item))}
              >
                수정
              </button>
              <button
                style={delBtnStyle}
                onClick={() =>
                  handleDelete(items.findIndex((it) => it === item))
                }
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

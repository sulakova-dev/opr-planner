import axios from "axios";
import { useState, useEffect } from "react";

import PlannerBlock from "../PlannerBlock/PlannerBlock";

import "./AgendaCard.css";
const ClockIcon = () => (
  <svg
    className="agenda-datetime__icon"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M12 6V12L16 14" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function AgendaCard() {
  const order = ["lifehack", "code_review", "extra"];

  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/next-meeting")
      .then((res) => {
        setMeeting(res.data[0]);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }, []);

  if (!meeting) {
    return <div>Загрузка...</div>;
  }

  const sortedBlocks = order.map((type) => {
    return meeting.blocks.find((block) => block.type === type);
  });

  return (
    <main className="agenda-card">
      <div className="agenda-datetime">
        <span>
          {new Date(meeting.date).toLocaleDateString("ru-Ru", {
            weekday: "long",
          })}
        </span>
        <div id="agenda-date">
          <span className="corner corner-tl"></span>
          <span className="corner corner-tr"></span>
          <span className="corner corner-bl"></span>
          <span className="corner corner-br"></span>
          <time>
            {new Date(meeting.date)
              .toLocaleDateString("ru-Ru", {
                day: "numeric",
                month: "long",
              })
              .toUpperCase()}
          </time>
        </div>

        <div id="agenda-datetime-time">
          <ClockIcon />
          <time> {meeting.time.slice(0, 5)}</time>
        </div>
      </div>

      <div className="agenda-content">
        <h1>БЛИЖАЙШАЯ ПЛАНЁРКА</h1>

        {sortedBlocks.map((block) => {
          return (
            <PlannerBlock
              blockType={block.type}
              users={block.participants}
              descript={block.description}
            />
          );
        })}
      </div>
    </main>
  );
}

export default AgendaCard;

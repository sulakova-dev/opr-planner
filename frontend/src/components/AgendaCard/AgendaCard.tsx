import { useState, useEffect } from "react";
import axios from "axios";

import PlannerBlock from "../PlannerBlock/PlannerBlock";
import { ClockIcon } from "../../icons/ClockIcon";

import type { Meeting } from "../../types";

import "./AgendaCard.css";

type Status = "loading" | "empty" | "error" | "success";

function AgendaCard() {
  const order = ["lifehack", "code_review", "extra"];

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    axios
      .get("https://opr-planner.vercel.app/api/next-meeting")
      .then((res) => {
        const meetings = res.data;
        if (meetings.length === 0) {
          setStatus("empty");
        } else {
          setStatus("success");
          setMeeting(meetings[0]);
        }
      })
      .catch((err) => {
        console.log("Error", err);
        setStatus("error");
      });
  }, []);

  if (status === "loading") {
    return <div>Загрузка...</div>;
  }

  if (status === "empty") {
    return <div>Следующая планёрка пока не назначена.</div>;
  }

  if (status === "error") {
    return <div>Не удалось загрузить. Попробуйте позже или включите VPN.</div>;
  }

  if (!meeting) return null;

  const sortedBlocks = order.map((type) => {
    return meeting.blocks.find((block) => block.type === type);
  });

  return (
    <article className="agenda-card" translate="no">
      <header className="agenda-datetime">
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
      </header>

      <section className="agenda-content">
        <h1>БЛИЖАЙШАЯ ПЛАНЁРКА</h1>

        {sortedBlocks.map((block) => {
          if (!block) return null;

          return (
            <PlannerBlock
              blockType={block.type}
              users={block.participants}
              descript={block.description}
            />
          );
        })}
      </section>
    </article>
  );
}

export default AgendaCard;

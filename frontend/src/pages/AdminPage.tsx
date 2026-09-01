import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

import "./AdminPage.css";

type Employee = {
  id: number;
  full_name: string;
};

type Option = { value: string; label: string };

function getNextFriday() {
  const today = new Date();
  const nextFriday = new Date(today);

  const dayOfWeek = today.getDay();

  const daysUntilFriday = (5 - dayOfWeek + 7) % 7;

  nextFriday.setDate(today.getDate() + daysUntilFriday);
  return nextFriday.toISOString().split("T")[0];
}

function AdminPage() {
  const [error, setError] = useState("");

  const [date, setMeetingDate] = useState(getNextFriday());
  const [time, setTime] = useState("11:00");
  const [employees, setEmployees] = useState<Option[]>([]);

  const [blocks, setBlocks] = useState([
    { type: "lifehack", participants: [] as number[], description: null },
    { type: "code_review", participants: [] as number[], description: null },
  ]);

  function validateForm() {
    const hasEmptyParticipants = blocks.some(
      (block) => block.participants.length === 0,
    );

    if (hasEmptyParticipants) {
      setError("В каждом блоке должен быть хотя бы один участник");
      return false;
    }

    const extraBlock = blocks.find((block) => block.type === "extra");
    if (extraBlock && !extraBlock.description) {
      setError("Заполните описание для блока 'Дополнительно'");
      return false;
    }

    setError("");
    return true;
  }

  useEffect(() => {
    axios.get("/api/employees").then((res) => {
      const options = res.data.map((emp: Employee) => ({
        value: String(emp.id),
        label: emp.full_name,
      }));
      setEmployees(options);
    });
  }, []);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      date,
      time,
      blocks,
    };

    try {
      await axios.post("api/meetings", payload);
      alert("Планёрка создана!");
    } catch (err) {
      console.log((err as Error).message);
    }

    console.log("Отправляем:", date, time);
  }

  return (
    <form>
      <h1>Создание новой планерки</h1>

      <div id="meet-timing">
        <div id="date">
          <label htmlFor="meeting-date">Дата</label>
          <input
            id="meeting-date"
            type="date"
            value={date}
            onChange={(e) => setMeetingDate(e.target.value)}
          />
        </div>

        <div id="time">
          <label htmlFor="meeting-time">Время</label>
          <input
            id="meeting-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="blocks">
        <h2>Блоки планерки</h2>
        {error && <div className="error">{error}</div>}
        <div>
          <div className="block">
            <div id="lifehacks">
              <h3>Лайфхаки</h3>

              <div className="select-wrapper">
                <Select
                  isMulti
                  options={employees}
                  placeholder="Выбрать участников..."
                  onChange={(selected) => {
                    const ids = selected.map((item) => Number(item.value));
                    setBlocks((prev) => {
                      const newBlocks = [...prev];
                      newBlocks[0].participants = ids;
                      return newBlocks;
                    });
                  }}
                />
              </div>

              <button type="button" id="dlt-btn">
                Удалить
              </button>
            </div>
          </div>

          <div className="block">
            <div id="code-review">
              <h3>Код-ревью</h3>
              <div className="select-wrapper">
                <Select
                  isMulti
                  options={employees}
                  placeholder="Выбрать участников..."
                  onChange={(selected) => {
                    const ids = selected.map((item) => Number(item.value));
                    setBlocks((prev) => {
                      const newBlocks = [...prev];
                      newBlocks[1].participants = ids;
                      return newBlocks;
                    });
                  }}
                />
              </div>
              <button type="button" id="dlt-btn">
                Удалить
              </button>
            </div>
          </div>
          <button id="add-btn">+ Добавить блок</button>
        </div>
      </div>

      <button id="submit-btn" onClick={handleSubmit}>
        Создать планерку
      </button>
    </form>
  );
}

export default AdminPage;

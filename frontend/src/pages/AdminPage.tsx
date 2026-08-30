import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import "./AdminPage.css";

type Employee = {
  id: number;
  full_name: string;
};

type Option = { value: string; label: string };

function AdminPage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [employees, setEmployees] = useState<Option[]>([]);

  const [blocks, setBlocks] = useState([
    { type: "lifehack", participants: [] as number[], description: null },
    { type: "code_review", participants: [] as number[], description: null },
  ]);

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
            onChange={(e) => setDate(e.target.value)}
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

      <div>
        <h2>Блоки планерки</h2>
        <div id="blocks">
          <div className="block">
            <div id="lifehacks">
              <h3>Лайфхаки</h3>
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
              <button type="button">Удалить</button>
            </div>
          </div>

          <div className="block">
            <div id="code-review">
              <h3>Код-ревью</h3>
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
              <button type="button">Удалить</button>
            </div>
          </div>
        </div>
      </div>

      <button id="add-btn">+ Дополнительно</button>
      <button id="submit-btn" onClick={handleSubmit}>
        Создать планерку
      </button>
    </form>
  );
}

export default AdminPage;

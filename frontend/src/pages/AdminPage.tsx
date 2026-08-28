import { useState } from "react";

import Select from "react-select";

import "./AdminPage.css";

import axios from "axios";

function AdminPage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const options = [
    { value: "1", label: "employee1" },
    { value: "2", label: "employee2" },
    { value: "3", label: "employee3" },
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      date,
      time,
      blocks: [],
    };

    try {
      await axios.post("/api/meetings", payload);
    } catch (err) {
      console.log(err.message);
    }

    console.log("Отправляем:", date, time);
  }

  return (
    <>
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
                  options={options}
                  placeholder="Выбрать участников..."
                />
                <button>Удалить </button>
              </div>
            </div>

            <div className="block">
              <div id="code-review">
                <h3>Код-ревью</h3>
                <Select
                  isMulti
                  options={options}
                  placeholder="Выбрать участников..."
                />
                <button>Удалить </button>
              </div>
            </div>
          </div>
        </div>
        <button id="add-btn">+ Дополнительно</button>
        <button id="submit-btn" onClick={handleSubmit}>
          Создать планерку
        </button>
      </form>
    </>
  );
}

export default AdminPage;

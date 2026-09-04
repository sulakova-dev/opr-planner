import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

import "./AdminPage.css";

type Employee = {
  id: number;
  full_name: string;
};

type BlockType = "lifehack" | "code_review" | "extra";

const blockInfo: Record<BlockType, { title: string }> = {
  lifehack: { title: "Лайфхаки" },
  code_review: { title: "Код-ревью" },
  extra: { title: "Дополнительно" },
};

type Option = { value: string; label: string };

function getNextFriday() {
  const today = new Date();
  const nextFriday = new Date(today);

  const dayOfWeek = today.getDay();

  const daysUntilFriday = (5 - dayOfWeek + 7) % 7;

  nextFriday.setDate(today.getDate() + daysUntilFriday);

  const year = nextFriday.getFullYear();
  const month = String(nextFriday.getMonth() + 1).padStart(2, "0");
  const day = String(nextFriday.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

  //const [showMenu, setShowMenu] = useState(false);


  function handleDeleteBlock(index: number) {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
  }

  function handleAddBlock() {
    const newBlocks = [
      ...blocks,
      { type: "extra", participants: [] as number[], description: null },
    ];
    console.log("Добавляю блок:", newBlocks);
    setBlocks(newBlocks);
  }

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
  const [showMenu, setShowMenu] = useState(false);
  const availableTypes = ["lifehack", "code_review", "extra"].filter(
    (type) => !blocks.some((block) => block.type === type),
  );
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

        {blocks.length === 0 ? (
          <div id="no-blocks-message">
            <p>Сейчас блоков нет. Добавьте блок, чтобы создать встречу.</p>
            <button id="add-btn" type="button" onClick={() => handleAddBlock()}>
              + Добавить блок
            </button>

            {showMenu && availableTypes.length > 0 && (
              <div className="add-block-menu">
                {availableTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      handleAddBlock(type as BlockType);
                      setShowMenu(false);
                    }}
                  >
                    {blockInfo[type as keyof typeof blockInfo]?.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {blocks.map((block, i) => (
              <div className="block" key={i}>
                <div className="block-content">
                  <h3>
                    {blockInfo[block.type as keyof typeof blockInfo]?.title}
                  </h3>

                  {block.type === "extra" ? (
                    <div className="description">
                      <textarea
                        placeholder="Тема для обсуждения"
                        value={block.description || ""}
                      />
                    </div>
                  ) : (
                    <div className="select-wrapper">
                      <Select
                        isMulti
                        options={employees}
                        placeholder="Выбрать участников..."
                        onChange={(selected) => {
                          const ids = selected.map((item) =>
                            Number(item.value),
                          );
                          setBlocks((prev) => {
                            const newBlocks = [...prev];
                            newBlocks[i].participants = ids;
                            return newBlocks;
                          });
                        }}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    id="dlt-btn"
                    onClick={() => handleDeleteBlock(i)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
            <button id="add-btn" type="button" onClick={() => handleAddBlock()}>
              + Добавить блок
            </button>
          </div>
        )}
      </div>

      <button id="submit-btn" onClick={handleSubmit}>
        Создать планерку
      </button>
    </form>
  );
}

export default AdminPage;

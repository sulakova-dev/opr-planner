import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

import { BLOCK_CONFIG, type BlockType } from "../constants/blockConfig";
import type { Employee, Option } from "../types";
import { getNextFriday } from "../utils/dateUtils";
import "./AdminPage.css";

function AdminPage() {
  const [formData, setFormData] = useState({
    date: getNextFriday(),
    time: "11:00",
  });

  const initialBlocks = (Object.keys(BLOCK_CONFIG) as BlockType[])
    .filter((type) => BLOCK_CONFIG[type].default)
    .map((type) => ({
      type,
      participants: [] as number[],
      description: "",
    }));
  const [blocks, setBlocks] = useState(initialBlocks);

  const [employees, setEmployees] = useState([] as Option[]);
  const [error, setError] = useState("");

  const [showMenu, setShowMenu] = useState(false);

  const availableTypes = (Object.keys(BLOCK_CONFIG) as BlockType[]).filter(
    (type) => !blocks.some((block) => block.type === type),
  );

  function handleAddBlock(type: BlockType) {
    setBlocks([
      ...blocks,
      { type, participants: [] as number[], description: "" },
    ]);
  }

  function handleDeleteBlock(index: number) {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
  }

  function validateForm() {
    if (blocks.length === 0) {
      setError("Добавьте хотя бы один блок");
      return false;
    }

    const blocksWithParticipants = blocks.filter(
      (block) => block.type !== "extra",
    );

    const hasEmptyParticipants = blocksWithParticipants.some(
      (block) => block.participants.length === 0,
    );

    if (hasEmptyParticipants) {
      setError(
        "В каждом блоке (кроме 'Дополнительно') должен быть хотя бы один участник",
      );
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

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      date: formData.date,
      time: formData.time,
      blocks,
    };

    try {
      const response = await axios.post("api/meetings", payload);

      if (response.status === 201 || response.status === 200) {
        alert("Планёрка создана!");

        setBlocks(initialBlocks);
        setFormData({
          date: getNextFriday(),
          time: "11:00",
        });
        setShowMenu(false);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          alert("Сервер не найден. Проверьте адрес API.");
        } else if (err.response?.status === 500) {
          alert("Ошибка на сервере. Попробуйте позже.");
        } else {
          alert(`Ошибка: ${err.response?.data?.error || err.message}`);
        }
      } else {
        alert("Неизвестная ошибка. Проверьте консоль.");
      }
      console.error("Ошибка при создании планёрки:", err);
    }
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

  return (
    <form>
      <h1>Создание новой планерки</h1>

      <div id="meet-timing">
        <div id="date">
          <label htmlFor="meeting-date">Дата</label>
          <input
            id="meeting-date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div id="time">
          <label htmlFor="meeting-time">Время</label>
          <input
            id="meeting-time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
      </div>

      <div className="blocks">
        <h2>Блоки планерки</h2>

        {error && <div className="error">{error}</div>}

        {blocks.length === 0 ? (
          <div id="no-blocks-message">
            <p>Сейчас блоков нет. Добавьте блок, чтобы создать встречу.</p>
            <button
              id="add-btn"
              type="button"
              onClick={() => setShowMenu(!showMenu)}
            >
              + Добавить блок
            </button>
          </div>
        ) : (
          <div>
            {blocks.map((block, i) => (
              <div className="block" key={i}>
                <div className="block-content">
                  <h3>
                    {
                      BLOCK_CONFIG[block.type as keyof typeof BLOCK_CONFIG]
                        ?.title
                    }
                  </h3>

                  {block.type === "extra" ? (
                    <div className="description">
                      <textarea
                        placeholder="Тема для обсуждения"
                        value={block.description || ""}
                        onChange={(e) => {
                          setBlocks((prev) => {
                            const newBlocks = [...prev];
                            newBlocks[i].description = e.target.value;
                            return newBlocks;
                          });
                        }}
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
            <button
              id="add-btn"
              type="button"
              onClick={() => setShowMenu(!showMenu)}
            >
              + Добавить блок
            </button>
          </div>
        )}
      </div>

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
              {BLOCK_CONFIG[type as keyof typeof BLOCK_CONFIG]?.title}
            </button>
          ))}
        </div>
      )}

      <button id="submit-btn" onClick={handleSubmit}>
        Создать планерку
      </button>
    </form>
  );
}

export default AdminPage;

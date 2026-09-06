import { useState } from "react";
import "./Header.css";

function Header() {
  const isAdminPage = window.location.pathname === "/admin";
  const [showAuth, setShowAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        localStorage.setItem("adminAuth", "true");
        window.location.href = "/admin";
      } else {
        setAuthError("Неверный пароль");
      }
    } catch {
      setAuthError("Ошибка подключения к серверу");
    }
  };

  const handleOpenAuth = () => {
    const isAuth = localStorage.getItem("adminAuth") === "true";
    if (isAuth) {
      window.location.href = "/admin";
    } else {
      setShowAuth(true);
    }
  };

  return (
    <>
      <header>
        <div id="header-info">
          <div>
            <span id="page-title">ПЛАНЁРКИ</span>
            <span>НЕОСИСТЕМЫ</span>
          </div>
          {!isAdminPage && (
            <button id="add-planer" onClick={handleOpenAuth}>
              +
            </button>
          )}
        </div>
      </header>

      {showAuth && (
        <div className="auth-overlay" onClick={() => setShowAuth(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Вход в админку</h2>
            <form onSubmit={handleAuth}>
              <input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {authError && <p className="auth-error">{authError}</p>}
              <div className="auth-actions">
                <button type="submit">Войти</button>
                <button type="button" onClick={() => setShowAuth(false)}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;

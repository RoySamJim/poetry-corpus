// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PoemList from "./components/PoemList";
import FilterPanel from "./components/FilterPanel";
import PoemPage from "./components/PoemPage";

function AppContent() {
  const [poems, setPoems] = useState([]);
  const [filteredPoems, setFilteredPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/poems.json")
      .then((response) => response.json())
      .then((data) => {
        setPoems(data);
        setFilteredPoems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        setLoading(false);
      });
  }, []);

  const applyFilters = (filters) => {
    let result = [...poems];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((poem) => {
        const title = poem.title ? poem.title.toLowerCase() : "";
        const displayTitle = poem.display_title
          ? poem.display_title.toLowerCase()
          : "";
        const text = poem.text ? poem.text.toLowerCase() : "";
        return (
          title.includes(searchLower) ||
          displayTitle.includes(searchLower) ||
          text.includes(searchLower)
        );
      });
    }

    if (filters.minLines) {
      result = result.filter(
        (poem) => poem.lineCount >= parseInt(filters.minLines)
      );
    }
    if (filters.maxLines) {
      result = result.filter(
        (poem) => poem.lineCount <= parseInt(filters.maxLines)
      );
    }

    if (filters.hasTitle === "with") {
      result = result.filter((poem) => poem.hasTitle === true);
    } else if (filters.hasTitle === "without") {
      result = result.filter((poem) => poem.hasTitle === false);
    }

    if (filters.inCycle !== undefined) {
      if (filters.inCycle === "yes") {
        result = result.filter((poem) => poem.in_cycle === true);
      } else if (filters.inCycle === "no") {
        result = result.filter((poem) => poem.in_cycle === false);
      }
    }

    setFilteredPoems(result);
    setShowFilters(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Загрузка стихотворений...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {" "}
      {/* Добавлен relative на контейнер */}
      <div className="grid grid-cols-[128px_1fr_128px] gap-4 items-start mb-8">
        {/* grid-cols создает 3 колонки: левая (для фильтров), центральная (для заголовка), правая (пустая) */}
        {/* 128px примерно соответствует ширине кнопки + немного отступа */}
        <div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {showFilters ? "Скрыть" : "Фильтры"}
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Стихотворения Б.И. Непомнящего
          </h1>
          <p className="text-gray-600">Избранное, 2020</p>
        </div>
        <div></div> {/* Пустая правая колонка */}
      </div>
      {/* Абсолютно позиционированная панель фильтров, не влияет на поток */}
      {showFilters && (
        <div className="absolute top-24 left-4 w-96 z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          {/* top-24 примерно на уровне заголовка + немного ниже */}
          {/* left-4 примерно соответствует левому отступу контейнера px-4 */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Фильтры</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Закрыть фильтры"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <FilterPanel
            onApplyFilters={applyFilters}
            poemCount={filteredPoems.length}
          />
        </div>
      )}
      {/* Список стихотворений теперь будет в левой колонке, выровнен по левой границе заголовка */}
      {/* Так как PoemList теперь находится в левой колонке grid-а, его левая граница совпадает с левой границей заголовка */}
      <div className="grid grid-cols-[128px_1fr_128px] gap-4">
        <div></div> {/* Пустая левая колонка */}
        <div>
          <PoemList poems={filteredPoems} />
        </div>
        <div></div> {/* Пустая правая колонка */}
      </div>
      {filteredPoems.length === 0 && (
        <div className="grid grid-cols-[128px_1fr_128px] gap-4">
          <div></div>
          <div className="text-center py-8 text-gray-500">
            Стихотворения по заданным фильтрам не найдены.
          </div>
          <div></div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/poem/:id" element={<PoemPage />} />
      </Routes>
    </Router>
  );
}

export default App;

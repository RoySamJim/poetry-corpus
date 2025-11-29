// src/components/PoemPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PoemCard from "./PoemCard";

const PoemPage = () => {
  const { id } = useParams();
  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Состояния для модального окна
  const [morphModalOpen, setMorphModalOpen] = useState(false);
  const [morphData, setMorphData] = useState(null);
  const [clickedWord, setClickedWord] = useState("");

  useEffect(() => {
    fetch("/poems.json")
      .then((response) => response.json())
      .then((data) => {
        const foundPoem = data.find((p) => p.id === parseInt(id));
        if (foundPoem) {
          setPoem(foundPoem);
        } else {
          setError("Стихотворение не найдено");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки стихотворения:", err);
        setError("Ошибка загрузки данных");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Загрузка...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Стихотворение не найдено
      </div>
    );
  }

  const getDisplayTitle = (p) => {
    if (p.display_title) {
      return p.display_title;
    }
    if (!p.title || p.title === "***" || p.title.trim() === "") {
      const lines = p.text.split("\n").filter((line) => line.trim() !== "");
      return lines[0] || "Без названия";
    }
    return p.title;
  };

  // Функция для обработки клика по слову
  const handleWordClick = (word, lineIndex, wordInLineIndex) => {
    setClickedWord(word);
    if (
      poem.lines_morph &&
      poem.lines_morph[lineIndex] &&
      poem.lines_morph[lineIndex][wordInLineIndex]
    ) {
      // Получаем все возможные анализы для этого слова
      const analyses = poem.lines_morph[lineIndex][wordInLineIndex];
      setMorphData(analyses);
      setMorphModalOpen(true);
    } else {
      // Если данные отсутствуют
      setMorphData([
        { word, normal_form: "Анализ недоступен", pos: "N/A", grammeme: "N/A" },
      ]);
      setMorphModalOpen(true);
    }
  };

  // Функция для отображения текста стихотворения с кликабельными словами
  const renderPoemText = () => {
    if (!poem.lines) {
      // Если lines нет, разбиваем text на строки
      const lines = poem.text.split("\n");
      return lines.map((line, lineIndex) => (
        <div key={lineIndex} className="mb-1">
          {line.split(" ").map((word, wordIndex) => {
            const cleanWord = word.replace(/[.,;:!?()"\-]/g, "");
            if (cleanWord) {
              return (
                <span
                  key={wordIndex}
                  onClick={() =>
                    handleWordClick(cleanWord, lineIndex, wordIndex)
                  }
                  className="cursor-pointer hover:bg-yellow-100 border-b border-dotted border-gray-400"
                >
                  {word}{" "}
                </span>
              );
            } else {
              return <span key={wordIndex}>{word} </span>;
            }
          })}
        </div>
      ));
    } else {
      // Если lines есть, используем его
      return poem.lines.map((line, lineIndex) => {
        // Используем poem.lines_morph для получения индексов слов, если доступно
        const wordsInLine = line.split(" ");
        return (
          <div key={lineIndex} className="mb-1">
            {wordsInLine.map((word, wordIndex) => {
              const cleanWord = word.replace(/[.,;:!?()"\-]/g, "");
              if (cleanWord) {
                return (
                  <span
                    key={wordIndex}
                    onClick={() =>
                      handleWordClick(cleanWord, lineIndex, wordIndex)
                    }
                    className="cursor-pointer hover:bg-yellow-100 border-b border-dotted border-gray-400"
                  >
                    {word}{" "}
                  </span>
                );
              } else {
                return <span key={wordIndex}>{word} </span>;
              }
            })}
          </div>
        );
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {getDisplayTitle(poem)}
        </h1>
        <PoemCard poem={poem} />
      </div>
      <div className="mb-4 text-sm text-gray-600">
        {poem.author && <span>Автор: {poem.author}</span>}
        {poem.year && <span>, {poem.year}</span>}
        {poem.source && <span>, {poem.source}</span>}
        {poem.in_cycle && poem.cycle_name && (
          <span>, Цикл: {poem.cycle_name}</span>
        )}
        {poem.metre && <span>, Размер: {poem.metre}</span>}
      </div>
      <div className="whitespace-pre-wrap text-gray-700 border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
        {renderPoemText()}
      </div>

      {/* Модальное окно для морфологического анализа */}
      {morphModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">
                  Морфологический разбор: "{clickedWord}"
                </h3>
                <button
                  onClick={() => setMorphModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 absolute top-4 right-4"
                  aria-label="Закрыть модальное окно"
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
              {morphData && morphData.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {morphData.map((analysis, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      <p className="text-sm">
                        <strong>Лемма:</strong> {analysis.normal_form}
                      </p>
                      <p className="text-sm">
                        <strong>Часть речи:</strong> {analysis.pos || "N/A"}
                      </p>
                      <p className="text-sm">
                        <strong>Граммемы:</strong> {analysis.grammeme}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Анализ недоступен</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoemPage;

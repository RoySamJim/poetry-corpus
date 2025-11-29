// src/components/PoemCard.jsx
import { useState } from "react";
// Импортируем иконку из Lucide React
import { Info } from "lucide-react";

const PoemCard = ({ poem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getOriginalTitle = () => {
    if (!poem.title || poem.title === "***" || poem.title.trim() === "") {
      return "Отсутствует";
    }
    return poem.title;
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="ml-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        aria-label="Показать метаданные"
      >
        {/* Заменяем иконку на Info из Lucide React */}
        <Info className="h-5 w-5 text-gray-500" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900">Метаданные</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
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
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="font-medium text-gray-500">Автор:</dt>
                  <dd className="text-gray-900">{poem.author}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="font-medium text-gray-500">Год:</dt>
                  <dd className="text-gray-900">{poem.year}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="font-medium text-gray-500">Источник:</dt>
                  <dd className="text-gray-900 text-right">{poem.source}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="font-medium text-gray-500">Строк:</dt>
                  <dd className="text-gray-900">{poem.lineCount}</dd>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="font-medium text-gray-500">В цикле:</dt>
                  <dd className="text-gray-900">
                    {poem.in_cycle ? "Да" : "Нет"}
                  </dd>
                </div>
                {poem.in_cycle && (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <dt className="font-medium text-gray-500">Цикл:</dt>
                    <dd className="text-gray-900 text-right">
                      {poem.cycle_name}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="font-medium text-gray-500">Название:</dt>
                  <dd className="text-gray-900">
                    {poem.hasTitle
                      ? "Есть"
                      : "Нет (используется первая строка)"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-gray-500">
                    Ориг. заголовок:
                  </dt>
                  <dd className="text-gray-900 text-right">
                    {getOriginalTitle()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PoemCard;

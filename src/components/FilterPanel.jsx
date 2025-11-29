import { useForm } from "react-hook-form";
import { Search } from "lucide-react";

const FilterPanel = ({ onApplyFilters, poemCount }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    onApplyFilters(data);
  };

  const handleReset = () => {
    reset();
    onApplyFilters({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Фильтры</h2>
        <span className="text-sm text-gray-600">
          Найдено: {poemCount} стихотворений
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Поиск по тексту */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Поиск по тексту
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              {...register("search")}
              placeholder="Введите текст для поиска..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Количество строк */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Строк от
            </label>
            <input
              type="number"
              {...register("minLines")}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Строк до
            </label>
            <input
              type="number"
              {...register("maxLines")}
              placeholder="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Применить
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Сбросить
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterPanel;

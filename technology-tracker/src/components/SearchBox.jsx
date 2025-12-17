import './styles/SearchBox.css';

const SearchBox = ({ searchQuery, setSearchQuery, resultCount }) => {
  return (
    <div className="search-box" >
      <input
        type="text"
        placeholder="⌕ Поиск технологий..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <span>Найдено: {resultCount}</span>
    </div>
  );
};

export default SearchBox;
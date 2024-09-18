import { useState,useEffect, useCallback, useMemo } from 'react';
import { Collection } from './Collection';
import Popup from './Popup';

import './index.css';
import { getCategories, getCollections, getFilteredCollections } from './api';
import { debounce } from './utils';

function App() {
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentCategory, setCurrentCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(0);
  
  const [detailCollection, setDetailCollection] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const [collectionsData, categoriesData] = await Promise.all([
          getCollections(),
          getCategories()
        ]);
        setCollections(collectionsData);
        setCategories(categoriesData);
      } catch (err) {
        console.warn(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = useMemo(() => Math.ceil(collections.length / 3), [collections.length]);

  const changeCategory = useCallback((categoryId) => {
    if (currentCategory === categoryId) {
      return;
    } else {
      setCurrentCategory(categoryId);
      setPage(0);
      setIsLoading(true);

      getFilteredCollections(categoryId, searchQuery)
        .then(data => setCollections(data))
        .catch(err => console.warn(err))
        .finally(() => setIsLoading(false));
    }
  }, [currentCategory, searchQuery]);

  const handleSearchDebounced = useCallback(debounce((categoryId, value) => {
    setIsLoading(true);

    getFilteredCollections(categoryId, value)
      .then(data => setCollections(data))
      .catch(err => console.warn(err))
      .finally(() => setIsLoading(false));
  }, 300), []);

  const handleChangeQuery = (e) => {
    const value = e.target.value;

    setSearchQuery(value);
    handleSearchDebounced(currentCategory, value);
  }

  return (
    <div className="App">
      <h1>Photo gallery</h1>
      {categories.length > 0 && (
        <div className="top">
          <ul className="tags">
            {categories.map(category => (
              <li
                key={category.id}
                className={currentCategory === category.id ? 'active' : ''}
                onClick={() => changeCategory(category.id)}
              >{category.name}</li>
            ))}
          </ul>
          <input
            className="search-input"
            placeholder="Search for name..."
            value={searchQuery}
            onChange={handleChangeQuery}
          />
        </div>
      )}
      {isLoading && (
        <div className="loader">
          <svg className="pl2" viewBox="0 0 128 128" width="128px" height="128px">
            <g fill="var(--primary)">
              <g className="pl2__rect-g">
                <rect className="pl2__rect" rx="8" ry="8" x="0" y="128" width="40" height="24" transform="rotate(180)" />
              </g>
              <g className="pl2__rect-g">
                <rect className="pl2__rect" rx="8" ry="8" x="44" y="128" width="40" height="24" transform="rotate(180)" />
              </g>
              <g className="pl2__rect-g">
                <rect className="pl2__rect" rx="8" ry="8" x="88" y="128" width="40" height="24" transform="rotate(180)" />
              </g>
            </g>
            <g fill="hsl(283,90%,50%)" mask="url(#pl-mask)">
              <g className="pl2__rect-g">
                <rect className="pl2__rect" rx="8" ry="8" x="0" y="128" width="40" height="24" transform="rotate(180)" />
              </g>
              <g className="pl2__rect-g">
                <rect className="pl2__rect" rx="8" ry="8" x="44" y="128" width="40" height="24" transform="rotate(180)" />
              </g>
              <g className="pl2__rect-g">
                <rect className="pl2__rect" rx="8" ry="8" x="88" y="128" width="40" height="24" transform="rotate(180)" />
              </g>
            </g>
          </svg>
        </div>
      )}
      {!isLoading && collections.length > 0 && (
        <>
          <div className="content">
            {collections.slice(3 * page, 3 * page + 3).map(collection => (
              <Collection
                name={collection.name}
                images={collection.photos}
                key={collection.id}
                openPopup={() => setDetailCollection(collection)}
              />
            ))}
          </div>
          <ul className="pagination">
            {total > 1 && [...Array(total)].map((_, i) => (
              <li
                key={i}
                className={page === i ? 'active' : ''}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </li>
            ))}
          </ul>
        </>
      )}
      {!isLoading && collections.length === 0 && (<div className="no-results">No results found.</div>)}
      <Popup collection={detailCollection} closePopup={() => setDetailCollection(null)} />
    </div>
  )
}

export default App

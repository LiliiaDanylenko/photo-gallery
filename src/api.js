const API_KEY = import.meta.env.VITE_API_KEY;

export function getCollections() {
  return fetch(`https://${API_KEY}.mockapi.io/api/collections?`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'Unexpected error',
    }));
}

export function getFilteredCollections(categoryId, searchQuery) {
  const params = new URLSearchParams();
  
  if (categoryId && categoryId !== 1) {
    params.append('category', categoryId);
  }
  
  if (searchQuery && searchQuery.trim()) {
    params.append('name', searchQuery.toLowerCase().trim());
  }

  const url = `https://${API_KEY}.mockapi.io/api/collections`;
  const queryString = params.toString();

  const fetchUrl = queryString ? `${url}?${queryString}` : url;

  return fetch(fetchUrl)
    .then(res => {
      if (!res.ok) {
        return [];
      }

      return res.json();
    })
    .catch(() => ({
      Response: 'False',
      Error: 'Unexpected error',
    }));
}

export function getCategories() {
  return fetch(`https://${API_KEY}.mockapi.io/api/categories`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'Unexpected error',
    }));
}
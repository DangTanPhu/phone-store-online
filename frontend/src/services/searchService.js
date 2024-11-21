import axios from 'axios';

export const getSearchSuggestions = async (query) => {
  try {
    const response = await axios.get(`http://localhost:7070/api/products/search/suggestions?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

export const searchProducts = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(`/api/products/search?${queryString}`);
  return response.data;
};  
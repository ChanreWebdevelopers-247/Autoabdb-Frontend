import axiosInstance from '@/utils/axiosSetup';

// Fetch disease statistics from backend
export const getDiseaseStatistics = async () => {
  try {
    const response = await axiosInstance.get('/disease/statistics/overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching disease statistics:', error);
    throw error;
  }
};

// Fetch user statistics from backend (if needed)
export const getUserStatistics = async () => {
  try {
    const response = await axiosInstance.get('/users/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
};

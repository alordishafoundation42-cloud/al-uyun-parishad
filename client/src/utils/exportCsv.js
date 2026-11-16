import api from '../services/api';

/**
 * Downloads the full registrations list as a UTF-8 CSV file.
 * Handles authentication automatically via Axios request interceptor.
 */
export const downloadRegistrationsCSV = async () => {
  const response = await api.get('/admin/registrations/export', {
    responseType: 'blob'
  });

  // Create a Blob from the CSV Stream
  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `Al_Uyun_Parishad_Registrations_${dateStr}.csv`);
  
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

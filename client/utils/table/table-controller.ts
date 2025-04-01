import { API_URL } from '@/shared/config';
import { TTableData } from './types';

const TABLE_ENDPOINT = '/table/';

export const getTableData = async (): Promise<TTableData[]> => {
  const response = await fetch(`${API_URL}${TABLE_ENDPOINT}`);
  return response.json();
};

export const addDataToTable = async (
  data: TTableData['data']
): Promise<TTableData> => {
  const response = await fetch(`${API_URL}${TABLE_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteDataFromTable = async (id: string): Promise<void> => {
  try {
    await fetch(`${API_URL}${TABLE_ENDPOINT}${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete data from table:', error);
  }
};

'use client';

import { Socket, io } from 'socket.io-client';
import { TTableData, addDataToTable, getTableData } from '@/utils/table';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { API_URL } from '@/shared/config';

type TTableDataContextType = {
  tableData: TTableData[];
  addData: (data: TTableData['data']) => Promise<void>;
  isLoading: boolean;
};

const TableDataContext = createContext<TTableDataContextType | undefined>(
  undefined
);

export function TableDataProvider({ children }: { children: React.ReactNode }) {
  const [tableData, setTableData] = useState<TTableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await getTableData();
      if (Array.isArray(data)) {
        setTableData(data);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    fetchData();

    return () => {
      newSocket.disconnect();
    };
  }, [fetchData]);

  useEffect(() => {
    if (!socket) return;

    const handleTableInsert = (payload: TTableData) => {
      console.log('handleTableInsert', payload);
      setTableData((prev) => [payload, ...prev]);
    };

    const handleTableDelete = (payload: TTableData) => {
      console.log('handleTableDelete', payload);
      setTableData((prev) => prev.filter((item) => item.id !== payload.id));
    };

    socket.on('table_insert', handleTableInsert);
    socket.on('table_delete', handleTableDelete);

    return () => {
      socket.off('table_insert', handleTableInsert);
      socket.off('table_delete', handleTableDelete);
    };
  }, [socket]);

  const addData = useCallback(async (newData: TTableData['data']) => {
    try {
      await addDataToTable(newData);
    } catch (error) {
      console.error('Error adding data to table:', error);
    }
  }, []);

  const contextValue: TTableDataContextType = {
    tableData,
    addData,
    isLoading,
  };

  return (
    <TableDataContext.Provider value={contextValue}>
      {children}
    </TableDataContext.Provider>
  );
}

export function useTableData() {
  const context = useContext(TableDataContext);
  if (context === undefined) {
    throw new Error('useTableData must be used within a TableDataProvider');
  }
  return context;
}

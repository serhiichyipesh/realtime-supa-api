'use client';

import { CreateRowForm, TableDataRow } from '@/components/table-page';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Loader2 } from 'lucide-react';
import { deleteDataFromTable } from '@/utils/table';
import { useCallback } from 'react';
import { useTableData } from '@/shared/providers';

export default function TablePage() {
  const { tableData, isLoading } = useTableData();

  const handleDeleteData = useCallback(async (id: string) => {
    await deleteDataFromTable(id);
  }, []);

  return (
    <div className="space-y-4 px-12">
      <CreateRowForm />

      <div className="max-h-[50vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : tableData.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No data available. Add some data to get started.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>A list of dynamic data</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="border-b">
              {tableData.map((row) => (
                <TableDataRow
                  key={row.id}
                  row={row}
                  onDelete={handleDeleteData}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

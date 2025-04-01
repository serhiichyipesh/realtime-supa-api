import { TableCell, TableRow } from '../ui/table';
import { memo, useCallback, useState } from 'react';

import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { TTableData } from '@/utils/table';
import { cn } from '@/lib/utils';

export const TableDataRow = memo(
  ({
    row,
    onDelete,
  }: {
    row: TTableData;
    onDelete: (id: string) => Promise<void>;
  }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = useCallback(async () => {
      setIsDeleting(true);
      try {
        await onDelete(row.id);
      } catch (error) {
        console.error('Failed to delete row:', error);
        setIsDeleting(false);
      }
    }, [row.id, onDelete]);

    return (
      <TableRow key={row.id} className="border-x">
        {Object.entries(row.data).map(([key, value]) => (
          <TableCell key={key} className={cn('border-x')}>
            {key}: {value as React.ReactNode}
          </TableCell>
        ))}
        <TableCell className="grid items-center h-full">
          <Button
            className="ml-auto"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Del'}
          </Button>
        </TableCell>
      </TableRow>
    );
  }
);

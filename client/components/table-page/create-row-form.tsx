import { TTableData, addDataToTable } from '@/utils/table';
import { memo, useCallback, useMemo, useState } from 'react';

import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { TKeyValuePair } from '@/shared/config';

export const CreateRowForm = memo(() => {
  const [keyValuePairs, setKeyValuePairs] = useState<TKeyValuePair[]>([
    { id: crypto.randomUUID(), key: '', value: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPair = useCallback(() => {
    const lastPair = keyValuePairs[keyValuePairs.length - 1];
    if (lastPair.key === '' || lastPair.value === '') {
      return;
    }
    setKeyValuePairs((prev) => [
      ...prev,
      { id: crypto.randomUUID(), key: '', value: '' },
    ]);
  }, [keyValuePairs]);

  const handlePairChange = useCallback(
    (id: string, field: 'key' | 'value', value: string) => {
      setKeyValuePairs((prev) => {
        const newPairs = prev.map((pair) =>
          pair.id === id ? { ...pair, [field]: value } : pair
        );
        return newPairs;
      });
    },
    []
  );

  const canSubmit = useMemo(() => {
    const hasValidPair = keyValuePairs.some(
      (pair) => pair.key !== '' && pair.value !== ''
    );
    const allEnteredKeysHaveValues = keyValuePairs.every(
      (pair) => pair.key === '' || (pair.key !== '' && pair.value !== '')
    );

    return hasValidPair && allEnteredKeysHaveValues && !isSubmitting;
  }, [keyValuePairs, isSubmitting]);

  const handleSendData = useCallback(async () => {
    if (!canSubmit) return;

    const dataToSend = keyValuePairs.reduce<TTableData['data']>((acc, pair) => {
      if (pair.key) {
        acc[pair.key] = pair.value;
      }
      return acc;
    }, {});

    setIsSubmitting(true);
    try {
      await addDataToTable(dataToSend);
      setKeyValuePairs([{ id: crypto.randomUUID(), key: '', value: '' }]);
    } catch (error) {
      console.error('Failed to submit data:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [keyValuePairs, canSubmit, addDataToTable]);

  return (
    <div className="space-y-2">
      {keyValuePairs.map(({ id, key, value }) => (
        <div key={id} className="flex gap-2 *:flex-1">
          <input
            type="text"
            placeholder="Key"
            value={key}
            onChange={(e) => handlePairChange(id, 'key', e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Value"
            value={value}
            onChange={(e) => handlePairChange(id, 'value', e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      ))}

      <div className="flex flex-row gap-2 justify-between *:flex-1">
        <Button
          onClick={handleAddPair}
          disabled={
            keyValuePairs[keyValuePairs.length - 1].key === '' ||
            keyValuePairs[keyValuePairs.length - 1].value === '' ||
            isSubmitting
          }
        >
          Add Pair
        </Button>
        <Button onClick={handleSendData} disabled={!canSubmit}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Data'
          )}
        </Button>
      </div>
    </div>
  );
});

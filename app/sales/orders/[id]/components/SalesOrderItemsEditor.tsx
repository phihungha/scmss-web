'use client';

import { getProducts } from '@/app/api/product';
import AutoCompleteItemPreview from '@/app/components/AutoCompleteItemPreview';
import ItemsEditor from '@/app/components/ItemsEditor';
import { SalesOrderItem } from '@/app/models/sales-order';
import { AutoCompleteItem } from '@choc-ui/chakra-autocomplete';
import { useQuery } from 'react-query';
import SalesOrderItemEditCard from './SalesOrderItemEditCard';

export interface SalesOrderItemsEditorProps {
  items: SalesOrderItem[];
  onItemsChange: (value: SalesOrderItem[]) => void;
}

export default function SalesOrderItemsEditor({
  items,
  onItemsChange,
}: SalesOrderItemsEditorProps) {
  const { data: products } = useQuery({
    queryKey: ['product'],
    queryFn: () => getProducts(),
  });

  const createNewItem = (id: number): SalesOrderItem => {
    const product = products?.find((i) => i.id === id);

    if (!product) {
      throw new Error('Product ID not found.');
    }

    return {
      itemId: product.id,
      product,
      quantity: 1,
      unit: product.unit,
      unitPrice: product.price,
      totalPrice: product.price,
    };
  };

  const alreadyAddedItemIds = new Set(items.map((i) => i.itemId));

  const itemAddSelections = products
    ?.filter(({ id }) => !alreadyAddedItemIds.has(id))
    .map((product) => (
      <AutoCompleteItem
        key={product.id}
        label={product.name}
        value={product.id}
        textTransform="capitalize"
      >
        <AutoCompleteItemPreview
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
        />
      </AutoCompleteItem>
    ));

  return (
    <ItemsEditor
      items={items}
      onItemsChange={onItemsChange}
      createNewItem={createNewItem}
      getItemId={(i) => i.itemId}
      itemAddSelections={itemAddSelections}
    >
      {(onQuantityChange, onDelete) =>
        items.map((item) => (
          <SalesOrderItemEditCard
            key={item.itemId}
            item={item}
            onQuantityChange={onQuantityChange}
            onDelete={onDelete}
          />
        ))
      }
    </ItemsEditor>
  );
}
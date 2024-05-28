import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';

interface IncrementQuantityProps {
  productId: string;
  initialQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

const IncrementQuantity: React.FC<IncrementQuantityProps> = ({
  productId,
  initialQuantity,
  onQuantityChange,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const { updateItemQuantity } = useCart();

  const increment = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateItemQuantity(productId, newQuantity);
    onQuantityChange(newQuantity);
  };

  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateItemQuantity(productId, newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={decrement}
        disabled={quantity <= 1}
        className="decrement-button"
      >
        -
      </button>
      <span>{quantity}</span>
      <button onClick={increment} className="increment-button">
        +
      </button>
    </div>
  );
};

export default IncrementQuantity;

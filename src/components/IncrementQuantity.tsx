import React, { useState, ChangeEvent } from 'react';

type IncrementQuantityProps = {
  initialQuantity?: number;
  onChange?: (newQuantity: number) => void;
};

const IncrementQuantity: React.FC<IncrementQuantityProps> = ({
  initialQuantity = 1,
  onChange,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (onChange) {
      onChange(newQuantity);
    }
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(quantity - 1, 0);
    setQuantity(newQuantity);
    if (onChange) {
      onChange(newQuantity);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setQuantity(newQuantity);
      if (onChange) {
        onChange(newQuantity);
      }
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleDecrement}
        className="border-muted-foreground px-2 py-1"
      >
        -
      </button>
      <input
        type="number"
        min="0"
        value={quantity}
        onChange={handleChange}
        className="text-center border border-muted-foreground w-10 h-5 px-2 py-1 no-spinner"
      />
      <button
        onClick={handleIncrement}
        className="border-muted-foreground px-2 py-1"
      >
        +
      </button>
    </div>
  );
};

export default IncrementQuantity;

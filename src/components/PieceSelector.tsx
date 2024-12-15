import { useState, useEffect } from "preact/hooks";
import type { Piece } from "../utils/solver";

interface Props {
  id: number;
  onChange: (piece: Piece) => void;
}

const GRID_SIZE = 5;

export default function PieceSelector({ id, onChange }: Props) {
  const [grid, setGrid] = useState<boolean[]>(
    new Array(GRID_SIZE * GRID_SIZE).fill(false),
  );

  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(false);

  const updateCell = (index: number, value: boolean) => {
    const newGrid = [...grid];
    newGrid[index] = value;
    setGrid(newGrid);
    onChange({ id, pattern: newGrid });
  };

  const handleMouseDown = (index: number) => {
    setIsDragging(true);
    setDragValue(!grid[index]);
    updateCell(index, !grid[index]);
  };

  const mouseEnter = (index: number) => {
    if (isDragging) {
      updateCell(index, dragValue);
    }
  };

  const mouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mouseup", mouseUp);
    return () => window.removeEventListener("mouseup", mouseUp);
  }, []);

  return (
    <div className="p-2 md:p-3 bg-container-bg rounded-xl shadow-lg">
      <div className="grid grid-cols-5 gap-[1px] bg-gray-800/50 p-[0.5px] md:gap-0.5 md:p-1 rounded-lg">
        {grid.map((filled, index) => (
          <button
            key={index}
            className={`w-5 h-5 md:w-6 md:h-6 rounded-sm ${
              filled ? "bg-cell-filled" : "bg-cell-bg"
            } hover:brightness-110 transition-all`}
            onMouseDown={() => handleMouseDown(index)}
            onMouseEnter={() => mouseEnter(index)}
          />
        ))}
      </div>
    </div>
  );
}

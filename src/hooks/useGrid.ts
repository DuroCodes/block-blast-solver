import { useState, useEffect } from "preact/hooks";

export const useGrid = (
  initialGrid: boolean[],
  onChange?: (grid: boolean[]) => void,
) => {
  const [grid, setGrid] = useState(initialGrid);
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(false);

  const updateCell = (index: number, value: boolean) => {
    const newGrid = [...grid];
    newGrid[index] = value;
    setGrid(newGrid);
    onChange?.(newGrid);
  };

  const handleMouseDown = (index: number) => {
    setIsDragging(true);
    setDragValue(!grid[index]);
    updateCell(index, !grid[index]);
  };

  const handleMouseEnter = (index: number) => {
    if (isDragging) updateCell(index, dragValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return {
    grid,
    setGrid,
    handleMouseDown,
    handleMouseEnter,
  };
};

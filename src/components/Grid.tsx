interface GridProps {
  size: number;
  cells: boolean[];
  onMouseDown: (index: number) => void;
  onMouseEnter: (index: number) => void;
  cellClass?: (filled: boolean) => string;
  cellSize?: string;
}

export const Grid = ({
  size,
  cells,
  onMouseDown,
  onMouseEnter,
  cellClass = (filled) => (filled ? "bg-cell-filled" : "bg-cell-bg"),
  cellSize = "w-9 h-9 md:w-12 md:h-12",
}: GridProps) => (
  <div
    class="grid bg-gray-800/50 p-[0.5px] gap-[1px] md:p-[1px] rounded-lg"
    style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
  >
    {cells.map((filled, index) => (
      <button
        key={index}
        class={`${cellSize} rounded-sm ${cellClass(filled)} hover:brightness-110 transition-all`}
        onMouseDown={() => onMouseDown(index)}
        onMouseEnter={() => onMouseEnter(index)}
      />
    ))}
  </div>
);

import { useGrid } from "../hooks/useGrid";
import { Grid } from "./Grid";
import type { Piece } from "../utils/solver";

interface Props {
  id: number;
  onChange: (piece: Piece) => void;
}

const GRID_SIZE = 5;

export default function PieceSelector({ id, onChange }: Props) {
  const { grid, handleMouseDown, handleMouseEnter } = useGrid(
    new Array(GRID_SIZE * GRID_SIZE).fill(false),
    (newGrid) => onChange({ id, pattern: newGrid }),
  );

  return (
    <div class="p-2 md:p-3 bg-container-bg rounded-xl">
      <Grid
        size={GRID_SIZE}
        cells={grid}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        cellSize="w-5 h-5 md:w-6 md:h-6"
      />
    </div>
  );
}

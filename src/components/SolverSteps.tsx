import type { Piece, SolutionStep } from "../utils/solver";

const GRID_SIZE = 8;

interface Props {
  steps: SolutionStep[];
  pieces: Piece[];
}

const StepGrid = ({
  step,
  pieces,
}: {
  step: SolutionStep;
  pieces: Piece[];
}) => (
  <div class="p-4 bg-container-bg rounded-2xl w-fit">
    <div class="grid grid-cols-8 gap-[1px] bg-gray-800/50 p-[1px] rounded-lg">
      {step.intermediateGrid.map((filled, i) => {
        const x = (i % GRID_SIZE) - step.position[0];
        const y = Math.floor(i / GRID_SIZE) - step.position[1];
        const piece =
          x >= 0 &&
          x < 5 &&
          y >= 0 &&
          y < 5 &&
          pieces[step.pieceId].pattern[y * 5 + x];

        return (
          <div
            key={i}
            class={`w-8 h-8 lg:w-10 lg:h-10 rounded-sm ${
              filled
                ? piece
                  ? "bg-red-500"
                  : filled && !step.resultingGrid[i]
                  ? "bg-yellow-500"
                  : "bg-cell-filled"
                : "bg-cell-bg"
            }`}
          />
        );
      })}
    </div>
  </div>
);

const SolverSteps = ({ steps, pieces }: Props) => (
  <div class="space-y-4">
    <div class="lg:overflow-x-auto">
      <div class="flex lg:flex-row flex-col items-center gap-4 p-4 min-w-fit">
        {steps.map((step, stepIndex) => (
          <div
            key={stepIndex}
            class="flex lg:flex-row flex-col items-center gap-4"
          >
            <StepGrid step={step} pieces={pieces} />
            {stepIndex < steps.length - 1 && (
              <p class="text-2xl text-gray-400 font-bold lg:rotate-0 rotate-90">
                ⇢
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SolverSteps;

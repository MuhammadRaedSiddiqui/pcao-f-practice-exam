import { useId } from 'react';
import { difficultyCatalog, type Difficulty } from '../domain/difficulty';

export function DifficultyToggle({ value, onChange, disabled = false }: {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}) {
  const name = useId();
  return <fieldset className="difficulty-toggle" disabled={disabled}>
    <legend className="sr-only">Exam difficulty</legend>
    {(['intermediate', 'advanced'] as const).map(difficulty => <label key={difficulty}>
      <input type="radio" name={name} value={difficulty} checked={value === difficulty}
        onChange={() => onChange(difficulty)} />
      <span>{difficultyCatalog[difficulty].label}</span>
    </label>)}
  </fieldset>;
}

import { difficultyLabel, type Difficulty, type DifficultyBankState } from '../domain/difficulty';
import { sourceCourses } from '../domain/courses';
import { Button, Dialog } from './primitives';
import { DifficultyToggle } from './DifficultyToggle';

type Props = { open: boolean; difficulty: Difficulty; bankState: DifficultyBankState; onSelect: (difficulty: Difficulty) => void; onClose: () => void; onRetry: () => void };

export function SourceCoursesDrawer({ open, difficulty, bankState, onSelect, onClose, onRetry }: Props) {
  const courses = bankState.status === 'ready' ? sourceCourses(bankState.bank) : [];
  return <Dialog open={open} variant="drawer" title="Courses used for this mock" onClose={onClose}>
    <p>These practice questions were independently written using concepts from the courses below. Individual question references are available after submission.</p>
    <DifficultyToggle value={difficulty} onChange={onSelect} />
    <h3 className="course-level-title">{difficultyLabel(difficulty)} source courses</h3>
    {bankState.status === 'unavailable' && <p role="status">{difficultyLabel(difficulty)} source courses will be available after the question bank is added.</p>}
    {bankState.status === 'loading' && <p role="status">Loading source courses…</p>}
    {bankState.status === 'error' && <div className="validation-message" role="alert">
      <p>Source courses are unavailable because the reviewed question bank could not be loaded.</p>
      <Button onClick={onRetry}>Retry loading</Button>
    </div>}
    {bankState.status === 'ready' && <ul className="course-list">{courses.map(course => <li key={JSON.stringify([course.courseTitle, course.url])}>
      {course.url && /^https?:\/\//i.test(course.url)
        ? <a href={course.url} target="_blank" rel="noopener noreferrer">{course.courseTitle}<span className="sr-only"> (opens in a new tab)</span></a>
        : <><strong>{course.courseTitle}</strong><span className="muted"> — Source link unavailable</span></>}
    </li>)}</ul>}
  </Dialog>;
}

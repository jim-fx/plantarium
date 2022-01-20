import type { SvelteComponent } from 'svelte';
import type { ProjectManager } from '../project-manager';

export default interface TutorStep {
  description: string | typeof SvelteComponent;
  title?: string;
  type?: 'alert' | 'toast';
  selector?: string;
  clickSelector?: string;
  options?: {
    [key: string]: () => void;
  };
  _isSetup?: boolean;
  setup?: (opt: { pm: ProjectManager }) => void;
  _isCompleted?: boolean;
  checks?: {
    description: string;
    _isSetup?: boolean;
    _isCompleted?: boolean;
    setup: (
      isCompleted: () => void,
      opts: { c: TutorStep; pm: ProjectManager },
    ) => void;
    teardown?: (c: TutorStep) => void;
  }[];
}

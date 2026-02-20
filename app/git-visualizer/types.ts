// Type definitions for Git Visualizer

export type FileStatus = 'untracked' | 'modified' | 'added' | 'deleted' | 'renamed' | 'unmodified';

export interface File {
  name: string;
  status: FileStatus;
  content?: string;
}

export interface Commit {
  hash: string; // abbreviated hash like "a3f2c1e"
  message: string;
  author: string;
  timestamp: string;
  parent: string | null; // parent commit hash (null for initial commit)
  parents?: string[]; // for merge commits (multiple parents)
  branch: string;
  x: number; // x position for visualization
  y: number; // y position for visualization
}

export interface Branch {
  name: string;
  commitHash: string; // points to HEAD of branch
  color: string;
  isActive: boolean;
  isRemote: boolean;
}

export interface Tag {
  name: string;
  commitHash: string;
}

export interface Repository {
  branches: Branch[];
  commits: Commit[];
  tags: Tag[];
}

export interface GitState {
  workingDirectory: File[];
  stagingArea: File[];
  localRepository: Repository;
  remoteRepository: Repository;
  currentBranch: string;
  HEAD: string; // commit hash or branch name
}

export type GitCommandCategory = 'Setup' | 'Daily' | 'Branching' | 'Advanced' | 'Troubleshooting';

export type AnimationType =
  | 'commit-appear'
  | 'commit-transfer'
  | 'file-move'
  | 'branch-create'
  | 'branch-merge'
  | 'branch-rebase'
  | 'head-move'
  | 'connection-pulse'
  | 'highlight'
  | 'ref-update'
  | 'fade-in'
  | 'fade-out';

export interface ExecutionStep {
  order: number;
  description: string;
  animation: AnimationType;
  duration: number;
  targetElement?: string; // ID of element to animate
  fromPosition?: { x: number; y: number };
  toPosition?: { x: number; y: number };
}

export interface CommandScenario {
  beforeState: GitState;
  afterState: GitState;
  explanation: string;
  codeExample: string;
  codeOutput?: string;
  flags?: string[];
  warnings?: string[];
}

export interface GitCommand {
  id: string;
  name: string;
  description: string;
  category: GitCommandCategory;
  scenario: CommandScenario;
  steps: ExecutionStep[];
  whenToUse?: string[];
  bestPractices?: string[];
  isDangerous?: boolean;
}

export interface UIState {
  selectedCategory: GitCommandCategory;
  selectedCommand: string | null;
  executionState: 'idle' | 'ready' | 'executing' | 'paused' | 'completed';
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  showComparison: boolean;
  highlightedElements: string[];
}

// Helper type for positioning commits in git graph
export interface CommitPosition {
  hash: string;
  x: number;
  y: number;
  lane: number; // which visual lane (for parallel branches)
}

// Connection between commits for visualization
export interface CommitConnection {
  from: string; // commit hash
  to: string; // commit hash
  color: string;
  isActive?: boolean;
}

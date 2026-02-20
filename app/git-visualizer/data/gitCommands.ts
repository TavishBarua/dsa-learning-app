import type { GitCommand, GitState, Repository, Commit, Branch, File } from '../types';

// Helper function to create initial empty states
const createEmptyRepository = (): Repository => ({
  branches: [],
  commits: [],
  tags: []
});

const createInitialCommit = (hash: string, message: string, branch: string, x: number, y: number): Commit => ({
  hash,
  message,
  author: 'User',
  timestamp: new Date().toISOString(),
  parent: null,
  branch,
  x,
  y
});

const createCommit = (hash: string, message: string, parent: string, branch: string, x: number, y: number): Commit => ({
  hash,
  message,
  author: 'User',
  timestamp: new Date().toISOString(),
  parent,
  branch,
  x,
  y
});

// ============= SETUP COMMANDS =============

const initCommand: GitCommand = {
  id: 'init',
  name: 'git init',
  description: 'Initialize a new Git repository',
  category: 'Setup',
  scenario: {
    beforeState: {
      workingDirectory: [
        { name: 'index.html', status: 'untracked' },
        { name: 'style.css', status: 'untracked' }
      ],
      stagingArea: [],
      localRepository: createEmptyRepository(),
      remoteRepository: createEmptyRepository(),
      currentBranch: '',
      HEAD: ''
    },
    afterState: {
      workingDirectory: [
        { name: 'index.html', status: 'untracked' },
        { name: 'style.css', status: 'untracked' }
      ],
      stagingArea: [],
      localRepository: {
        branches: [{ name: 'main', commitHash: '', color: 'purple', isActive: true, isRemote: false }],
        commits: [],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'main',
      HEAD: 'main'
    },
    explanation: 'Creates a new Git repository in the current directory, initializing the .git folder and creating a main branch',
    codeExample: 'git init',
    codeOutput: 'Initialized empty Git repository in /your/project/.git/'
  },
  steps: [
    { order: 1, description: 'Creating .git directory...', animation: 'fade-in', duration: 800 },
    { order: 2, description: 'Initializing main branch', animation: 'branch-create', duration: 1000 },
    { order: 3, description: 'Repository ready!', animation: 'highlight', duration: 600 }
  ],
  whenToUse: [
    'Starting a new project',
    'Converting an existing project to use Git',
    'Creating a local repository before connecting to remote'
  ],
  bestPractices: [
    'Run this once at the start of your project',
    'Create a .gitignore file right after init',
    'Make your first commit after setting up basic files'
  ]
};

// ============= DAILY WORKFLOW COMMANDS =============

const addCommand: GitCommand = {
  id: 'add',
  name: 'git add',
  description: 'Stage changes for commit',
  category: 'Daily',
  scenario: {
    beforeState: {
      workingDirectory: [
        { name: 'index.html', status: 'modified' },
        { name: 'style.css', status: 'modified' },
        { name: 'script.js', status: 'untracked' }
      ],
      stagingArea: [],
      localRepository: {
        branches: [{ name: 'main', commitHash: 'a1b2c3d', color: 'purple', isActive: true, isRemote: false }],
        commits: [createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50)],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'main',
      HEAD: 'a1b2c3d'
    },
    afterState: {
      workingDirectory: [
        { name: 'index.html', status: 'modified' },
        { name: 'style.css', status: 'modified' },
        { name: 'script.js', status: 'untracked' }
      ],
      stagingArea: [
        { name: 'index.html', status: 'modified' },
        { name: 'style.css', status: 'modified' },
        { name: 'script.js', status: 'added' }
      ],
      localRepository: {
        branches: [{ name: 'main', commitHash: 'a1b2c3d', color: 'purple', isActive: true, isRemote: false }],
        commits: [createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50)],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'main',
      HEAD: 'a1b2c3d'
    },
    explanation: 'Moves files from working directory to staging area, preparing them to be included in the next commit',
    codeExample: 'git add .\n# or\ngit add index.html style.css script.js',
    codeOutput: '(no output on success)'
  },
  steps: [
    { order: 1, description: 'Scanning working directory for changes...', animation: 'highlight', duration: 600 },
    { order: 2, description: 'Moving index.html to staging area', animation: 'file-move', duration: 800 },
    { order: 3, description: 'Moving style.css to staging area', animation: 'file-move', duration: 800 },
    { order: 4, description: 'Moving script.js to staging area', animation: 'file-move', duration: 800 },
    { order: 5, description: 'Files staged successfully!', animation: 'highlight', duration: 600 }
  ],
  whenToUse: [
    'Before creating a commit',
    'To select specific files to include in next commit',
    'After making changes you want to save'
  ],
  bestPractices: [
    'Stage related changes together',
    'Use "git add -p" for partial file staging',
    'Review changes with "git diff" before staging',
    'Avoid "git add ." if you have unreviewed changes'
  ]
};

const commitCommand: GitCommand = {
  id: 'commit',
  name: 'git commit',
  description: 'Save staged changes to local repository',
  category: 'Daily',
  scenario: {
    beforeState: {
      workingDirectory: [],
      stagingArea: [
        { name: 'index.html', status: 'modified' },
        { name: 'style.css', status: 'modified' }
      ],
      localRepository: {
        branches: [{ name: 'main', commitHash: 'a1b2c3d', color: 'purple', isActive: true, isRemote: false }],
        commits: [createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50)],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'main',
      HEAD: 'a1b2c3d'
    },
    afterState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [{ name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: true, isRemote: false }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50)
        ],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'main',
      HEAD: 'e4f5g6h'
    },
    explanation: 'Creates a new commit (snapshot) from staged changes, saves it to local repository history, and clears staging area',
    codeExample: 'git commit -m "Update styling"',
    codeOutput: '[main e4f5g6h] Update styling\n 2 files changed, 15 insertions(+), 3 deletions(-)'
  },
  steps: [
    { order: 1, description: 'Reading staged files...', animation: 'highlight', duration: 600 },
    { order: 2, description: 'Creating commit snapshot', animation: 'commit-appear', duration: 1200 },
    { order: 3, description: 'Updating branch reference (main → e4f5g6h)', animation: 'ref-update', duration: 800 },
    { order: 4, description: 'Moving HEAD to new commit', animation: 'head-move', duration: 600 },
    { order: 5, description: 'Clearing staging area', animation: 'fade-out', duration: 600 }
  ],
  whenToUse: [
    'After staging changes with git add',
    'When you reach a logical checkpoint in your work',
    'Before switching branches or pulling changes'
  ],
  bestPractices: [
    'Write clear, descriptive commit messages',
    'Commit early and often',
    'Keep commits focused on one logical change',
    'Use present tense ("Add feature" not "Added feature")'
  ]
};

const pushCommand: GitCommand = {
  id: 'push',
  name: 'git push',
  description: 'Upload local commits to remote repository',
  category: 'Daily',
  scenario: {
    beforeState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [{ name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: true, isRemote: false }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50)
        ],
        tags: []
      },
      remoteRepository: {
        branches: [{ name: 'main', commitHash: 'a1b2c3d', color: 'purple', isActive: false, isRemote: true }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50)
        ],
        tags: []
      },
      currentBranch: 'main',
      HEAD: 'e4f5g6h'
    },
    afterState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [{ name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: true, isRemote: false }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50)
        ],
        tags: []
      },
      remoteRepository: {
        branches: [{ name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: false, isRemote: true }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50)
        ],
        tags: []
      },
      currentBranch: 'main',
      HEAD: 'e4f5g6h'
    },
    explanation: 'Uploads your local commits to the remote repository, synchronizing your work with the team',
    codeExample: 'git push origin main',
    codeOutput: 'Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nWriting objects: 100% (3/3), 324 bytes, done.\nTo github.com:user/repo.git\n   a1b2c3d..e4f5g6h  main -> main'
  },
  steps: [
    { order: 1, description: 'Checking for commits ahead of remote...', animation: 'highlight', duration: 800 },
    { order: 2, description: 'Connecting to remote (origin)...', animation: 'connection-pulse', duration: 1000 },
    { order: 3, description: 'Transferring commit e4f5g6h...', animation: 'commit-transfer', duration: 1500 },
    { order: 4, description: 'Updating remote branch reference', animation: 'ref-update', duration: 800 },
    { order: 5, description: 'Push successful! ✅', animation: 'highlight', duration: 600 }
  ],
  whenToUse: [
    'After making local commits you want to share',
    'At the end of your work session',
    'Before requesting code review or creating a PR'
  ],
  bestPractices: [
    'Pull before pushing to avoid conflicts',
    'Never force push to shared branches (use --force carefully)',
    'Push regularly to backup your work',
    'Make sure tests pass before pushing'
  ]
};

const pullCommand: GitCommand = {
  id: 'pull',
  name: 'git pull',
  description: 'Download and merge remote changes',
  category: 'Daily',
  scenario: {
    beforeState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [{ name: 'main', commitHash: 'a1b2c3d', color: 'purple', isActive: true, isRemote: false }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50)
        ],
        tags: []
      },
      remoteRepository: {
        branches: [{ name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: false, isRemote: true }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50)
        ],
        tags: []
      },
      currentBranch: 'main',
      HEAD: 'a1b2c3d'
    },
    afterState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [{ name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: true, isRemote: false }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50)
        ],
        tags: []
      },
      remoteRepository: {
        branches: [{ name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: false, isRemote: true }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50)
        ],
        tags: []
      },
      currentBranch: 'main',
      HEAD: 'e4f5g6h'
    },
    explanation: 'Fetches changes from remote repository and automatically merges them into your current branch',
    codeExample: 'git pull origin main',
    codeOutput: 'From github.com:user/repo\n * branch            main       -> FETCH_HEAD\nUpdating a1b2c3d..e4f5g6h\nFast-forward\n index.html | 5 +++--\n style.css  | 8 ++++++--\n 2 files changed, 9 insertions(+), 4 deletions(-)'
  },
  steps: [
    { order: 1, description: 'Connecting to remote...', animation: 'connection-pulse', duration: 1000 },
    { order: 2, description: 'Fetching remote commits...', animation: 'highlight', duration: 800 },
    { order: 3, description: 'Downloading commit e4f5g6h', animation: 'commit-transfer', duration: 1500 },
    { order: 4, description: 'Merging changes into local branch', animation: 'branch-merge', duration: 1200 },
    { order: 5, description: 'Updating HEAD to e4f5g6h', animation: 'head-move', duration: 600 }
  ],
  whenToUse: [
    'At the start of your work session',
    'Before creating a new branch',
    'Before pushing your changes',
    'To get latest changes from teammates'
  ],
  bestPractices: [
    'Pull frequently to stay up to date',
    'Commit or stash local changes before pulling',
    'Use "git fetch" if you want to review changes first',
    'Resolve merge conflicts immediately'
  ]
};

// ============= BRANCHING COMMANDS =============

const checkoutCommand: GitCommand = {
  id: 'checkout',
  name: 'git checkout',
  description: 'Switch branches or create new branch',
  category: 'Branching',
  scenario: {
    beforeState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [
          { name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: true, isRemote: false },
          { name: 'feature', commitHash: 'a1b2c3d', color: 'cyan', isActive: false, isRemote: false }
        ],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50)
        ],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'main',
      HEAD: 'e4f5g6h'
    },
    afterState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [
          { name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: false, isRemote: false },
          { name: 'feature', commitHash: 'a1b2c3d', color: 'cyan', isActive: true, isRemote: false }
        ],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50)
        ],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'feature',
      HEAD: 'a1b2c3d'
    },
    explanation: 'Switches your working directory to a different branch, updating files to match that branch\'s state',
    codeExample: 'git checkout feature\n# or create and switch:\ngit checkout -b new-feature',
    codeOutput: 'Switched to branch \'feature\''
  },
  steps: [
    { order: 1, description: 'Saving current working directory state...', animation: 'highlight', duration: 600 },
    { order: 2, description: 'Moving HEAD from main to feature', animation: 'head-move', duration: 1000 },
    { order: 3, description: 'Updating working directory files...', animation: 'file-move', duration: 1200 },
    { order: 4, description: 'Switched to feature branch ✅', animation: 'highlight', duration: 600 }
  ],
  whenToUse: [
    'To work on a different feature or bug fix',
    'To create a new branch (-b flag)',
    'To review code on another branch',
    'To switch between development and production code'
  ],
  bestPractices: [
    'Commit or stash changes before switching',
    'Use "git switch" (newer alternative to checkout)',
    'Name branches descriptively (feature/login, fix/bug-123)',
    'Keep branches focused on one feature or fix'
  ]
};

const mergeCommand: GitCommand = {
  id: 'merge',
  name: 'git merge',
  description: 'Combine branches together',
  category: 'Branching',
  scenario: {
    beforeState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [
          { name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: true, isRemote: false },
          { name: 'feature', commitHash: 'x9y8z7w', color: 'cyan', isActive: false, isRemote: false }
        ],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50),
          createCommit('x9y8z7w', 'Add feature', 'a1b2c3d', 'feature', 150, 100)
        ],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'main',
      HEAD: 'e4f5g6h'
    },
    afterState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [
          { name: 'main', commitHash: 'm1m2m3m', color: 'purple', isActive: true, isRemote: false },
          { name: 'feature', commitHash: 'x9y8z7w', color: 'cyan', isActive: false, isRemote: false }
        ],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50),
          createCommit('x9y8z7w', 'Add feature', 'a1b2c3d', 'feature', 150, 100),
          { hash: 'm1m2m3m', message: 'Merge feature into main', author: 'User', timestamp: new Date().toISOString(), parents: ['e4f5g6h', 'x9y8z7w'], branch: 'main', x: 250, y: 75, parent: null }
        ],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'main',
      HEAD: 'm1m2m3m'
    },
    explanation: 'Combines changes from another branch into current branch, creating a merge commit that preserves history',
    codeExample: 'git merge feature',
    codeOutput: 'Merge made by the \'recursive\' strategy.\n feature.js | 42 ++++++++++++++++++++++++++++++++++++++++++\n 1 file changed, 42 insertions(+)'
  },
  steps: [
    { order: 1, description: 'Finding common ancestor commit (a1b2c3d)...', animation: 'highlight', duration: 800 },
    { order: 2, description: 'Analyzing changes from both branches...', animation: 'highlight', duration: 1000 },
    { order: 3, description: 'Combining changes...', animation: 'branch-merge', duration: 1500 },
    { order: 4, description: 'Creating merge commit (m1m2m3m)', animation: 'commit-appear', duration: 1200 },
    { order: 5, description: 'Updating main branch reference', animation: 'ref-update', duration: 600 }
  ],
  whenToUse: [
    'To integrate feature branch into main',
    'To combine work from multiple developers',
    'When you want to preserve branch history',
    'For completing pull requests'
  ],
  bestPractices: [
    'Pull latest changes before merging',
    'Test thoroughly after merging',
    'Delete feature branch after successful merge',
    'Use pull requests for code review before merging'
  ]
};

const rebaseCommand: GitCommand = {
  id: 'rebase',
  name: 'git rebase',
  description: 'Reapply commits on top of another base',
  category: 'Branching',
  scenario: {
    beforeState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [
          { name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: false, isRemote: false },
          { name: 'feature', commitHash: 'x9y8z7w', color: 'cyan', isActive: true, isRemote: false }
        ],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50),
          createCommit('x9y8z7w', 'Add feature', 'a1b2c3d', 'feature', 150, 100)
        ],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'feature',
      HEAD: 'x9y8z7w'
    },
    afterState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [
          { name: 'main', commitHash: 'e4f5g6h', color: 'purple', isActive: false, isRemote: false },
          { name: 'feature', commitHash: 'r1r2r3r', color: 'cyan', isActive: true, isRemote: false }
        ],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'main', 50, 50),
          createCommit('e4f5g6h', 'Update styling', 'a1b2c3d', 'main', 150, 50),
          createCommit('r1r2r3r', 'Add feature', 'e4f5g6h', 'feature', 250, 50)
        ],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'feature',
      HEAD: 'r1r2r3r'
    },
    explanation: 'Moves your branch commits to start from a different commit (usually latest main), creating a linear history',
    codeExample: 'git rebase main',
    codeOutput: 'First, rewinding head to replay your work on top of it...\nApplying: Add feature',
    warnings: ['⚠️ Never rebase commits that have been pushed to shared branches', 'Rewriting history can cause issues for collaborators']
  },
  steps: [
    { order: 1, description: 'Saving feature branch commits...', animation: 'highlight', duration: 800 },
    { order: 2, description: 'Rewinding to common ancestor (a1b2c3d)', animation: 'fade-out', duration: 1000 },
    { order: 3, description: 'Moving to new base (e4f5g6h)', animation: 'head-move', duration: 1000 },
    { order: 4, description: 'Reapplying commits with new hash (r1r2r3r)', animation: 'branch-rebase', duration: 1500 },
    { order: 5, description: 'Rebase complete! Linear history achieved ✅', animation: 'highlight', duration: 600 }
  ],
  whenToUse: [
    'To update feature branch with latest main changes',
    'To create cleaner, linear history',
    'Before merging to avoid merge commits',
    'To fix up commits before pushing'
  ],
  bestPractices: [
    'Only rebase local commits (never rebase pushed commits)',
    'Use interactive rebase (git rebase -i) to clean up history',
    'Resolve conflicts carefully during rebase',
    'Test thoroughly after rebasing'
  ],
  isDangerous: true
};

// ============= ADVANCED COMMANDS =============

const squashCommand: GitCommand = {
  id: 'squash',
  name: 'git rebase -i (squash)',
  description: 'Combine multiple commits into one',
  category: 'Advanced',
  scenario: {
    beforeState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [{ name: 'feature', commitHash: 'c3c3c3c', color: 'cyan', isActive: true, isRemote: false }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'feature', 50, 50),
          createCommit('b1b1b1b', 'WIP: feature part 1', 'a1b2c3d', 'feature', 150, 50),
          createCommit('c2c2c2c', 'WIP: feature part 2', 'b1b1b1b', 'feature', 250, 50),
          createCommit('c3c3c3c', 'WIP: feature part 3', 'c2c2c2c', 'feature', 350, 50)
        ],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'feature',
      HEAD: 'c3c3c3c'
    },
    afterState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [{ name: 'feature', commitHash: 's1s1s1s', color: 'cyan', isActive: true, isRemote: false }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'feature', 50, 50),
          createCommit('s1s1s1s', 'Add complete feature', 'a1b2c3d', 'feature', 150, 50)
        ],
        tags: []
      },
      remoteRepository: createEmptyRepository(),
      currentBranch: 'feature',
      HEAD: 's1s1s1s'
    },
    explanation: 'Combines multiple commits into a single commit, creating cleaner history by removing WIP commits',
    codeExample: 'git rebase -i HEAD~3\n# Then mark commits as "squash" in editor',
    codeOutput: '[detached HEAD s1s1s1s] Add complete feature\n 3 files changed, 120 insertions(+)',
    warnings: ['⚠️ Only squash commits that haven\'t been pushed yet']
  },
  steps: [
    { order: 1, description: 'Opening interactive rebase editor...', animation: 'highlight', duration: 1000 },
    { order: 2, description: 'Squashing 3 commits...', animation: 'fade-out', duration: 1200 },
    { order: 3, description: 'Creating new combined commit (s1s1s1s)', animation: 'commit-appear', duration: 1200 },
    { order: 4, description: 'Updating branch reference', animation: 'ref-update', duration: 800 }
  ],
  whenToUse: [
    'Before creating a pull request',
    'To combine "WIP" or "fixup" commits',
    'To create cleaner, logical commits',
    'To hide messy development history'
  ],
  bestPractices: [
    'Only squash unpushed commits',
    'Write clear commit messages for squashed commits',
    'Test after squashing to ensure nothing broke',
    'Use "fixup" instead of "squash" to auto-use first commit message'
  ],
  isDangerous: true
};

const forcePushCommand: GitCommand = {
  id: 'force-push',
  name: 'git push -f',
  description: 'Force upload commits (overwrite remote)',
  category: 'Troubleshooting',
  scenario: {
    beforeState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [{ name: 'feature', commitHash: 'r1r2r3r', color: 'cyan', isActive: true, isRemote: false }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'feature', 50, 50),
          createCommit('r1r2r3r', 'Clean feature implementation', 'a1b2c3d', 'feature', 150, 50)
        ],
        tags: []
      },
      remoteRepository: {
        branches: [{ name: 'feature', commitHash: 'x9y8z7w', color: 'cyan', isActive: false, isRemote: true }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'feature', 50, 50),
          createCommit('x9y8z7w', 'WIP messy commits', 'a1b2c3d', 'feature', 150, 50)
        ],
        tags: []
      },
      currentBranch: 'feature',
      HEAD: 'r1r2r3r'
    },
    afterState: {
      workingDirectory: [],
      stagingArea: [],
      localRepository: {
        branches: [{ name: 'feature', commitHash: 'r1r2r3r', color: 'cyan', isActive: true, isRemote: false }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'feature', 50, 50),
          createCommit('r1r2r3r', 'Clean feature implementation', 'a1b2c3d', 'feature', 150, 50)
        ],
        tags: []
      },
      remoteRepository: {
        branches: [{ name: 'feature', commitHash: 'r1r2r3r', color: 'cyan', isActive: false, isRemote: true }],
        commits: [
          createInitialCommit('a1b2c3d', 'Initial commit', 'feature', 50, 50),
          createCommit('r1r2r3r', 'Clean feature implementation', 'a1b2c3d', 'feature', 150, 50)
        ],
        tags: []
      },
      currentBranch: 'feature',
      HEAD: 'r1r2r3r'
    },
    explanation: 'Forces remote to match your local state, overwriting remote history (DANGEROUS on shared branches!)',
    codeExample: 'git push -f origin feature\n# Safer alternative:\ngit push --force-with-lease origin feature',
    codeOutput: 'To github.com:user/repo.git\n + x9y8z7w...r1r2r3r feature -> feature (forced update)',
    warnings: [
      '⚠️ DANGER: This will overwrite remote history!',
      '⚠️ NEVER force push to main/master',
      '⚠️ Can cause data loss for collaborators',
      '✅ Use --force-with-lease for safety'
    ]
  },
  steps: [
    { order: 1, description: '⚠️ WARNING: About to overwrite remote history!', animation: 'highlight', duration: 1500 },
    { order: 2, description: 'Connecting to remote...', animation: 'connection-pulse', duration: 1000 },
    { order: 3, description: 'Force uploading commits (overwriting x9y8z7w)', animation: 'commit-transfer', duration: 1500 },
    { order: 4, description: 'Remote history rewritten!', animation: 'ref-update', duration: 800 }
  ],
  whenToUse: [
    'After rebasing or squashing commits on your feature branch',
    'To fix mistakes in your personal branch',
    'When explicitly coordinated with team',
    'NEVER on main/master/shared branches'
  ],
  bestPractices: [
    'Use --force-with-lease instead of -f',
    'Only force push to your own branches',
    'Communicate with team before force pushing',
    'Double-check branch name before force pushing'
  ],
  isDangerous: true
};

// ============= EXPORT ALL COMMANDS =============

export const gitCommands: GitCommand[] = [
  // Setup
  initCommand,

  // Daily Workflow
  addCommand,
  commitCommand,
  pushCommand,
  pullCommand,

  // Branching
  checkoutCommand,
  mergeCommand,
  rebaseCommand,

  // Advanced
  squashCommand,
  forcePushCommand
];

export const commandsByCategory = {
  Setup: gitCommands.filter(cmd => cmd.category === 'Setup'),
  Daily: gitCommands.filter(cmd => cmd.category === 'Daily'),
  Branching: gitCommands.filter(cmd => cmd.category === 'Branching'),
  Advanced: gitCommands.filter(cmd => cmd.category === 'Advanced'),
  Troubleshooting: gitCommands.filter(cmd => cmd.category === 'Troubleshooting')
};

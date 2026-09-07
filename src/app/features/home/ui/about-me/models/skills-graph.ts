export type SkillNode = {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  /** Home X in viewBox units (0..800). */
  readonly x: number;
  /** Home Y in viewBox units (0..520). */
  readonly y: number;
};

export type SkillEdge = {
  readonly from: string;
  readonly to: string;
};

export const SKILLS_VIEWBOX = { width: 800, height: 520 } as const;

export const SKILL_NODES: readonly SkillNode[] = [
  { id: 'angular', label: 'Angular', icon: '/icons/angular.svg', x: 400, y: 210 },
  { id: 'typescript', label: 'TypeScript', icon: '/icons/typescript.svg', x: 295, y: 135 },
  { id: 'html5', label: 'HTML5', icon: '/icons/html5.svg', x: 180, y: 155 },
  { id: 'css', label: 'CSS', icon: '/icons/css_old.svg', x: 95, y: 235 },
  { id: 'tailwind', label: 'Tailwind', icon: '/icons/tailwindcss.svg', x: 195, y: 310 },
  { id: 'figma', label: 'Figma', icon: '/icons/figma.svg', x: 105, y: 385 },
  { id: 'vscode', label: 'VS Code', icon: '/icons/vscode.svg', x: 285, y: 425 },
  { id: 'eclipse', label: 'Eclipse', icon: '/icons/eclipse.svg', x: 165, y: 460 },
  { id: 'opencode', label: 'OpenCode', icon: '/icons/opencode.svg', x: 310, y: 265 },
  { id: 'claude', label: 'Claude', icon: '/icons/claude-ai-icon.svg', x: 215, y: 215 },
  { id: 'java', label: 'Java', icon: '/icons/java.svg', x: 560, y: 115 },
  { id: 'spring', label: 'Spring', icon: '/icons/spring-wordmark.svg', x: 675, y: 150 },
  { id: 'jwt', label: 'JWT', icon: '/icons/jwt.svg', x: 715, y: 240 },
  { id: 'keycloak', label: 'Keycloak', icon: '/icons/keycloak.svg', x: 630, y: 315 },
  { id: 'git', label: 'Git', icon: '/icons/git.svg', x: 485, y: 275 },
  { id: 'github', label: 'GitHub', icon: '/icons/github_dark.svg', x: 575, y: 235 },
  { id: 'gitlab', label: 'GitLab', icon: '/icons/gitlab.svg', x: 645, y: 195 },
  { id: 'docker', label: 'Docker', icon: '/icons/docker.svg', x: 525, y: 390 },
  { id: 'firebase', label: 'Firebase', icon: '/icons/firebase.svg', x: 395, y: 385 },
  { id: 'android', label: 'Android', icon: '/icons/android-icon.svg', x: 685, y: 395 },
];

export const SKILL_EDGES: readonly SkillEdge[] = [
  { from: 'angular', to: 'typescript' },
  { from: 'typescript', to: 'html5' },
  { from: 'html5', to: 'css' },
  { from: 'css', to: 'tailwind' },
  { from: 'tailwind', to: 'figma' },
  { from: 'angular', to: 'opencode' },
  { from: 'opencode', to: 'typescript' },
  { from: 'claude', to: 'opencode' },
  { from: 'claude', to: 'html5' },
  { from: 'tailwind', to: 'vscode' },
  { from: 'figma', to: 'eclipse' },
  { from: 'vscode', to: 'eclipse' },
  { from: 'vscode', to: 'firebase' },
  { from: 'java', to: 'spring' },
  { from: 'spring', to: 'jwt' },
  { from: 'jwt', to: 'keycloak' },
  { from: 'java', to: 'gitlab' },
  { from: 'gitlab', to: 'github' },
  { from: 'github', to: 'git' },
  { from: 'git', to: 'angular' },
  { from: 'git', to: 'docker' },
  { from: 'docker', to: 'firebase' },
  { from: 'firebase', to: 'angular' },
  { from: 'keycloak', to: 'docker' },
  { from: 'android', to: 'docker' },
  { from: 'android', to: 'keycloak' },
];

export interface IWorkspace {
  id: string;
  title: string;
  tags: string[];
  description: string;
  image: string;
  url: string;
  timers: IWorkspaceTimer[];
}

export interface IWorkspaceTimer {
  id: string;
  title: string;
  description: string;
  session: number;
  break: number;
  iterations: number;
}

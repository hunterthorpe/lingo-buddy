export interface Language {
  code: string;
  name: string;
}

export enum ChatMode {
  IMMERSION = 'IMMERSION',
  CROSSTALK = 'CROSSTALK',
  MISSIONS = 'MISSIONS',
}

export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface ChatMessage {
  role: Role;
  text: string;
  correction?: Correction | null;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
}
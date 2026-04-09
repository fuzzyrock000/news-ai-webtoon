export interface WebtoonCharacter {
  emoji: string;
  name: string;
  position: 'left' | 'right' | 'center';
}

export interface SpeechBubble {
  speaker: 'left' | 'right' | 'narrator';
  text: string;
  style?: 'normal' | 'shout' | 'thought' | 'whisper';
}

export interface WebtoonPanel {
  panelNumber: 1 | 2 | 3 | 4;
  title: string;
  bgTheme: 'morning' | 'office' | 'chaos' | 'resolution' | 'dark' | 'bright' | 'sunset';
  characters: WebtoonCharacter[];
  bubbles: SpeechBubble[];
  sfx?: string;
  caption?: string;
}

export interface WebtoonScript {
  title: string;
  subtitle: string;
  keyword: string;
  category: string;
  panels: WebtoonPanel[];
  createdAt: string;
}

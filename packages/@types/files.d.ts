declare module '*.frag' {
  const content: string;
  export default content;
}
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.vert' {
  const content: string;
  export default content;
}

declare module '*?raw' {
  const content: string;
  export default content;
}

declare module '*?worker=external' {
  export default function (): Worker;
  export let url: string;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}


declare module '@vapi-ai/web' {
  export default class Vapi {
    constructor(publicKey: string);
    on(event: string, callback: (...args: any[]) => void): void;
    start(assistantId: string): Promise<void>;
    stop(): Promise<void>;
  }
}

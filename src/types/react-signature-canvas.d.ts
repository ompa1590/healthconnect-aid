
declare module 'react-signature-canvas' {
  import * as React from 'react';

  export interface SignatureCanvasProps {
    penColor?: string;
    backgroundColor?: string;
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    minWidth?: number;
    maxWidth?: number;
    dotSize?: number;
    throttle?: number;
    clearOnResize?: boolean;
    velocityFilterWeight?: number;
    onEnd?: () => void;
    onBegin?: () => void;
    onKeyDown?: React.KeyboardEventHandler<HTMLCanvasElement>;
  }

  export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {
    clear: () => void;
    isEmpty: () => boolean;
    toDataURL: (type?: string, encoderOptions?: number) => string;
    fromDataURL: (dataURL: string) => void;
  }
}

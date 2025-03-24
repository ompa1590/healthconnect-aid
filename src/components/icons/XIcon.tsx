import { LucideProps } from 'lucide-react';

export const XIcon = (props: LucideProps) => (
  <svg
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 4l11.733 16h4.267L8.267 4H4z" />
    <path d="M4 20h4.267L20 4h-4.267L4 20z" />
  </svg>
);

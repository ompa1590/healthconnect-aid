

## Plan: Fix Build Error + Add Glowing "Try Vyra AI" Button

### Problem
The `@mistralai/mistralai` package requires `zod/v3` which is incompatible with the installed `zod` version, breaking all builds. This must be fixed first.

### Step 1 — Fix the build error

**Remove `@mistralai/mistralai` from `package.json`** and replace the import in `src/utils/documentParser.ts` with a stub implementation. The file is only used by `HealthRecordsPage.tsx` and the Mistral functionality can be replaced with a simple text extraction fallback. The `parsePdfContent` and other exported functions will remain but without the Mistral dependency.

### Step 2 — Create `TrialVoiceAssistant` dialog component

**New file: `src/components/home/TrialVoiceAssistant.tsx`**

A dialog/modal that wraps the VAPI voice agent for trial purposes:
- Uses the existing `useVapi` hook with current env vars
- Shows the circular audio visualizer (bars around mic icon) from `PreScreeningAssistant`
- Displays the `Transcriber` component for live conversation
- Includes intro text: "Experience Vyra AI — our intelligent health assistant"
- Has a close button that stops the VAPI session on dialog close
- Auto-starts the VAPI call when the dialog opens

### Step 3 — Replace "Start Your Visit" with glowing "Try Vyra AI" button

**Edit: `src/components/home/Hero.tsx`**

- Replace the current "Start Your Visit" `<Link to="/signup">` button with a button that opens the `TrialVoiceAssistant` dialog
- Apply a glowing animation effect using CSS (pulsing box-shadow with the primary color)
- Button text: "Try Vyra AI" with a sparkle or mic icon
- Add the glow animation as inline styles or via Tailwind `animate-` class with a custom keyframe in `src/index.css`
- Add state: `const [trialOpen, setTrialOpen] = useState(false)`
- Render `<TrialVoiceAssistant open={trialOpen} onOpenChange={setTrialOpen} />` in the component

### Step 4 — Add glowing CSS animation

**Edit: `src/index.css`**

Add a `@keyframes glow` animation:
```css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(var(--primary-rgb), 0.4), 0 0 20px rgba(var(--primary-rgb), 0.2); }
  50% { box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.6), 0 0 40px rgba(var(--primary-rgb), 0.3); }
}
```

### Technical Details

- `useVapi` hook manages all VAPI lifecycle (connect, disconnect, volume, transcript)
- Environment variables already configured: `VITE_VAPI_PUBLIC_KEY`, `VITE_VAPI_ASSISTANT_ID`
- The dialog will use the existing Radix `Dialog` component
- No new dependencies needed (removing one: `@mistralai/mistralai`)
- The `documentParser.ts` stub will use `pdfjs-dist` (already installed) for basic text extraction instead of Mistral


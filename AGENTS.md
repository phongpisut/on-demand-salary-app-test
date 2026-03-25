# AGENTS.md

This document provides essential information for AI agents working in this repository.
Salary Hero is a fintech product, working with companies in Thailand to provide financial health to their
workers. One of the product’s features is called “on-demand salary”. On-demand salary allows employees (users) to
check how much money they have earned so far in the month (“available balance”)
and make a request to withdraw any amount at any time.
For example, if an employee earns 30,000 THB/month, then on day 15 of the month, the user has
earned 15,000 THB already. With this money, the user will be able to access up to 50% early. That
means that if they have earned 15,000 THB on day 15, they can withdraw at most 7,5000 THB.
For this test, we would like you to implement the application interface for the “on-demand salary” feature.

Business Requirements
Here are the business requirements for this project:

- As a user, I can sign in by entering my phone number at the SignInScreen
- As a user, I can enter OTP after entering my phone number from the SignInScreen
- As a user, I can set my PIN on the PasscodeScreen after successfully signing in
- As a user, I can sign in using my PIN on the PasscodeScreen if my token is not yet expired
- As a user, I must sign in using my phone number + OTP once again if my token expires
- As a user, I can see my financial information on the MainScreen which contains the following
  information if I’m signed in the application:
  o Profile (you may mock a profile image to show as the user’s avatar)
  o Available Balance
  o Transaction History
- As a user, I can create a withdrawal request with any amount less than or equal to 50% of my
  available balance on the WithdrawScreen if I’m signed in the application.

Additional Requirement: Propose a New Tab (No coding required)
The application currently includes three main tabs: Home, Withdraw, and Settings.
As part of this challenge, you are required to propose and describe ONE new tab that you believe would improve the overall
product experience.
Please include:

- Tab Name
- The problem this tab solves
- Why it is valuable for the user or for the business
- A brief description of the features or screens included in this tab
- Your reasoning for choosing this idea
  There is no fixed format — please explain your idea clearly and concisely.

---

## New Tab Proposal: Alerts (Notifications)

### Tab Name
**Alerts** (implemented as 4th tab)

### The Problem This Tab Solves
Users currently have no dedicated place to view their transaction history, withdrawal status, and account notifications in one organized location. They miss important updates about their money.

### Why It's Valuable
- **For Users**: Provides transparency and peace of mind by showing all account activities (deposits, withdrawals, status changes)
- **For Business**: Increases engagement and trust through proactive communication; reduces support inquiries about transaction status

### Features/Screens Included
1. **Notification List**: Chronological list of all account activities
2. **Categories**: Success (deposits, completed withdrawals), Warnings (verification needed), Info (welcome, tips)
3. **Unread Badge**: Visual indicator of new notifications
4. **Pull-to-refresh**: Manual refresh capability

### Reasoning
This tab was chosen because:
- It's the most natural complement to the existing Home/Withdraw/Settings structure
- Financial apps require transparency - users need to know what's happening with their money
- Low development cost with high user satisfaction impact
- Can be extended later with push notifications for real-time alerts

*(Note: This tab has been implemented in the app as a 4th tab)*

## Project Overview

- **Type**: React Native application using Expo
- **Framework**: Expo Router (file-based routing)
- **Styling**: Uniwwind (Tailwind CSS for React Native) with React Native Reusables
- **Language**: TypeScript (strict mode)
- **UI Components**: React Native Reusables (shadcn/ui-inspired)

## Essential Commands

### Development

```bash
# Start development server (supports iOS, Android, Web)
npm run dev
# or yarn dev, pnpm dev, bun dev

# Platform-specific
npm run android  # Launch Android emulator
npm run ios      # Launch iOS simulator (macOS only)
npm run web      # Run in browser
```

### Cleanup

```bash
npm run clean  # Removes .expo/ and node_modules/
```

## Project Structure

```
app/              # Expo Router pages and layouts (file-based routing)
  _layout.tsx    # Root layout with ThemeProvider, navigation stack
  index.tsx      # Home screen
  +html.tsx      # Web-only HTML wrapper (static rendering)
  +not-found.tsx # Not found page

components/
  ui/            # Reusable UI components (React Native Reusables pattern)
    button.tsx   # Button with CVA variants
    icon.tsx     # Lucide icon wrapper with Uniwind support
    text.tsx     # Typography component with semantic variants

lib/
  theme.ts       # Color theme definitions (light/dark) and NAV_THEME mapping
  utils.ts       # cn() utility for className merging (tailwind-merge + clsx)

assets/
  images/        # Static image assets

config files:
  package.json   # Dependencies and scripts
  tsconfig.json  # TypeScript config with path alias "@/*"
  global.css     # Uniwwind/Tailwind imports and CSS custom properties
  metro.config.js# Metro bundler config with Uniwwind integration
  babel.config.js# Babel preset for Expo
  .prettierrc    # Prettier config with tailwindcss plugin
  components.json# React Native Reusables configuration (aliases, theme)
  app.json       # Expo app configuration
```

## Code Conventions

### TypeScript

- Strict mode enabled (`strict: true`)
- Path alias: `@/*` maps to project root
- File extensions: `.ts` and `.tsx`

### Styling (Uniwwind)

- All styling uses Tailwind CSS utility classes via `className`
- `cn()` utility from `@/lib/utils` merges classes with `tailwind-merge`
- Theme colors are available as CSS variables: `--color-background`, `--color-foreground`, etc.
- Platform-specific classes: `Platform.select({ web: '...', default: '...' })`

### Component Patterns

**UI Components** follow React Native Reusables / shadcn/ui style:

- Use `class-variance-authority` (CVA) for variant props
- Base classes + variant classes + custom `className` prop
- Context (e.g., `TextClassContext`) for child styling
- Platform-specific adjustments using `Platform.select()`

Example structure:

```tsx
const componentVariants = cva('base classes', {
  variants: { variant: {...}, size: {...} },
  defaultVariants: {...}
});

function Component({ className, variant, size, ...props }: ComponentProps) {
  return <Pressable className={cn(componentVariants({ variant, size }), className)} {...props} />;
}
```

### Theming

- Theme controlled via `useUniwind()` hook
- `Uniwind.setTheme('light' | 'dark')` to toggle
- `NAV_THEME` in `lib/theme.ts` maps to React Navigation themes
- Color tokens defined in both `THEME` object (Javascript) and `global.css` (CSS variables)

### Navigation

- Expo Router with Stack navigator
- Layouts wrap page content
- `Stack.Screen` options for header configuration
- Links use `expo-router`'s `Link` component with `asChild` pattern

## Important Gotchas

1. **Platform differences**: Many components use `Platform.select()` for web-specific behaviors (focus-visible, hover states, pointer-events). Always check platform conditions when modifying UI.

2. **Uniwwind types**: `uniwind-types.d.ts` is auto-generated by metro.config.js. Do not edit manually.

3. **CSS reset on web**: `ScrollViewStyleReset` in `+html.tsx` disables body scrolling to match native behavior. Remove only if you want scrollable body on web.

4. **Icons**: Use `lucide-react-native` with the `Icon` wrapper component for consistent styling and size handling.

5. **Prettier plugin**: `prettier-plugin-tailwindcss` is configured and orders Tailwind classes automatically. Keep tailwind functions updated: `"tailwindFunctions": ["cva"]`.

6. **No test setup**: Currently no testing framework is configured. If adding tests, consider Jest/Expo testing.

7. **Clean script**: `npm run clean` removes critical directories. Only run when necessary (e.g., dependency issues).

8. **Expo Router typed routes**: `experiments.typedRoutes` is enabled in app.json for type safety. Route file names must follow Expo Router conventions (`_layout.tsx`, `index.tsx`, `[param].tsx`, etc.)

9. **Pressable over Touchable**: Use `Pressable` from `react-native` for interactive elements (not `TouchableOpacity` or `TouchableHighlight`).

10. **Image styling**: For static images, use `style` prop for dimensions and `className` for other styling. Use `require()` for local assets.

## Adding Components

To add more UI components from React Native Reusables:

```bash
npx react-native-reusables/cli@latest add input textarea
```

Or run without arguments for interactive selection.

## Configuration References

- **Expo**: SDK 55 (expo-router ~55.0.5)
- **React Native**: 0.83.2, React 19.2.0
- **Tailwind**: v4 via Uniwwind ^1.5.0
- **TypeScript**: ~5.9.2
- **Prettier**: ^3.6.2 (printWidth 100, single quotes)

## Notes

- Project initialized using `npx @react-native-reusables/cli@latest init` with Minimal (Uniwind) template
- Use `npm` as package manager
- Icons use `lucide-react-native` with the `Icon` wrapper component for consistent styling and size handling
- Theme toggle uses `Uniwind.setTheme('light' | 'dark')` and persists via `useUniwind()` hook

## State Management 
Use jotai and useSWR if needed

## API Spec
/resource/request.http

## Stitch Instructions

Get the images and code for the following Stitch project's screens:

## Project

ID: 2706578160913993522

## Screens:
1. Withdraw Money (Minimal)
    ID: d38982d166a74df29dceb167b88cb594

2. Settings (Minimal)
    ID: d66a29d3c05647bfba9142dec2b2cb95

3. Main Balance (Minimal)
    ID: fb51da2802194bb2b6d23b1cde3122e9

Use a utility like `curl -L` to download the hosted URLs.
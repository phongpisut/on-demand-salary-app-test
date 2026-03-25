import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, type TextInputProps, TextInput } from 'react-native';
import MaskInput, { Mask } from 'react-native-mask-input';

/**
 * Converts a format string to a mask array for react-native-mask-input.
 * '0' represents a digit (\d), other characters are kept as literals.
 *
 * @example
 * createMask('000-000-0000') // => [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]
 * createMask('(000) 000-0000') // => ['(', /\d/, /\d/, /\d/, ') ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]
 */
function createMask(format: string): (string | RegExp)[] {
  return format.split('').map((char) => {
    if (char === '0') {
      return /\d/;
    }
    return char;
  });
}

const inputVariants = cva(
  cn(
    'bg-background flex h-10 w-full rounded-md border px-3 py-2 text-base',
    Platform.select({
      web: 'placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      default: '',
    })
  ),
  {
    variants: {
      variant: {
        default: cn(
          'border-input ring-offset-background placeholder:text-muted-foreground',
          Platform.select({
            web: 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          })
        ),
        unstyled: 'border-transparent bg-transparent p-0',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type InputType = VariantProps<typeof inputVariants>;

type InputComponentProps = Omit<TextInputProps, 'size'> & {
  className?: string;
  variant?: InputType['variant'];
  size?: InputType['size'];
  mask?: string | (string | RegExp)[] | Mask;
};

const Input = React.forwardRef<React.ElementRef<typeof MaskInput>, InputComponentProps>(
  ({ className, variant, size, mask, ...props }, ref) => {
    const resolvedMask = typeof mask === 'string' ? createMask(mask) : mask;

    return resolvedMask ? (
      <MaskInput
        className={cn(inputVariants({ variant, size }), className)}
        placeholderTextColor="hsl(0 0% 63.9%)"
        ref={ref}
        mask={resolvedMask}
        {...props}
      />
    ) : (
      <TextInput
        className={cn(inputVariants({ variant, size }), className)}
        placeholderTextColor="hsl(0 0% 63.9%)"
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants, createMask };
export type { InputComponentProps };

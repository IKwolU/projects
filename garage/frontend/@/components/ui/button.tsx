import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center px-3 sm:px-4 whitespace-nowrap h-12 rounded-xl text-base font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "bg-yellow text-black w-full hover:bg-darkyellow dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        black:
          "bg-blix text-white hover:bg-zinc-500 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-12 font-semibold",
        reject:
          "bg-white text-white hover:bg-pale dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90 w-full border-2 border-grey",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-pale text-slate-900  hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        manager:
          "bg-yellow w-64 text-black  hover:bg-darkyellow dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  onAsyncClick?: () => Promise<void | (() => void)>;
  full?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      type = "button",
      asChild = false,
      onAsyncClick,
      full,
      ...props
    },
    ref
  ) => {
    const [actionInProgress, setActionInProgress] = React.useState(false);

    const Comp = asChild ? Slot : "button";

    const handleAsyncOnPress = async () => {
      setActionInProgress(true);

      const unmountCallback = await onAsyncClick!();
      if (!!unmountCallback) {
        unmountCallback();
      } else {
        setActionInProgress(false);
      }
    };

    const handler = onAsyncClick
      ? async () => {
          await handleAsyncOnPress();
        }
      : props.onClick;

    return (
      <Comp
        className={`${cn(buttonVariants({ variant, className }))} ${full ? 'w-full' :''}`}
        ref={ref}
        {...props}
        onClick={handler}
        children={
          <span className="flex">
            {props.children}
            {actionInProgress && (
              <div className="ml-4 font-bold animate-spin">c</div>
            )}
          </span>
        }
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

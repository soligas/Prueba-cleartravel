import React from 'react';

type LordIconTrigger = 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang';

// Extends React's HTML attributes with the custom properties of the <lord-icon> web component.
// This is used to inform TypeScript about the custom element's props.
interface LordIconElementProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  trigger?: LordIconTrigger;
  colors?: string;
  delay?: string | number;
}

// Declares the custom element 'lord-icon' in the React JSX namespace.
// This makes TypeScript recognize <lord-icon> as a valid JSX tag.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': LordIconElementProps;
    }
  }
}

// Defines the props for our React wrapper component, `LordIcon`.
// Here, `src` is made a required prop for better component usage.
interface LordIconProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  trigger?: LordIconTrigger;
  colors?: string;
  delay?: number | string;
}

export const LordIcon: React.FC<LordIconProps> = ({ 
    src, 
    trigger, 
    colors, 
    delay, 
    ...props 
}) => {
  return (
    <lord-icon
      src={src}
      trigger={trigger}
      colors={colors}
      delay={delay}
      {...props}
    />
  );
};

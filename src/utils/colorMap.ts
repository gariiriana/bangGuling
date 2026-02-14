// Color mapping utility for golden-black theme
// This file contains color replacement mapping from amber to golden-black

export const colorMap = {
  // Text colors
  'text-amber-50': 'text-golden-50',
  'text-amber-100': 'text-golden-100',
  'text-amber-200': 'text-golden-200',
  'text-amber-300': 'text-golden-300',
  'text-amber-400': 'text-golden-400',
  'text-amber-500': 'text-golden-500',
  'text-amber-600': 'text-golden-600',
  'text-amber-700': 'text-golden-700',
  'text-amber-800': 'text-golden-800',
  'text-amber-900': 'text-golden-900',
  
  // Background colors
  'bg-amber-50': 'bg-golden-50',
  'bg-amber-100': 'bg-golden-100',
  'bg-amber-200': 'bg-golden-200',
  'bg-amber-300': 'bg-golden-300',
  'bg-amber-400': 'bg-golden-400',
  'bg-amber-500': 'bg-golden-500',
  'bg-amber-600': 'bg-golden-600',
  'bg-amber-700': 'bg-black-700',
  'bg-amber-800': 'bg-black-800',
  'bg-amber-900': 'bg-black-900',
  
  // Border colors
  'border-amber-50': 'border-golden-50',
  'border-amber-100': 'border-golden-100',
  'border-amber-200': 'border-golden-200',
  'border-amber-300': 'border-golden-300',
  'border-amber-400': 'border-golden-400',
  'border-amber-500': 'border-golden-500',
  'border-amber-600': 'border-golden-600',
  'border-amber-700': 'border-golden-700',
  'border-amber-800': 'border-golden-800',
  'border-amber-900': 'border-golden-900',
  
  // Fill colors
  'fill-amber-50': 'fill-golden-50',
  'fill-amber-100': 'fill-golden-100',
  'fill-amber-200': 'fill-golden-200',
  'fill-amber-300': 'fill-golden-300',
  'fill-amber-400': 'fill-golden-400',
  'fill-amber-500': 'fill-golden-500',
  'fill-amber-600': 'fill-golden-600',
  'fill-amber-700': 'fill-golden-700',
  'fill-amber-800': 'fill-golden-800',
  'fill-amber-900': 'fill-golden-900',
  
  // Gradient colors
  'from-amber-50': 'from-golden-50',
  'from-amber-100': 'from-golden-100',
  'from-amber-200': 'from-golden-200',
  'from-amber-300': 'from-golden-300',
  'from-amber-400': 'from-golden-400',
  'from-amber-500': 'from-golden-500',
  'from-amber-600': 'from-golden-600',
  'from-amber-700': 'from-black-700',
  'from-amber-800': 'from-black-800',
  'from-amber-900': 'from-black-900',
  
  'via-amber-50': 'via-golden-50',
  'via-amber-100': 'via-golden-100',
  'via-amber-200': 'via-golden-200',
  'via-amber-300': 'via-golden-300',
  'via-amber-400': 'via-golden-400',
  'via-amber-500': 'via-golden-500',
  'via-amber-600': 'via-golden-600',
  'via-amber-700': 'via-black-700',
  'via-amber-800': 'via-black-800',
  'via-amber-900': 'via-black-900',
  
  'to-amber-50': 'to-golden-50',
  'to-amber-100': 'to-golden-100',
  'to-amber-200': 'to-golden-200',
  'to-amber-300': 'to-golden-300',
  'to-amber-400': 'to-golden-400',
  'to-amber-500': 'to-golden-500',
  'to-amber-600': 'to-golden-600',
  'to-amber-700': 'to-black-700',
  'to-amber-800': 'to-black-800',
  'to-amber-900': 'to-black-900',
  
  // Ring colors
  'ring-amber-50': 'ring-golden-50',
  'ring-amber-100': 'ring-golden-100',
  'ring-amber-200': 'ring-golden-200',
  'ring-amber-300': 'ring-golden-300',
  'ring-amber-400': 'ring-golden-400',
  'ring-amber-500': 'ring-golden-500',
  'ring-amber-600': 'ring-golden-600',
  'ring-amber-700': 'ring-golden-700',
  'ring-amber-800': 'ring-golden-800',
  'ring-amber-900': 'ring-golden-900',
};

export function replaceAmberColors(className: string): string {
  let result = className;
  Object.entries(colorMap).forEach(([old, newColor]) => {
    result = result.replace(new RegExp(old, 'g'), newColor);
  });
  return result;
}

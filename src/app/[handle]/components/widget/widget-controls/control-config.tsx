import { WidgetSizes } from '../grid-config';

/** All possible controls for a widget */ // TODO: Add crop
export const Controls = [...WidgetSizes, 'link'] as const;
export type Control = (typeof Controls)[number];

/** Default set of size Controls for a regular widget. The order matters. */
export const SizeControls: Control[] = ['B', 'E', 'D', 'C', 'A'];

/** Default set of size Controls for an image widget. The order matters. There is no E size for images */
export const ImageControls: Control[] = ['B', 'D', 'C', 'A', 'link'];

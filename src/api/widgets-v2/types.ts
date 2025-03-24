type XYWH = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type LayoutDto = XYWH & {
  id: string;
  breakpoint: 'sm' | 'lg';
};

export type CreateWidgetDto = {
  id: string;
  url: string;
  layouts: {
    sm: XYWH;
    lg: XYWH;
  };
};

export type UpdateLayoutsDto = {
  layouts: LayoutDto[];
};

export type UpdateWidgetV2Dto = {
  /** The title of the widget */
  title?: string;

  /** The content URL of the widget */
  contentUrl?: string;

  /** Any custom data for the widget */
  custom?: Record<string, unknown>;
};

export type ApiWidget = {
  id: string;
  href?: string;
  title?: string;
  iconUrl?: string;
  contentUrl?: string;
  custom?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  layouts: LayoutDto[];
};

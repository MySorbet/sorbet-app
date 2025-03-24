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

export type WidgetType = 'image';

export type BaseCreateWidgetDto = {
  id: string;
  url?: string;
  type?: WidgetType;
  layouts: {
    sm: XYWH;
    lg: XYWH;
  };
};

export type CreateWidgetUrlDto = BaseCreateWidgetDto & {
  url: string;
  // regular url creation must have a url
};

export type CreateWidgetImageDto = BaseCreateWidgetDto & {
  type: 'image';
  // image creation will not have a url
};

export type CreateWidgetDto = CreateWidgetUrlDto | CreateWidgetImageDto;

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
  type?: WidgetType;
  custom?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  layouts: LayoutDto[];
};

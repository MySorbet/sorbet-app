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

/**
 * Shape of the data used to update a widget
 * Should match the UpdateWidgetV2Dto validator in the API
 */
export type UpdateWidgetV2Dto = {
  /** The title of the widget. Set by enrichment. */
  title?: string;

  /** The content URL of the widget */
  contentUrl?: string;

  /** The URL of the widget. Use null to unset */
  href?: string | null;

  /** The title a user sets for the widget. Use null to unset */
  userTitle?: string | null;

  /** Any custom data for the widget */
  custom?: Record<string, unknown>;
};

/**
 * Shape of a widget returned from the API
 * Should match the prisma schema
 */
export type ApiWidget = {
  id: string;
  href: string | null;
  title: string | null;
  userTitle: string | null;
  iconUrl: string | null;
  contentUrl: string | null;
  type: WidgetType | null;
  custom: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  layouts: LayoutDto[];
};

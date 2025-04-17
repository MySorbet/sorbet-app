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
  userContentUrl: string | null;
  hideContent: boolean;
  type: WidgetType | null;
  custom: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  layouts: LayoutDto[];
};

/** This is the subset of information we will actually store about a widget */
export type WidgetData = Pick<
  ApiWidget,
  | 'id'
  | 'href'
  | 'title'
  | 'userTitle'
  | 'iconUrl'
  | 'contentUrl'
  | 'userContentUrl'
  | 'hideContent'
  | 'type'
  | 'custom'
>;

/**
 * This is the shape of the data used to update a widget
 * You can update anything we store besides id
 */
export type UpdateWidgetDto = Partial<Omit<WidgetData, 'id'>>;

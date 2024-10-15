import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  useCreateWidget,
  useDeleteWidget,
  useUploadWidgetsImage,
} from '@/hooks';
import { WidgetLayoutItem, WidgetSize, WidgetDimensions } from '@/types';
import { parseWidgetTypeFromUrl } from '@/components/profile/widgets/util';
import {
  SocialHandleInputWidgetType,
  typeAndHandleToWidgetUrl,
} from '@/components/profile/widgets/onboarding-drawer';

interface WidgetManagementProps {
  userId: string;
  editMode: boolean;
  layout: WidgetLayoutItem[];
  setLayout: React.Dispatch<React.SetStateAction<WidgetLayoutItem[]>>;
  cols: number;
  persistWidgetsLayoutOnChange: (items?: WidgetLayoutItem[]) => void;
}

export const useWidgetManagement = ({
  userId,
  editMode,
  layout,
  setLayout,
  cols,
  persistWidgetsLayoutOnChange,
}: WidgetManagementProps) => {
  const [errorInvalidImage, setErrorInvalidImage] = useState(false);
  const [addingWidget, setAddingWidget] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { toast } = useToast();
  const { mutateAsync: uploadWidgetsImageAsync } = useUploadWidgetsImage();
  const { mutateAsync: createWidget } = useCreateWidget();
  const { mutateAsync: deleteWidget } = useDeleteWidget();

  const handleWidgetRemove = useCallback(
    async (key: string) => {
      await deleteWidget(key);
      setLayout((prevLayout) => {
        const newLayout = prevLayout.filter((item) => item.i !== key);
        persistWidgetsLayoutOnChange(newLayout);
        return newLayout;
      });
    },
    [deleteWidget, setLayout, persistWidgetsLayoutOnChange]
  );

  const handleWidgetAdd = useCallback(
    async (url: string, image?: File) => {
      setAddingWidget(true);
      let widgetUrl: string = url;

      try {
        const type = parseWidgetTypeFromUrl(url);

        if (type === 'Photo' && image && image !== undefined) {
          const imageFormData = new FormData();
          imageFormData.append('file', image);
          imageFormData.append('fileType', 'image');
          imageFormData.append('destination', 'widgets');
          imageFormData.append('userId', userId);
          const response = await uploadWidgetsImageAsync(imageFormData);
          if (response.data && response.data.fileUrl) {
            widgetUrl = response.data.fileUrl;
          } else {
            throw new Error('Widget image not uploaded');
          }
        }

        const widget = await createWidget({ url: widgetUrl, type });

        if (!widget) {
          throw new Error('Failed to add widget. Please try again.');
        }

        const widgetToAdd: WidgetLayoutItem = {
          i: widget.id,
          x: (layout.length * 2) % cols,
          y: 0,
          w: WidgetDimensions.A.w,
          h: WidgetDimensions.A.h,
          type: type,
          content: widget.content,
          static: !editMode,
          isResizable: false,
          isDraggable: editMode,
          loading: false,
          size: 'A',
        };

        setLayout((prevLayout) => {
          const newLayout = [...prevLayout, widgetToAdd];
          persistWidgetsLayoutOnChange(newLayout);
          return newLayout;
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast({
          title: `We couldn't add a widget`,
          description: message,
        });
      } finally {
        setAddingWidget(false);
      }
    },
    [
      userId,
      editMode,
      layout,
      cols,
      uploadWidgetsImageAsync,
      createWidget,
      toast,
      setLayout,
      persistWidgetsLayoutOnChange,
    ]
  );

  const handleFileDrop = useCallback(
    async (file: File) => {
      const validExtensions = ['jpg', 'jpeg', 'png', 'svg', 'gif'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const fileSize = file.size / 1024 / 1024; // in MB

      if (
        !fileExtension ||
        !validExtensions.includes(fileExtension) ||
        fileSize > 10
      ) {
        setErrorInvalidImage(true);
        return;
      }

      setAddingWidget(true);
      try {
        const imageFormData = new FormData();
        imageFormData.append('file', file);
        imageFormData.append('fileType', 'image');
        imageFormData.append('destination', 'widgets');
        imageFormData.append('userId', userId);

        const response = await uploadWidgetsImageAsync(imageFormData);
        if (response.data && response.data.fileUrl) {
          await handleWidgetAdd(response.data.fileUrl, file);
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (error) {
        setErrorInvalidImage(true);
      } finally {
        setAddingWidget(false);
      }
    },
    [userId, uploadWidgetsImageAsync, handleWidgetAdd]
  );

  const handleAddMultipleWidgets = useCallback(
    async (urls: string[]) => {
      setAddingWidget(true);

      const widgetsToAdd = (
        await Promise.all(
          urls.map(async (url, index) => {
            try {
              const type = parseWidgetTypeFromUrl(url);
              const widget = await createWidget({ url, type });

              if (!widget) {
                throw new Error('Failed to add widget. Please try again.');
              }

              return {
                i: widget.id,
                x: (index * 2) % cols,
                y: Math.floor((index * 2) / cols),
                w: WidgetDimensions.A.w,
                h: WidgetDimensions.A.h,
                type: type,
                content: widget.content,
                static: !editMode,
                isResizable: false,
                isDraggable: editMode,
                loading: false,
                size: 'A',
              } as WidgetLayoutItem;
            } catch (error) {
              const message =
                error instanceof Error ? error.message : 'Something went wrong';
              toast({
                title: `We couldn't add a widget`,
                description: message,
              });
            }
          })
        )
      ).filter((widget): widget is WidgetLayoutItem => widget !== undefined);

      setLayout((prevLayout) => {
        const newLayout = [...prevLayout, ...widgetsToAdd];
        persistWidgetsLayoutOnChange(newLayout);
        return newLayout;
      });
      setAddingWidget(false);
    },
    [
      cols,
      editMode,
      createWidget,
      toast,
      setLayout,
      persistWidgetsLayoutOnChange,
    ]
  );

  const handleOnboardingDrawerSubmit = useCallback(
    async (handles: Partial<Record<SocialHandleInputWidgetType, string>>) => {
      const urls = Object.entries(handles).map(([type, handle]) => {
        return typeAndHandleToWidgetUrl(
          type as SocialHandleInputWidgetType,
          handle
        );
      });
      await handleAddMultipleWidgets(urls);
    },
    [handleAddMultipleWidgets]
  );

  return {
    errorInvalidImage,
    setErrorInvalidImage,
    addingWidget,
    drawerOpen,
    setDrawerOpen,
    handleOnboardingDrawerSubmit,
    handleWidgetRemove,
    handleWidgetAdd,
    handleFileDrop,
    handleAddMultipleWidgets,
  };
};

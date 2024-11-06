import { useCallback, useState } from 'react';
import { Area } from 'react-easy-crop';

import { parseWidgetTypeFromUrl } from '@/components/profile/widgets/util';
import { useToast } from '@/components/ui/use-toast';
import {
  useCreateWidget,
  useDeleteWidget,
  useUploadWidgetsImage,
} from '@/hooks';
import { useUpdateWidgetImage } from '@/hooks/widgets/useUpdateWidgetImage';
import { useUpdateWidgetLink } from '@/hooks/widgets/useUpdateWidgetLink';
import {
  LinkWidgetContentType,
  PhotoWidgetContentType,
  WidgetDimensions,
  WidgetLayoutItem,
} from '@/types';

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

  const { toast } = useToast();
  const { mutateAsync: uploadWidgetsImageAsync } = useUploadWidgetsImage();
  const { mutateAsync: updateWidgetLinkAsync } = useUpdateWidgetLink();
  const { mutateAsync: updateWidgetImageAsync } = useUpdateWidgetImage();
  const { mutateAsync: createWidget } = useCreateWidget();
  const { mutateAsync: deleteWidget } = useDeleteWidget();

  const handleWidgetRemove = useCallback(
    async (key: string) => {
      await deleteWidget(key);
      setLayout((prevLayout) => {
        const newLayout = prevLayout.filter((item) => item.i !== key);
        if (newLayout.length > 0) {
          persistWidgetsLayoutOnChange(newLayout);
        }
        return newLayout;
      });
    },
    [deleteWidget, setLayout, persistWidgetsLayoutOnChange]
  );

  const handleWidgetAdd = useCallback(
    async (url: string, image?: File) => {
      setAddingWidget(true);
      let widgetUrl = url;

      try {
        const type = parseWidgetTypeFromUrl(url);

        if (type === 'Photo' && image && image !== undefined) {
          const fileExtension = image.name.split('.').pop()?.toLowerCase();
          const imageFormData = new FormData();
          imageFormData.append('file', image);
          // fileType must be different for svgs to render correctly
          if (fileExtension === 'svg') {
            imageFormData.append('fileType', 'image/svg+xml');
          } else {
            imageFormData.append('fileType', 'image');
          }
          imageFormData.append('destination', 'widgets');
          imageFormData.append('userId', '');
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

  /** Handles the replacement of display images for Link and Photo Widgets */
  const handleNewImageAdd = useCallback(
    async (key: string, image: File) => {
      setAddingWidget(true);
      let widgetUrl = '';

      try {
        const existingItem = layout.find((item) => item.i === key);

        if (existingItem && image && image !== undefined) {
          const fileExtension = image.name.split('.').pop()?.toLowerCase();
          const imageFormData = new FormData();
          imageFormData.append('file', image);

          // fileType must be different for svgs to render correctly
          if (fileExtension === 'svg') {
            imageFormData.append('fileType', 'image/svg+xml');
          } else {
            imageFormData.append('fileType', 'image');
          }
          imageFormData.append('destination', 'widgets');
          imageFormData.append('userId', '');
          const response = await uploadWidgetsImageAsync(imageFormData);
          if (response.data && response.data.fileUrl) {
            widgetUrl = response.data.fileUrl;
          } else {
            throw new Error('Widget image not uploaded');
          }

          switch (existingItem.type) {
            case 'Photo':
              (existingItem.content as PhotoWidgetContentType).image =
                widgetUrl;
              break;

            case 'Link':
              (existingItem.content as LinkWidgetContentType).heroImageUrl =
                widgetUrl;
              break;

            default:
              break;
          }
          const newObj = {
            ...existingItem,
            id: existingItem.i, // Replace 'i' with 'id' for payload
          };
          await updateWidgetImageAsync(newObj);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast({
          title: `We couldn't update a widget`,
          description: message,
        });
      } finally {
        setAddingWidget(false);
      }
    },
    [layout, updateWidgetImageAsync, uploadWidgetsImageAsync, toast]
  );

  /** Handles the replacement of display images for Link and Photo Widgets */
  const handleImageRemoval = useCallback(
    async (key: string) => {
      setAddingWidget(true);

      try {
        const existingItem = layout.find((item) => item.i === key);

        if (existingItem) {
          switch (existingItem.type) {
            case 'Link':
              (existingItem.content as LinkWidgetContentType).heroImageUrl =
                undefined;
              break;

            default:
              break;
          }
          const newObj = {
            ...existingItem,
            id: existingItem.i, // Replace 'i' with 'id' for payload
          };
          console.log(newObj);
          await updateWidgetImageAsync(newObj);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast({
          title: `We couldn't remove the picture`,
          description: message,
        });
      } finally {
        setAddingWidget(false);
      }
    },
    [layout, updateWidgetImageAsync, toast]
  );

  /** Handles the cropping of images, the id of the image being cropped should be passed */
  const handleImageCropping = useCallback(
    async (key: string, croppedArea: Area) => {
      setAddingWidget(true);
      try {
        const existingItem = layout.find((item) => item.i === key);

        if (existingItem) {
          (existingItem.content as PhotoWidgetContentType).croppedArea =
            croppedArea;
          const newObj = {
            ...existingItem,
            id: existingItem.i, // Replace 'i' with 'id' for patch endpoint
          };
          await updateWidgetImageAsync(newObj);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast({
          title: `We couldn't crop this widget`,
          description: message,
        });
      } finally {
        setAddingWidget(false);
      }
    },
    [layout, updateWidgetImageAsync, toast]
  );

  const handleWidgetEditLink = useCallback(
    async (key: string, url: string) => {
      try {
        const existingItem = layout.find((item) => item.i === key);
        if (existingItem) {
          existingItem.redirectUrl = url;
          const newObj = {
            ...existingItem,
            id: existingItem.i, // Replace 'i' with 'id' for patch endpoint
          };
          await updateWidgetLinkAsync(newObj);
        } else {
          throw new Error('No widget exists to edit');
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast({
          title: `We couldn't update a widget`,
          description: message,
        });
      }
    },
    [updateWidgetImageAsync, toast, layout]
  );

  /** Handles cases when the user drags an image over the profile page */
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
        // fileType must be different for svgs to render correctly
        if (fileExtension === 'svg') {
          imageFormData.append('fileType', 'image/svg+xml');
        } else {
          imageFormData.append('fileType', 'image');
        }
        imageFormData.append('destination', 'widgets');
        imageFormData.append('userId', '');
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
    [uploadWidgetsImageAsync, handleWidgetAdd]
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

  return {
    errorInvalidImage,
    setErrorInvalidImage,
    addingWidget,
    handleWidgetRemove,
    handleWidgetAdd,
    handleFileDrop,
    handleWidgetEditLink,
    handleNewImageAdd,
    handleImageRemoval,
    handleImageCropping,
    handleAddMultipleWidgets,
  };
};

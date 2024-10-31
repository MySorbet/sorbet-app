import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  useCreateWidget,
  useDeleteWidget,
  useUploadWidgetsImage,
} from '@/hooks';
import {
  WidgetLayoutItem,
  WidgetSize,
  WidgetDimensions,
  PhotoWidgetContentType,
  LinkWidgetContentType,
  LinkedInProfileWidgetContentType,
} from '@/types';
import { parseWidgetTypeFromUrl } from '@/components/profile/widgets/util';
import { useUpdateWidgetLink } from '@/hooks/widgets/useUpdateWidgetLink';
import { useUpdateWidgetImage } from '@/hooks/widgets/useUpdateWidgetImage';

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
  const { mutateAsync: useUpdateWidgetLinkAsync } = useUpdateWidgetLink();
  const { mutateAsync: useUpdateWidgetImageAsync } = useUpdateWidgetImage();
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
      console.log('layout', layout);
      setAddingWidget(true);
      let widgetUrl: string = url;

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

  const handleNewImageAdd = useCallback(
    async (key: string, image: File) => {
      setAddingWidget(true);
      console.log('hmmm');
      let widgetUrl: string = '';

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

          console.log(response);

          let newObj;
          switch (existingItem.type) {
            /** Come back to this, does it make sesne to edit GitHub pictures for example */
            case 'Photo':
              (existingItem.content as PhotoWidgetContentType).image =
                widgetUrl;
              newObj = {
                ...existingItem, // Spread all other properties
                id: existingItem.i, // Replace 'i' with 'id'
              };
              await useUpdateWidgetImageAsync(newObj);
              break;

            case 'Link':
              (existingItem.content as LinkWidgetContentType).heroImageUrl =
                widgetUrl;
              newObj = {
                ...existingItem, // Spread all other properties
                id: existingItem.i, // Replace 'i' with 'id'
              };
              await useUpdateWidgetImageAsync(newObj);
              break;

            default:
              break;
          }
        }
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
    [userId, editMode, layout, uploadWidgetsImageAsync, toast, setLayout]
  );

  const handleImageCropping = useCallback(
    async (key: string, croppedArea: any) => {
      setAddingWidget(true);
      let widgetUrl: string = '';

      console.log('please');
      try {
        const existingItem = layout.find((item) => item.i === key);

        if (existingItem) {
          (existingItem.content as PhotoWidgetContentType).croppedArea =
            croppedArea;
          const newObj = {
            ...existingItem,
            id: existingItem.i, // Replace 'i' with 'id' for patch endpoint
          };
          await useUpdateWidgetImageAsync(newObj);
        }
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
    [userId, editMode, layout, toast, setLayout]
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
          await useUpdateWidgetLinkAsync(newObj);
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
    [layout]
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

  return {
    errorInvalidImage,
    setErrorInvalidImage,
    addingWidget,
    handleWidgetRemove,
    handleWidgetAdd,
    handleFileDrop,
    handleWidgetEditLink,
    handleNewImageAdd,
    handleImageCropping,
    handleAddMultipleWidgets,
  };
};

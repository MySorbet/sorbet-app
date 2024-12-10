import { useCallback, useState } from 'react';
import { Area } from 'react-easy-crop';
import { toast } from 'sonner';

import { parseWidgetTypeFromUrl } from '@/components/profile/widgets/util';
import {
  useCreateWidget,
  useDeleteWidget,
  useUploadWidgetsImage,
} from '@/hooks';
import { useUpdateWidgetContent } from '@/hooks/profile/useUpdateWidgetContent';
import { useRestoreWidgetImage } from '@/hooks/widgets/useRestoreWidgetImage';
import { useUpdateWidgetLink } from '@/hooks/widgets/useUpdateWidgetLink';
import {
  BehanceWidgetContentType,
  DribbbleWidgetContentType,
  GithubWidgetContentType,
  LinkedInProfileWidgetContentType,
  LinkWidgetContentType,
  PhotoWidgetContentType,
  SectionTitleWidgetContentType,
  SoundcloudTrackContentType,
  SubstackWidgetContentType,
  TwitterWidgetContentType,
  WidgetContentType,
  WidgetDimensions,
  WidgetLayoutItem,
  WidgetType,
  YoutubeWidgetContentType,
} from '@/types';

interface WidgetManagementProps {
  userId: string;
  editMode: boolean;
  layout: WidgetLayoutItem[];
  setLayout: React.Dispatch<React.SetStateAction<WidgetLayoutItem[]>>;
  cols: number;
  handleLayoutChange: (newLayout: WidgetLayoutItem[]) => void;
}

export const useWidgetManagement = ({
  editMode,
  layout,
  setLayout,
  cols,
  handleLayoutChange,
}: WidgetManagementProps) => {
  const [errorInvalidImage, setErrorInvalidImage] = useState(false);
  const [addingWidget, setAddingWidget] = useState<boolean>(false);
  const [removingWidget, setRemovingWidget] = useState<boolean>(false);

  const { mutateAsync: createWidget } = useCreateWidget();
  const { mutateAsync: deleteWidget } = useDeleteWidget();
  const { mutateAsync: uploadWidgetsImageAsync } = useUploadWidgetsImage();
  const { mutateAsync: updateWidgetContentAsync } = useUpdateWidgetContent();
  const { mutateAsync: updateWidgetLinkAsync } = useUpdateWidgetLink();
  const { mutateAsync: restoreWidgetImageAsync } = useRestoreWidgetImage();

  const handleWidgetRemove = useCallback(
    async (key: string) => {
      if (removingWidget) return;
      try {
        setRemovingWidget(true);
        await deleteWidget(key);

        handleLayoutChange(layout.filter((item) => item.i !== key));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast(`We couldn't remove a widget`, {
          description: message,
        });
      } finally {
        setRemovingWidget(false); // Reset after operation
      }
    },
    [removingWidget, deleteWidget, handleLayoutChange, layout]
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
          return [...prevLayout, widgetToAdd];
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast(`We couldn't add a widget`, {
          description: message,
        });
      } finally {
        setAddingWidget(false);
      }
    },
    [editMode, layout, cols, uploadWidgetsImageAsync, createWidget, setLayout]
  );

  /** Handles the replacement of display images for widgets */
  const handleNewImageAdd = useCallback(
    async (key: string, image: File) => {
      console.log('function', key);
      let widgetUrl = '';
      try {
        const existingItem = layout.find((item) => item.i === key);

        console.log(existingItem, image);

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
            case 'SoundcloudSong':
              (existingItem.content as SoundcloudTrackContentType).artwork =
                widgetUrl;
              break;
            case 'Substack':
              (existingItem.content as SubstackWidgetContentType).image =
                widgetUrl;
              break;
            case 'Github':
              (existingItem.content as GithubWidgetContentType).image =
                widgetUrl;
              break;
            case 'Behance':
              (existingItem.content as BehanceWidgetContentType).image =
                widgetUrl;
              break;
            case 'Medium':
              (existingItem.content as GithubWidgetContentType).image =
                widgetUrl;
              break;
            case 'TwitterProfile':
              (existingItem.content as TwitterWidgetContentType).bannerImage =
                widgetUrl;
              break;
            case 'Youtube':
              (existingItem.content as YoutubeWidgetContentType).thumbnail =
                widgetUrl;
              break;
            case 'Dribbble':
              (existingItem.content as DribbbleWidgetContentType).image =
                widgetUrl;
              break;
            case 'LinkedInProfile':
              (
                existingItem.content as LinkedInProfileWidgetContentType
              ).bannerImage = widgetUrl;
              break;

            default:
              break;
          }
          await updateWidgetContentAsync({
            key: existingItem.i,
            content: existingItem.content,
          });
          handleLayoutChange(
            layout.map((item) =>
              item.i === existingItem.i
                ? { ...item, content: existingItem.content }
                : item
            )
          );
          console.log('here');
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast(`We couldn't update a widget`, {
          description: message,
        });
      }
    },
    [
      layout,
      uploadWidgetsImageAsync,
      updateWidgetContentAsync,
      handleLayoutChange,
    ]
  );

  const handleRestoreImage = useCallback(
    async (
      key: string,
      type: WidgetType,
      redirectUrl: string,
      content: WidgetContentType
    ) => {
      try {
        const existingItem = layout.find((item) => item.i === key);
        if (!existingItem) {
          throw new Error('Failed to find widget to update.');
        }

        const returnedImage = await restoreWidgetImageAsync({
          key,
          type,
          redirectUrl,
          content,
        });
        // if image does exist, now you can update it
        if (returnedImage !== undefined && returnedImage !== '') {
          switch (existingItem.type) {
            case 'Link':
              (existingItem.content as LinkWidgetContentType).heroImageUrl =
                returnedImage;
              break;
            case 'SoundcloudSong':
              (existingItem.content as SoundcloudTrackContentType).artwork =
                returnedImage;
              break;
            case 'Substack':
              (existingItem.content as SubstackWidgetContentType).image =
                returnedImage;
              break;
            case 'Github':
              (existingItem.content as GithubWidgetContentType).image =
                returnedImage;
              break;
            case 'Behance':
              (existingItem.content as BehanceWidgetContentType).image =
                returnedImage;
              break;
            case 'Medium':
              (existingItem.content as GithubWidgetContentType).image =
                returnedImage;
              break;
            case 'TwitterProfile':
              (existingItem.content as TwitterWidgetContentType).bannerImage =
                returnedImage;
              break;
            case 'Youtube':
              (existingItem.content as YoutubeWidgetContentType).thumbnail =
                returnedImage;
              break;
            case 'Dribbble':
              (existingItem.content as DribbbleWidgetContentType).image =
                returnedImage;
              break;
            case 'LinkedInProfile':
              (
                existingItem.content as LinkedInProfileWidgetContentType
              ).bannerImage = returnedImage;
              break;

            default:
              break;
          }
          await updateWidgetContentAsync({
            key: existingItem.i,
            content: existingItem.content,
          });

          // and if that site doesn't have an image, hold off on doing anything and inform the user.
        } else {
          toast(`It looks like this site has no image for this URL`, {
            description: `We won't update or delete the current image.`,
          });
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast(`We couldn't update the picture`, {
          description: message,
        });
      }
    },
    [layout, restoreWidgetImageAsync, updateWidgetContentAsync]
  );

  /** Handles the replacement of display images for Link and Photo Widgets */
  const handleImageRemoval = useCallback(
    async (key: string) => {
      try {
        const existingItem = layout.find((item) => item.i === key);

        if (existingItem) {
          switch (existingItem.type) {
            case 'Link':
              (existingItem.content as LinkWidgetContentType).heroImageUrl =
                undefined;
              break;
            case 'SoundcloudSong':
              (existingItem.content as SoundcloudTrackContentType).artwork =
                undefined;
              break;
            case 'Substack':
              (existingItem.content as SubstackWidgetContentType).image =
                undefined;
              break;
            case 'Github':
              (existingItem.content as GithubWidgetContentType).image =
                undefined;
              break;
            case 'Behance':
              (existingItem.content as BehanceWidgetContentType).image =
                undefined;
              break;
            case 'Medium':
              (existingItem.content as GithubWidgetContentType).image =
                undefined;
              break;
            case 'TwitterProfile':
              (existingItem.content as TwitterWidgetContentType).bannerImage =
                undefined;
              break;
            case 'Youtube':
              (existingItem.content as YoutubeWidgetContentType).thumbnail =
                undefined;
              break;
            case 'Dribbble':
              (existingItem.content as DribbbleWidgetContentType).image =
                undefined;
              break;
            case 'LinkedInProfile':
              (
                existingItem.content as LinkedInProfileWidgetContentType
              ).bannerImage = undefined;
              break;

            default:
              break;
          }
          await updateWidgetContentAsync({
            key: existingItem.i,
            content: existingItem.content,
          });
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast(`We couldn't remove the picture`, {
          description: message,
        });
      }
    },
    [layout, updateWidgetContentAsync]
  );

  /** Handles the cropping of images, the id of the image being cropped should be passed */
  const handleImageCropping = useCallback(
    async (key: string, croppedArea: Area) => {
      try {
        const existingItem = layout.find((item) => item.i === key);

        if (existingItem) {
          (existingItem.content as PhotoWidgetContentType).croppedArea =
            croppedArea;
          (existingItem.content as PhotoWidgetContentType).isCropped = true;
          await updateWidgetContentAsync({
            key: existingItem.i,
            content: existingItem.content,
          });
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast(`We couldn't crop this widget`, {
          description: message,
        });
      }
    },
    [layout, updateWidgetContentAsync]
  );

  const handleWidgetEditLink = useCallback(
    async (key: string, url: string) => {
      try {
        const existingItem = layout.find((item) => item.i === key);
        if (existingItem) {
          await updateWidgetLinkAsync({ key: key, url: url });
        } else {
          throw new Error('No widget exists to edit');
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast(`We couldn't update a widget`, {
          description: message,
        });
      }
    },
    [layout, updateWidgetLinkAsync]
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
    [handleWidgetAdd, uploadWidgetsImageAsync]
  );

  const handleSectionTitleAdd = useCallback(async () => {
    try {
      setAddingWidget(true);
      const widget = await createWidget({ url: '', type: 'SectionTitle' });
      if (!widget) {
        throw new Error('Failed to add widget. Please try again.');
      }
      const widgetToAdd: WidgetLayoutItem = {
        i: widget.id,
        x: (layout.length * 2) % cols,
        y: 0,
        w: WidgetDimensions.Section.w,
        h: WidgetDimensions.Section.h,
        type: 'SectionTitle',
        content: widget.content,
        static: !editMode,
        isResizable: false,
        isDraggable: editMode,
        loading: false,
        size: 'Section',
      };

      setLayout((prevLayout) => {
        return [...prevLayout, widgetToAdd];
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      toast(`We couldn't add a section title`, {
        description: message,
      });
    } finally {
      setAddingWidget(false);
    }
  }, [editMode, layout, cols, createWidget, setLayout]);

  const handleSectionTitleUpdate = useCallback(
    async (key: string, title: string) => {
      try {
        const existingItem = layout.find((item) => item.i === key);
        if (existingItem && existingItem.type === 'SectionTitle') {
          (existingItem.content as SectionTitleWidgetContentType).title = title;
          await updateWidgetContentAsync({
            key: existingItem.i,
            content: existingItem.content,
          });
        } else {
          throw new Error(`Couldn't edit widget's title`);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        toast(`We couldn't update a widget`, {
          description: message,
        });
      }
    },
    [layout, updateWidgetContentAsync]
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
              toast(`We couldn't add a widget`, {
                description: message,
              });
            }
          })
        )
      ).filter((widget): widget is WidgetLayoutItem => widget !== undefined);

      setLayout((prevLayout) => {
        return [...prevLayout, ...widgetsToAdd];
      });
      setAddingWidget(false);
    },
    [cols, editMode, createWidget, setLayout]
  );

  return {
    errorInvalidImage,
    setErrorInvalidImage,
    addingWidget,
    handleWidgetRemove,
    handleWidgetAdd,
    handleFileDrop,
    handleSectionTitleAdd,
    handleSectionTitleUpdate,
    handleWidgetEditLink,
    handleNewImageAdd,
    handleRestoreImage,
    handleImageRemoval,
    handleImageCropping,
    handleAddMultipleWidgets,
  };
};

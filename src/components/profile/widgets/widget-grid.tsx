import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';

import { CroppingWidget } from '@/components/profile/widgets/cropping-widget';
import { FileDropArea } from '@/components/profile/widgets/file-drop-area';
import { InvalidAlert } from '@/components/profile/widgets/invalid-alert';
import { useLayoutManagement } from '@/hooks/profile/useLayoutManagement';
import { useOnboardingDrawer } from '@/hooks/profile/useOnboardingDrawer';
import { useWidgetManagement } from '@/hooks/profile/useWidgetManagement';
import { cn } from '@/lib/utils';
import { getWidgetDimensions, WidgetSize } from '@/types';

import { AddWidgets } from './add-widgets';
import { DesktopOnlyAlert } from './desktop-only-alert';
import { OnboardingDrawer } from './onboarding-drawer';
import styles from './react-grid-layout-custom.module.css';
import { Widget } from './widget';
import { WidgetPlaceholderGrid } from './widget-placeholder-grid';

const ReactGridLayout = WidthProvider(RGL);

export interface WidgetGridProps {
  rowHeight?: number;
  editMode: boolean;
  userId: string;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  rowHeight = 120,
  editMode,
  userId,
}) => {
  const draggedRef = useRef<boolean>(false);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  const [gridWidth, setGridWidth] = useState<number>(0);
  const [gridHeight, setGridHeight] = useState<number>(0);

  const {
    layout,
    setLayout,
    handleLayoutChange,
    persistWidgetsLayoutOnChange,
    cols,
    animationStyles,
    widgetRefs,
    handleWidgetDropStop,
    handleWidgetResize,
    isUserWidgetPending,
  } = useLayoutManagement({ userId, editMode });

  const {
    errorInvalidImage,
    setErrorInvalidImage,
    addingWidget,
    modifyingWidget,
    handleWidgetRemove,
    handleWidgetAdd,
    handleFileDrop,
    handleWidgetEditLink,
    handleNewImageAdd,
    handleRestoreImage,
    handleImageRemoval,
    handleImageCropping,
    handleSectionTitleAdd,
    handleSectionTitleUpdate,
    handleAddMultipleWidgets,
  } = useWidgetManagement({
    userId,
    editMode,
    layout,
    setLayout,
    persistWidgetsLayoutOnChange,
    cols,
  });

  const { drawerOpen, setDrawerOpen, handleOnboardingDrawerSubmit } =
    useOnboardingDrawer({ handleAddMultipleWidgets });

  if (isUserWidgetPending) {
    return <WidgetPlaceholderGrid loading className='px-[25px]' />;
  }

  const calculateWidgetPixelDimensions = (
    size: WidgetSize,
    gridWidth: number,
    cols: number,
    margins: number
  ): { width: number; height: number } => {
    const { w, h } = getWidgetDimensions({ size });

    const columnWidths: { [key: number]: number } = {
      2: gridWidth / 2,
      4: 603 / 2,
      6: 393 / 2,
      8: 289 / 2,
    };

    // calculations from: https://github.com/react-grid-layout/react-grid-layout/issues/1432
    return {
      width: w * columnWidths[cols as number] + margins * (w / 2 - 1),
      height: h * rowHeight + margins * (h - 1),
    };
  };

  const existingItem = layout.find((item) => item.i === activeWidget);

  return (
    <>
      {editMode && layout.length < 1 && (
        <FileDropArea onFileDrop={handleFileDrop} className='py-[25px]'>
          <WidgetPlaceholderGrid
            onClick={() => setDrawerOpen(true)}
            loading={addingWidget}
            className='px-[25px]'
          />
        </FileDropArea>
      )}
      <OnboardingDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleOnboardingDrawerSubmit}
      />
      <DesktopOnlyAlert />
      {editMode ? (
        <div>
          {activeWidget && existingItem !== undefined ? (
            <div
              className='relative w-full'
              style={{ minHeight: `${gridHeight}px` }}
            >
              <CroppingWidget
                identifier={existingItem.i}
                item={existingItem}
                w={existingItem.w}
                h={existingItem.h}
                type={existingItem.type}
                margins={[25, 25]}
                handleEditLink={handleWidgetEditLink}
                content={existingItem.content}
                initialSize={existingItem.size}
                redirectUrl={existingItem.redirectUrl}
                draggedRef={draggedRef}
                widgetDimensions={calculateWidgetPixelDimensions(
                  existingItem.size,
                  gridWidth,
                  cols,
                  25
                )}
                activeWidget={activeWidget}
                setActiveWidget={setActiveWidget}
                handleImageCropping={handleImageCropping}
              />
            </div>
          ) : (
            <FileDropArea onFileDrop={handleFileDrop}>
              <ReactGridLayout
                layout={layout}
                onLayoutChange={handleLayoutChange}
                className={cn(
                  styles['react-grid-layout-custom'],
                  'w-full max-w-6xl'
                )}
                rowHeight={rowHeight}
                margin={[25, 25]}
                cols={cols}
                onDragStop={handleWidgetDropStop}
                isDraggable={editMode} // Disable dragging if cropping
                isResizable={editMode}
                onDrag={() => (draggedRef.current = true)}
                innerRef={(node) => {
                  if (node) {
                    setGridWidth(node.offsetWidth);
                    setGridHeight(node.offsetHeight);
                  }
                }}
              >
                {layout.map((item) => {
                  // Allow all widgets to render if not cropping
                  const shouldRender = !activeWidget || activeWidget === item.i;
                  return (
                    <motion.div
                      id={item.i}
                      className={cn(
                        `widget-motion-wrapper`,
                        shouldRender ? '' : 'hidden'
                      )}
                      initial={false}
                      animate={animationStyles[item.i]}
                      style={{ width: '100%', height: '100%' }}
                      key={item.i}
                      data-grid={item}
                      ref={(el) => {
                        if (el) widgetRefs.current[item.i] = el;
                      }}
                    >
                      <Widget
                        identifier={item.i}
                        w={item.w}
                        h={item.h}
                        type={item.type}
                        showControls={editMode}
                        handleResize={handleWidgetResize}
                        handleRemove={(key) => handleWidgetRemove(key)}
                        handleEditLink={() => handleWidgetEditLink}
                        handleRestoreImage={handleRestoreImage}
                        content={item.content}
                        size={item.size}
                        redirectUrl={item.redirectUrl}
                        handleTitleUpdate={handleSectionTitleUpdate}
                        draggedRef={draggedRef}
                        widgetDimensions={calculateWidgetPixelDimensions(
                          item.size,
                          gridWidth,
                          cols,
                          25
                        )}
                        activeWidget={activeWidget}
                        setActiveWidget={setActiveWidget}
                        addImage={handleNewImageAdd}
                        removeImage={handleImageRemoval}
                        loading={modifyingWidget}
                        setErrorInvalidImage={setErrorInvalidImage}
                      />
                    </motion.div>
                  );
                })}
              </ReactGridLayout>
            </FileDropArea>
          )}
          {/** bottom bar where widgets can be added */}
          <div className='fix-modal-layout-shift fixed bottom-0 left-1/2 z-30 -translate-x-1/2 -translate-y-6 transform'>
            <div className='flex w-full flex-col items-center'>
              {errorInvalidImage && (
                <div className='animate-in slide-in-from-bottom-8 z-0 mb-2 w-full'>
                  <InvalidAlert
                    handleAlertVisible={(show: boolean) =>
                      setErrorInvalidImage(show)
                    }
                    title='Error uploading file'
                  >
                    <p className='mt-2'>
                      You can only upload jpg, png, svg or gif files only.
                    </p>
                    <p>Maximum 10mb file size</p>
                  </InvalidAlert>
                </div>
              )}
              <AddWidgets
                addUrl={handleWidgetAdd}
                addSectionTitle={handleSectionTitleAdd}
                loading={addingWidget}
              />
            </div>
          </div>
        </div>
      ) : (
        <ReactGridLayout
          layout={layout}
          onLayoutChange={handleLayoutChange}
          className={styles['react-grid-layout-custom']}
          rowHeight={rowHeight}
          margin={[25, 25]}
          cols={cols}
          onDragStop={handleWidgetDropStop}
          isDraggable={editMode}
          isResizable={editMode}
          onDrag={() => (draggedRef.current = true)}
          innerRef={(node) => {
            if (node) {
              setGridWidth(node.offsetWidth);
              setGridHeight(node.offsetHeight);
            }
          }}
        >
          {layout.map((item) => {
            // Allow all widgets to render if not cropping
            const shouldRender = !activeWidget || activeWidget === item.i;
            return (
              <motion.div
                id={item.i}
                className={cn(
                  `widget-motion-wrapper`,
                  shouldRender ? '' : 'hidden'
                )}
                initial={false}
                animate={animationStyles[item.i]}
                style={{ width: '100%', height: '100%' }}
                key={item.i}
                data-grid={item}
                ref={(el) => {
                  if (el) widgetRefs.current[item.i] = el;
                }}
              >
                <Widget
                  identifier={item.i}
                  w={item.w}
                  h={item.h}
                  type={item.type}
                  showControls={editMode}
                  handleResize={() => handleWidgetResize}
                  handleRemove={() => handleWidgetRemove}
                  handleEditLink={() => handleWidgetEditLink}
                  handleRestoreImage={handleRestoreImage}
                  content={item.content}
                  size={item.size}
                  redirectUrl={item.redirectUrl}
                  draggedRef={draggedRef}
                  widgetDimensions={calculateWidgetPixelDimensions(
                    item.size,
                    gridWidth,
                    cols,
                    25
                  )}
                  activeWidget={activeWidget}
                  setActiveWidget={setActiveWidget}
                  addImage={handleNewImageAdd}
                  removeImage={handleImageRemoval}
                  loading={modifyingWidget}
                  handleTitleUpdate={handleSectionTitleUpdate}
                  setErrorInvalidImage={setErrorInvalidImage}
                />
              </motion.div>
            );
          })}
        </ReactGridLayout>
      )}
    </>
  );
};

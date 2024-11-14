import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';

import { FileDropArea } from '@/components/profile/widgets/file-drop-area';
import { InvalidAlert } from '@/components/profile/widgets/invalid-alert';
import { useLayoutManagement } from '@/hooks/profile/useLayoutManagement';
import { useOnboardingDrawer } from '@/hooks/profile/useOnboardingDrawer';
import { useWidgetManagement } from '@/hooks/profile/useWidgetManagement';

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
  onLayoutChange?: (layout: any) => void;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  rowHeight = 120,
  editMode,
  userId,
  onLayoutChange,
}) => {
  const draggedRef = useRef<boolean>(false);

  const {
    layout,
    setLayout,
    cols,
    animationStyles,
    widgetRefs,
    handleLayoutChange,
    handleWidgetDropStop,
    handleWidgetResize,
    isUserWidgetPending,
    persistWidgetsLayoutOnChange,
  } = useLayoutManagement({ userId, editMode, onLayoutChange });

  const {
    errorInvalidImage,
    setErrorInvalidImage,
    addingWidget,
    handleWidgetRemove,
    handleWidgetAdd,
    handleFileDrop,
    handleSectionTitleAdd,
    handleSectionTitleUpdate,
    handleAddMultipleWidgets,
  } = useWidgetManagement({
    userId,
    editMode,
    layout,
    setLayout,
    cols,
    persistWidgetsLayoutOnChange,
  });

  const { drawerOpen, setDrawerOpen, handleOnboardingDrawerSubmit } =
    useOnboardingDrawer({ handleAddMultipleWidgets });

  if (isUserWidgetPending) {
    return <WidgetPlaceholderGrid loading className='px-[25px]' />;
  }

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
      <div>
        <FileDropArea onFileDrop={handleFileDrop}>
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
          >
            {layout.map((item) => (
              <motion.div
                className='widget-motion-wrapper'
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
                  handleRemove={handleWidgetRemove}
                  content={item.content}
                  initialSize={item.size}
                  redirectUrl={item.redirectUrl}
                  handleTitleUpdate={handleSectionTitleUpdate}
                  draggedRef={draggedRef}
                />
              </motion.div>
            ))}
          </ReactGridLayout>
        </FileDropArea>

        {editMode && (
          <div className='fix-modal-layout-shift fixed bottom-0 left-1/2 z-30 -translate-x-1/2 -translate-y-6 transform'>
            <div className='flex w-full max-w-96 flex-col items-center'>
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
        )}
      </div>
    </>
  );
};

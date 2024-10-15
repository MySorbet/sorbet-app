import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { motion } from 'framer-motion';
import RGL, { WidthProvider } from 'react-grid-layout';

import { AddWidgets } from './add-widgets';
import { DesktopOnlyAlert } from './desktop-only-alert';
import { OnboardingDrawer } from './onboarding-drawer';
import styles from './react-grid-layout-custom.module.css';
import { Widget } from './widget';
import { WidgetPlaceholderGrid } from './widget-placeholder-grid';
import { InvalidAlert } from '@/components/profile/widgets/invalid-alert';
import { FileDropArea } from '@/components/profile/widgets/file-drop-area';
import { useWidgetGrid } from '@/hooks/profile/useWidgetGrid';

const ReactGridLayout = WidthProvider(RGL);

export interface WidgetGridProps {
  rowHeight?: number;
  editMode: boolean;
  userId: string;
  onLayoutChange?: (layout: any) => void;
}

/**
 * Root component which renders all widgets and link input to add new widgets.
 */
export const WidgetGrid: React.FC<WidgetGridProps> = ({
  rowHeight = 120,
  editMode,
  userId,
  onLayoutChange,
}) => {
  const {
    layout,
    cols,
    containerRef,
    widgetRefs,
    animationStyles,
    errorInvalidImage,
    setErrorInvalidImage,
    addingWidget,
    drawerOpen,
    setDrawerOpen,
    handleLayoutChange,
    handleWidgetResize,
    handleOnboardingDrawerSubmit,
    handleWidgetRemove,
    handleWidgetAdd,
    handleFileDrop,
    handleAddMultipleWidgets,
    handleWidgetDropStop,
    draggedRef,
    isUserWidgetPending,
  } = useWidgetGrid({ userId, editMode, onLayoutChange });

  // Use the placeholder grid loading state while we fetch the user's widgets
  if (isUserWidgetPending) {
    return (
      <WidgetPlaceholderGrid
        loading
        className='px-[25px]' // Add some additional padding because RGL margin is around the entire grid
      />
    );
  }

  return (
    <>
      {editMode && layout.length < 1 && (
        <WidgetPlaceholderGrid
          onClick={() => setDrawerOpen(true)}
          loading={addingWidget}
          className='px-[25px]' // Add some additional padding because RGL margin is around the entire grid
        />
      )}
      <OnboardingDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleOnboardingDrawerSubmit}
      />
      <DesktopOnlyAlert />
      <div ref={containerRef}>
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
              <AddWidgets addUrl={handleWidgetAdd} loading={addingWidget} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

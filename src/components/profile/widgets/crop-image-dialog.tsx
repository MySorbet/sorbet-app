'use client';

import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import useMeasure from 'react-use-measure';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Cropper, { Area } from 'react-easy-crop';

interface CropImageModalProps {
  trigger: React.ReactNode;
}

const Output = ({ croppedArea }: any) => {
  const scale = 100 / croppedArea.width;
  const transform = {
    x: `${-croppedArea.x * scale}%`,
    y: `${-croppedArea.y * scale}%`,
    scale,
    width: 'calc(100% + 0.5px)',
    height: 'auto',
  };

  const imageStyle = {
    transform: `translate3d(${transform.x}, ${transform.y}, 0) scale3d(${transform.scale},${transform.scale},1)`,
    width: transform.width,
    height: transform.height,
  };

  return (
    <div
      className='output'
      style={{ paddingBottom: `${100 / CROP_AREA_ASPECT}%` }}
    >
      <img
        src='https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000'
        alt=''
        style={imageStyle}
      />
    </div>
  );
};

const CROP_AREA_ASPECT = 2 / 2;

export const CropImageDialog = ({ trigger }: CropImageModalProps) => {
  const [contentRef, { height: contentHeight }] = useMeasure();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log(croppedArea, croppedAreaPixels);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className='flex w-[400px] flex-col items-center gap-6 rounded-3xl bg-[#F9F7FF] p-4 sm:rounded-3xl'
        hideDefaultCloseButton={true}
        aria-describedby='Cropping Image'
      >
        <DialogTitle className='text-2xl'>Cropping Image</DialogTitle>
        <motion.div
          animate={{
            height: contentHeight,
          }}
          className='overflow-hidden'
        >
          <div ref={contentRef}>
            <FadeIn>
              <div className='h-[400px] w-[400px]'>
                <div className='relative h-[100px] w-[100px]'>
                  <Cropper
                    image={
                      'https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000'
                    }
                    crop={crop}
                    zoom={zoom}
                    aspect={CROP_AREA_ASPECT}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    onCropAreaChange={setCroppedArea}
                  />
                </div>
                <div className='absolute h-[100px] w-[100px]'>
                  {croppedArea && <Output croppedArea={croppedArea} />}
                </div>
              </div>
            </FadeIn>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

/** All this does is animate the opacity of each component and adds a delay for better timing */
const FadeIn = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {children}
    </motion.div>
  );
};

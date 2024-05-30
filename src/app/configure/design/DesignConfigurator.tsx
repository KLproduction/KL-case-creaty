"use client";

import HandleComponents from "@/components/HandleComponents";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import {Field, Radio, RadioGroup} from '@headlessui/react'
import { useState } from "react";
import { COLORS } from "@/validators/option-validators";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { color } from "framer-motion";


interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

type ColorType = (typeof COLORS)[number];

const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) => {
  const [options , setOptions] = useState<{
    color:ColorType
  }>({
    color:COLORS[0],
  })

  return (
    <div className=" relative mt-20 grid grid-cols-3 mb-20 pb-20">
      <div className=" relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <div className=" relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          {/* Phone /Lens display */}
          <AspectRatio
            ratio={896 / 1831}
            className=" pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="phone img"
              src="/phone-template.png"
              className=" pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div
            className=" absolute z-40 inset-0 left-[3px] 
            top-px right-[3px] bottom-px rounded-[32px] 
            shadow-[00_0_0_99999px_rgba(229,231,235,0.6)]"
          />

          {/* blackcolor for choosing */}
          <div
            className={clsx(
              " absolute inset-0 left-[3px ] top-px right-[3px] bottom-px rounded-[32px]",
              "rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          />
        </div>


        {/* Uploaded imgage */}
        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 2.2,
            width: imageDimensions.width / 2.2,
          }}
          className=" absolute z-20 border-[3px] border-primary"
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponents />,
            bottomLeft: <HandleComponents />,
            topRight: <HandleComponents />,
            topLeft: <HandleComponents />,
          }}
        >
          <div className=" relative w-full h-full">
            <NextImage
              src={imageUrl}
              fill
              alt="your image"
              className=" pointer-events-none"
            />
          </div>
        </Rnd>
      </div>


      {/* Coutomize side bar */}

      <div className=" h-[37.5rem] flex flex-col bg-white">
        <ScrollArea className=" relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className=" absolute z-10 inset-0 bottom-0 h-12
           bg-gradient-to-t from-white pointer-events-none"
          />

          <div className=" px-8 pb-12 pt-8">
            <h2 className=" z-20 tracking-tight font-bold text-3xl">
              Customize your case
            </h2>
            <div className=" w-full h-px bg-zinc-200 my-6" />
            <div className=" relative mt-4 h-f flex flex-col flex-1 justify-between gap-5">
              <Label>Color: {options.color.label}</Label>
              <RadioGroup 
              value={options.color}
              className="flex  gap-5"
              onChange={(val)=>{
                setOptions((prev)=>({
                  ...prev,
                  color:val,
                }))
              }}>
                {COLORS.map((color)=>(
                  <Field 
                  key={color.label} 
                  className="flex items-center gap-2">
                    <Radio 
                    value={color}
                    className={cn(
                      'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent',
                      `data-[checked]:bg-primary`
                    )}
                    >
                      {/* <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" /> */}
                      <span className=""></span>
                      <span
                          className={cn(
                            `bg-${color.tw}`,
                            'h-8 w-8 rounded-full border border-black border-opacity-10'
                          )}
                          />
                    </Radio>
                  </Field>
                ))}
              
              </RadioGroup>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DesignConfigurator;

"use client";

import HandleComponents from "@/components/HandleComponents";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { Description, Field, Radio, RadioGroup } from "@headlessui/react";
import { useEffect, useState } from "react";
import {
  COLORS,
  MATERIALS,
  MODELS,
  FINISHES,
} from "@/validators/option-validators";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { BASE_PRICE } from "@/config/product";

  interface DesignConfiguratorProps {
    configId: string;
    imageUrl: string;
    imageDimensions: { width: number; height: number };
  }
  
  type ColorType = (typeof COLORS)[number];
  type ModelType = (typeof MODELS.options)[number];
  type MaterialType = (typeof MATERIALS.options)[number];
  type FinishesType = (typeof FINISHES.options)[number];
  
  const DesignConfigurator = ({ configId, imageUrl, imageDimensions }: DesignConfiguratorProps) => {
    const [options, setOptions] = useState<{
      color: ColorType;
      model: ModelType;
      material: MaterialType;
      finish: FinishesType;
    }>({
      color: COLORS[0],
      model: MODELS.options[0],
      material: MATERIALS.options[0],
      finish: FINISHES.options[0],
    });

    useEffect(()=>{
      console.log(options.finish.price)
    },[])
  
    return (
      <div className="relative mt-20 grid grid-cols-3 mb-20 pb-20">
        <div className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">

            {/* Phone /Lens display */}

            <AspectRatio ratio={896 / 1831} className="pointer-events-none relative z-50 aspect-[896/1831] w-full">
              <NextImage
                fill
                alt="phone img"
                src="/phone-template.png"
                className="pointer-events-none z-50 select-none"
              />
            </AspectRatio>
            <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
  
            {/* blackground color for choosing */}

            <div
              className={clsx(
                "absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
                "rounded-[32px]",
                `bg-${options.color.tw}`
              )}/>

          </div>
  
          {/* Uploaded image handling */}

          <Rnd
            default={{
              x: 150,
              y: 205,
              height: imageDimensions.height / 2.2,
              width: imageDimensions.width / 2.2,
            }}
            className="absolute z-20 border-[3px] border-primary"
            lockAspectRatio
            resizeHandleComponent={{
              bottomRight: <HandleComponents />,
              bottomLeft: <HandleComponents />,
              topRight: <HandleComponents />,
              topLeft: <HandleComponents />,
            }}
          >
            <div className="relative w-full h-full">
              <NextImage src={imageUrl} fill alt="your image" className="pointer-events-none" />
            </div>
          </Rnd>
        </div>
  
        {/* Customize sidebar */}

        {/* Color selection */}

        <div className="h-[37.5rem] flex flex-col bg-white">
          <ScrollArea className="relative flex-1 overflow-auto">
            <div className="px-8 pb-12 pt-8">
              <h2 className="z-20 tracking-tight font-bold text-3xl">Customize your case</h2>
              <div className="w-full h-px bg-zinc-200 my-6" />
              <div className="relative mt-4 flex flex-col flex-1 justify-between gap-5">
                <Label>Color: {options.color.label}</Label>
                <RadioGroup
                  value={options.color}
                  className="flex gap-5"
                  onChange={(val) => setOptions((prev) => ({ ...prev, color: val }))}
                >
                  {COLORS.map((color) => (
                    <Field key={color.label} className="flex items-center gap-2">
                      <Radio
                        value={color}
                        className={cn(
                          "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                          `data-[checked]:bg-primary`
                        )}
                      >
                        <span className={`bg-${color.tw} h-8 w-8 rounded-full border border-black border-opacity-10`} />
                      </Radio>
                    </Field>
                  ))}
                </RadioGroup>

                {/* Model selection */}

                <div className="relative flex flex-col gap-5 w-full">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className=" z-50 bg-white border-zinc-300 border rounded-lg">
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn("flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100", {
                            "bg-zinc-100": model.label === options.model.label,
                          })}
                          onClick={() => setOptions((prev) => ({ ...prev, model }))}
                        >
                          <Check className={cn("mr-2 h-4 w-4", model.label === options.model.label ? "opacity-100" : "opacity-0")} />
                          <div className="cursor-pointer">{model.label}</div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Material & finishes selection */}
                  
                  <RadioGroup
                  className="flex flex-col gap-3"
                    value={options.material}
                    onChange={(val) => setOptions((prev) => ({ ...prev, material: val }))}
                  >
                    <Label>Material</Label>
                    {MATERIALS.options.map((option) => (
                      <Radio
                        key={option.value}
                        value={option}
                        className="relative flex justify-between cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex data-[checked]:border-primary"
                      >
                        <span className="flex items-center">
                          <span className="flex flex-col text-sm">
                            <Label className="font-medium text-gray-900">{option.label}</Label>
                            {option.description && (
                              <Description as="span" className="text-xs text-gray-500">
                                {option.description}
                              </Description>
                            )}
                          </span>
                        </span>
                        <Description as="span" className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right">
                          <span className="font-medium text-gray-900">{formatPrice(option.price / 100)}</span>
                        </Description>
                      </Radio>
                    ))}
                  </RadioGroup>

                  <RadioGroup
                  className="flex flex-col gap-3"
                    value={options.finish}
                    onChange={(val) => setOptions((prev) => ({ ...prev, finish: val }))}
                  >
                    <Label>Finish</Label>
                    {FINISHES.options.map((option) => (
                      <Radio
                        key={option.value}
                        value={option}
                        className="relative flex justify-between cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex data-[checked]:border-primary"
                      >
                        <span className="flex items-center">
                          <span className="flex flex-col text-sm">
                            <Label className="font-medium text-gray-900">{option.label}</Label>
                            {option.description && (
                              <Description as="span" className="text-xs text-gray-500">
                                {option.description}
                              </Description>
                            )}
                          </span>
                        </span>
                        <Description as="span" className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right">
                          <span className="font-medium text-gray-900">{formatPrice(option.price / 100)}</span>
                        </Description>
                      </Radio>
                    ))}
                  </RadioGroup>

                </div>
              </div>
            </div>
          </ScrollArea>
          <div className=" w-full px-8 h-16 bg-white">
            <div className=" h-px w-full bg-zinc-200"/>
            <div className=" w-full h-full flex items-center">
              <div className=" w-full flex items-center justify-between gap-6">
                <p className=" font-medium whitespace-nowrap">
                  {formatPrice((BASE_PRICE + options.material.price + options.finish.price) / 100)}
                  
                </p>
                <Button size="sm" className="w-full">
                  Continue
                  <ArrowRight className="h-4 w-4 ml-1.5 inline"/>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default DesignConfigurator;

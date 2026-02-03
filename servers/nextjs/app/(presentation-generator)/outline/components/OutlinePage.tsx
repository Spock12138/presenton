"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { OverlayLoader } from "@/components/ui/overlay-loader";
import Wrapper from "@/components/Wrapper";
import OutlineContent from "./OutlineContent";
import EmptyStateView from "./EmptyStateView";
import GenerateButton from "./GenerateButton";

import { TABS, Template } from "../types/index";
import { useOutlineStreaming } from "../hooks/useOutlineStreaming";
import { useOutlineManagement } from "../hooks/useOutlineManagement";
import { usePresentationGeneration } from "../hooks/usePresentationGeneration";
import TemplateSelection from "./TemplateSelection";
import { useLayout } from "../../context/LayoutContext";

const OutlinePage: React.FC = () => {
  const { presentation_id, outlines } = useSelector(
    (state: RootState) => state.presentationGeneration
  );

  const { getLayoutsByTemplateID, getTemplateSetting, loading: layoutLoading } = useLayout();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get('templateId');

  const [activeTab, setActiveTab] = useState<string>(TABS.OUTLINE);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isTemplateValid, setIsTemplateValid] = useState(true);

  useEffect(() => {
    if (templateIdParam && !layoutLoading) {
      if (!selectedTemplate) {
        const slides = getLayoutsByTemplateID(templateIdParam);
        if (slides && slides.length > 0) {
          const settings = getTemplateSetting(templateIdParam);
          const newTemplate: Template = {
            id: templateIdParam,
            name: settings?.name || templateIdParam,
            description: settings?.description || "",
            ordered: settings?.ordered || false,
            default: settings?.default || false,
            slides: slides
          };
          setSelectedTemplate(newTemplate);
          setIsTemplateValid(true);
        } else {
           setIsTemplateValid(false);
        }
      }
    }
  }, [templateIdParam, layoutLoading, getLayoutsByTemplateID, getTemplateSetting, selectedTemplate]);

  // Custom hooks
  const streamState = useOutlineStreaming(presentation_id);
  const { handleDragEnd, handleAddSlide } = useOutlineManagement(outlines);
  const { loadingState, handleSubmit } = usePresentationGeneration(
    presentation_id,
    outlines,
    selectedTemplate,
    setActiveTab
  );
  if (!presentation_id) {
    return <EmptyStateView />;
  }


  return (
    <div className="h-[calc(100vh-72px)]">
      <OverlayLoader
        show={loadingState.isLoading}
        text={loadingState.message}
        showProgress={loadingState.showProgress}
        duration={loadingState.duration}
      />

      <Wrapper className="h-full flex flex-col w-full">
        <div className="flex-grow overflow-y-hidden w-[1200px] mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className={`grid w-[50%] mx-auto my-4 ${templateIdParam && isTemplateValid ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <TabsTrigger value={TABS.OUTLINE}>大纲与内容</TabsTrigger>
              {(!templateIdParam || !isTemplateValid) && <TabsTrigger value={TABS.LAYOUTS}>选择模板</TabsTrigger>}
            </TabsList>

            <div className="flex-grow w-full mx-auto">
              <TabsContent value={TABS.OUTLINE} className="h-[calc(100vh-16rem)] overflow-y-auto custom_scrollbar"
              >
                <div>
                  <OutlineContent
                    outlines={outlines}
                    isLoading={streamState.isLoading}
                    isStreaming={streamState.isStreaming}
                    activeSlideIndex={streamState.activeSlideIndex}
                    highestActiveIndex={streamState.highestActiveIndex}
                    onDragEnd={handleDragEnd}
                    onAddSlide={handleAddSlide}
                  />
                </div>
              </TabsContent>

              {(!templateIdParam || !isTemplateValid) && (
                <TabsContent value={TABS.LAYOUTS} className="h-[calc(100vh-16rem)] overflow-y-auto custom_scrollbar">
                  <div>
                    <TemplateSelection
                      selectedTemplate={selectedTemplate}
                      onSelectTemplate={setSelectedTemplate}
                    />
                  </div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>

        {/* Fixed Button */}
        <div className="py-4 border-t border-gray-200">
          <div className="max-w-[1200px] mx-auto">
            <GenerateButton
              outlineCount={outlines.length}
              loadingState={loadingState}
              streamState={streamState}
              selectedTemplate={selectedTemplate}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default OutlinePage;
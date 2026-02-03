"use client";
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useLayout } from "../context/LayoutContext";
import EditableLayoutWrapper from "../components/EditableLayoutWrapper";
import SlideErrorBoundary from "../components/SlideErrorBoundary";
import TiptapTextReplacer from "../components/TiptapTextReplacer";
import { updateSlideContent } from "../../../store/slices/presentationGeneration";
import { Loader2 } from "lucide-react";

export const useTemplateLayouts = () => {
  const dispatch = useDispatch();
  const { getLayoutById, getLayout, loading } =
    useLayout();

  const getTemplateLayout = useMemo(() => {
    return (layoutId: string, groupName: string) => {
      const layout = getLayoutById(layoutId);
      if (layout) {
        return getLayout(layoutId);
      }
      return null;
    };
  }, [getLayoutById, getLayout]);



  // Render slide content with group validation, automatic Tiptap text editing, and editable images/icons
  const renderSlideContent = useMemo(() => {
    return (slide: any, isEditMode: boolean) => {

      const Layout = getTemplateLayout(slide.layout, slide.layout_group);
      const layoutInfo = getLayoutById(slide.layout);

      // Merge slide content with sample data to ensure defaults are populated
      // This fixes issues where LLM might return empty strings or partial data
      let mergedContent = slide.content;
      
      if (layoutInfo?.sampleData) {
        const merged = { ...layoutInfo.sampleData, ...slide.content };
        
        // Ensure empty strings fallback to sample data defaults if available
        Object.keys(merged).forEach(key => {
           const value = merged[key];
           // Check for null, undefined, or empty string (only if sample data has a non-empty value)
           if ((value === null || value === undefined || value === "") && layoutInfo.sampleData[key]) {
             merged[key] = layoutInfo.sampleData[key];
           }
        });
        mergedContent = merged;
      }

      if (loading) {
        return (
          <div className="flex flex-col items-center justify-center aspect-video h-full bg-gray-100 rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-blue-800" />
          </div>
        );
      }
      if (!Layout) {
        return (
          <div className="flex flex-col items-center justify-center aspect-video h-full bg-gray-100 rounded-lg">
            <p className="text-gray-600 text-center text-base">
              Layout &quot;{slide.layout}&quot; not found in &quot;
              {slide.layout_group}&quot; group
            </p>
          </div>
        );
      }

      if (isEditMode) {
        return (
          <EditableLayoutWrapper
            slideIndex={slide.index}
            slideData={mergedContent}
            properties={slide.properties}
          >
            <TiptapTextReplacer
              key={slide.id}
              slideData={mergedContent}
              slideIndex={slide.index}
              onContentChange={(
                content: string,
                dataPath: string,
                slideIndex?: number
              ) => {
                if (dataPath && slideIndex !== undefined) {
                  dispatch(
                    updateSlideContent({
                      slideIndex: slideIndex,
                      dataPath: dataPath,
                      content: content,
                    })
                  );
                }
              }}
            >
              <SlideErrorBoundary label={`Slide ${slide.index + 1}`}>
                <Layout data={mergedContent} />
              </SlideErrorBoundary>
            </TiptapTextReplacer>
          </EditableLayoutWrapper>
        );
      }
      return (
        <SlideErrorBoundary label={`Slide ${slide.index + 1}`}>
          <Layout data={mergedContent} />
        </SlideErrorBoundary>
      );
    };
  }, [getTemplateLayout, dispatch, getLayoutById, loading]);

  return {
    getTemplateLayout,
    renderSlideContent,
    loading,
  };
};

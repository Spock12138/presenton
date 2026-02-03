import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearPresentationData } from "@/store/slices/presentationGeneration";
import { PresentationGenerationApi } from "../../services/api/presentation-generation";
import { Template, LoadingState, TABS } from "../types/index";
import { MixpanelEvent, trackEvent } from "@/utils/mixpanel";

const DEFAULT_LOADING_STATE: LoadingState = {
  message: "",
  isLoading: false,
  showProgress: false,
  duration: 0,
};

export const usePresentationGeneration = (
  presentationId: string | null,
  outlines: { content: string }[] | null,
  selectedTemplate: Template | null,
  setActiveTab: (tab: string) => void
) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loadingState, setLoadingState] = useState<LoadingState>(DEFAULT_LOADING_STATE);

  const validateInputs = useCallback(() => {
    if (!outlines || outlines.length === 0) {
      toast.error("没有大纲", {
        description: "请等待大纲加载完成后再生成演示文稿",
      });
      return false;
    }

    if (!selectedTemplate) {
      toast.error("选择模板组", {
        description: "请先选择一个模板组",
      });
      return false;
    }
    if (!selectedTemplate.slides.length) {
      toast.error("未找到幻灯片结构", {
        description: "请在生成前选择一个分组",
      });
      return false;
    }

    return true;
  }, [outlines, selectedTemplate]);

  const prepareLayoutData = useCallback(() => {
    if (!selectedTemplate) return null;
    return {
      name: selectedTemplate.name,
      ordered: selectedTemplate.ordered,
      slides: selectedTemplate.slides
    };
  }, [selectedTemplate]);

  const handleSubmit = useCallback(async () => {
    if (!selectedTemplate) {
      setActiveTab(TABS.LAYOUTS);
      return;
    }
    if (!validateInputs()) return;



    setLoadingState({
      message: "正在生成演示文稿数据...",
      isLoading: true,
      showProgress: true,
      duration: 30,
    });

    try {
      const layoutData = prepareLayoutData();

      if (!layoutData) return;
      trackEvent(MixpanelEvent.Presentation_Prepare_API_Call);
      const response = await PresentationGenerationApi.presentationPrepare({
        presentation_id: presentationId,
        outlines: outlines,
        layout: layoutData,
      });

      if (response) {
        dispatch(clearPresentationData());
        router.replace(`/presentation?id=${presentationId}&stream=true`);
      }
    } catch (error: any) {
      console.error('Error In Presentation Generation(prepare).', error);
      toast.error("生成错误", {
        description: error.message || "演示文稿生成(准备阶段)出错",
      });
    } finally {
      setLoadingState(DEFAULT_LOADING_STATE);
    }
  }, [validateInputs, prepareLayoutData, presentationId, outlines, dispatch, router, selectedTemplate]);

  return {
    loadingState,
    handleSubmit,
  };
};

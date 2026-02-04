"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useLayout } from "../(presentation-generator)/context/LayoutContext";
const page = () => {
  const searchParams = useSearchParams();
  const templateID = searchParams.get("group");
  const { getLayoutsByTemplateID, getTemplateSetting, loading, error } = useLayout();

  console.log("Schema Page Rendering, TemplateID:", templateID);

  if (!templateID) {
    return <div>未提供模板 ID</div>;
  }

  const layouts = getLayoutsByTemplateID(templateID);
  const settings = getTemplateSetting(templateID);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {loading ? (
        <div>加载中...</div>
      ) : (
        <div>
          <div data-layouts={JSON.stringify(layouts)}>
            <pre>{JSON.stringify(layouts, null, 2)}</pre>\
          </div>
          <div data-settings={JSON.stringify(settings)}>
            <pre>{JSON.stringify(settings, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;

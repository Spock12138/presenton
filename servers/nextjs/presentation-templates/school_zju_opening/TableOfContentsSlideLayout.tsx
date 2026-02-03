import React from 'react'
import * as z from "zod";
import ZJULayoutWrapper from './ZJULayoutWrapper';

export const layoutId = 'zju-opening-toc-slide'
export const layoutName = 'ZJU Table of Contents'
export const layoutDescription = '浙江大学开题报告目录页，展示演讲/报告的章节结构。'

const ZJU_PRIMARY_COLOR = '#003F88'
const ZJU_ACCENT_COLOR = '#B5985A'

const tableOfContentsSlideSchema = z.object({
    title: z.string().min(2).max(60).default('目录').meta({
        description: "页面标题",
    }),
    subtitle: z.string().max(80).optional().default('CONTENTS').meta({
        description: "英文副标题（可选）",
    }),
    sections: z.array(z.object({
        number: z.string().min(1).max(5).meta({
            description: "章节编号",
        }),
        title: z.string().min(2).max(60).meta({
            description: "章节标题",
        }),
        description: z.string().max(100).optional().meta({
            description: "章节简要描述（可选）",
        }),
    })).min(3).max(6).default([
        { number: '01', title: '研究背景与意义', description: '课题来源与国内外研究现状' },
        { number: '02', title: '研究内容与目标', description: '主要研究问题与预期目标' },
        { number: '03', title: '研究方案与技术路线', description: '方法论与实施步骤' },
        { number: '04', title: '研究基础与条件', description: '已有工作与资源保障' },
        { number: '05', title: '进度安排与预期成果', description: '时间规划与成果形式' },
    ]).meta({
        description: "目录章节列表",
    }),
})

export const Schema = tableOfContentsSlideSchema

export type TableOfContentsSlideData = z.infer<typeof tableOfContentsSlideSchema>

interface TableOfContentsSlideLayoutProps {
    data?: Partial<TableOfContentsSlideData>
}

const TableOfContentsSlideLayout: React.FC<TableOfContentsSlideLayoutProps> = ({ data: slideData }) => {
    const sections = slideData?.sections || []

    return (
        <ZJULayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="mb-6">
                    <h1 
                        className="text-4xl sm:text-5xl font-bold mb-2"
                        style={{ color: ZJU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '目录'}
                    </h1>
                    {slideData?.subtitle && (
                        <p 
                            className="text-sm tracking-[0.3em] uppercase"
                            style={{ color: 'rgba(0, 63, 136, 0.5)' }}
                        >
                            {slideData.subtitle}
                        </p>
                    )}
                    <div 
                        className="w-20 h-1 mt-3"
                        style={{ backgroundColor: ZJU_ACCENT_COLOR }}
                    />
                </div>

                {/* 目录内容 */}
                <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-4">
                    {sections.map((section, index) => (
                        <div 
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:shadow-md group"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                border: `1px solid rgba(0, 63, 136, 0.1)`,
                            }}
                        >
                            {/* 编号 */}
                            <div 
                                className="text-3xl font-bold shrink-0 transition-colors duration-300"
                                style={{ 
                                    color: ZJU_ACCENT_COLOR,
                                    fontFamily: '"Times New Roman", serif',
                                }}
                            >
                                {section.number}
                            </div>
                            
                            {/* 内容 */}
                            <div className="flex-1 pt-1">
                                <h3 
                                    className="text-lg font-semibold mb-1 group-hover:text-opacity-100 transition-colors"
                                    style={{ color: ZJU_PRIMARY_COLOR }}
                                >
                                    {section.title}
                                </h3>
                                {section.description && (
                                    <p 
                                        className="text-sm"
                                        style={{ color: '#666666' }}
                                    >
                                        {section.description}
                                    </p>
                                )}
                            </div>

                            {/* 装饰箭头 */}
                            <div 
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ color: ZJU_ACCENT_COLOR }}
                            >
                                →
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ZJULayoutWrapper>
    )
}

export default TableOfContentsSlideLayout

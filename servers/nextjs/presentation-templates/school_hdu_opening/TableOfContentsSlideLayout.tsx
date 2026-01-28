import React from 'react'
import * as z from "zod";
import HDULayoutWrapper from './HDULayoutWrapper';

export const layoutId = 'hdu-opening-table-of-contents-slide'
export const layoutName = 'HDU Opening Report Contents'
export const layoutDescription = '杭州电子科技大学开题报告目录页，展示标准四章节结构。'

// 杭电品牌色
const HDU_PRIMARY_COLOR = '#003D7A'
const HDU_ACCENT_COLOR = '#C8102E'
const HDU_GOLD_ACCENT = '#D4A017'

// 开题报告标准四章节结构（硬编码）
const OPENING_REPORT_SECTIONS = [
    { 
        number: 1, 
        title: "选题背景与意义", 
        subtitle: "Introduction & Significance",
        icon: "📚"
    },
    { 
        number: 2, 
        title: "国内外研究现状", 
        subtitle: "Literature Review",
        icon: "🔬"
    },
    { 
        number: 3, 
        title: "研究内容与方法", 
        subtitle: "Methodology",
        icon: "⚡"
    },
    { 
        number: 4, 
        title: "进度安排与预期成果", 
        subtitle: "Timeline & Expected Results",
        icon: "📈"
    }
]

const tableOfContentsSlideSchema = z.object({
    title: z.string().min(1).max(40).default('目 录').meta({
        description: "目录页标题"
    }),
    englishTitle: z.string().max(60).optional().default('Contents').meta({
        description: "目录页英文标题（可选）"
    }),
    sections: z.array(z.object({
        number: z.number().min(1).meta({
            description: "章节序号"
        }),
        title: z.string().min(1).max(80).meta({
            description: "章节标题"
        }),
        subtitle: z.string().max(100).optional().meta({
            description: "章节英文副标题（可选）"
        }),
        icon: z.string().max(4).optional().meta({
            description: "章节图标（可选）"
        })
    })).default(OPENING_REPORT_SECTIONS).meta({
        description: "章节列表（默认为开题报告标准四章节）",
    }),
    pageNum: z.number().optional().meta({
        description: "页码",
    })
})

export const Schema = tableOfContentsSlideSchema

export type TableOfContentsSlideData = z.infer<typeof tableOfContentsSlideSchema>

interface TableOfContentsSlideLayoutProps {
    data?: Partial<TableOfContentsSlideData>
}

const TableOfContentsSlideLayout: React.FC<TableOfContentsSlideLayoutProps> = ({ data: slideData }) => {
    // 使用硬编码的开题报告标准章节
    const sections = OPENING_REPORT_SECTIONS

    return (
        <HDULayoutWrapper pageNum={slideData?.pageNum}>
            <div className="flex flex-col h-full px-4 sm:px-8 lg:px-12 py-2">
                {/* 标题区域 */}
                <div className="text-center mb-6">
                    <h1 
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.3em]"
                        style={{ color: HDU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '目 录'}
                    </h1>
                    <p 
                        className="text-sm mt-2 tracking-widest uppercase"
                        style={{ color: 'rgba(0, 61, 122, 0.6)' }}
                    >
                        {slideData?.englishTitle || 'Contents'}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <div 
                            className="w-16 h-0.5"
                            style={{ backgroundColor: HDU_PRIMARY_COLOR, opacity: 0.3 }}
                        />
                        <div 
                            className="w-3 h-3 rotate-45"
                            style={{ backgroundColor: HDU_ACCENT_COLOR }}
                        />
                        <div 
                            className="w-16 h-0.5"
                            style={{ backgroundColor: HDU_PRIMARY_COLOR, opacity: 0.3 }}
                        />
                    </div>
                </div>

                {/* 章节卡片网格 - 2x2 布局 */}
                <div className="flex-1 grid grid-cols-2 gap-5 lg:gap-6">
                    {sections.map((section, index) => (
                        <div 
                            key={index}
                            className="relative flex items-stretch rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group"
                            style={{
                                backgroundColor: '#FFFFFF',
                                border: `1px solid rgba(0, 61, 122, 0.12)`,
                                boxShadow: '0 2px 8px rgba(0, 61, 122, 0.08)',
                            }}
                        >
                            {/* 序号徽章 */}
                            <div 
                                className="flex flex-col items-center justify-center px-5 shrink-0 transition-colors duration-300"
                                style={{ 
                                    backgroundColor: HDU_PRIMARY_COLOR,
                                    minWidth: '72px',
                                }}
                            >
                                <span 
                                    className="text-3xl lg:text-4xl font-bold"
                                    style={{ color: '#FFFFFF' }}
                                >
                                    {String(section.number).padStart(2, '0')}
                                </span>
                                <span 
                                    className="text-lg mt-1"
                                    style={{ opacity: 0.8 }}
                                >
                                    {section.icon}
                                </span>
                            </div>

                            {/* 内容区 */}
                            <div className="flex-1 flex flex-col justify-center py-5 px-6">
                                <h3 
                                    className="text-xl lg:text-2xl font-bold leading-tight mb-2 group-hover:text-opacity-90 transition-colors"
                                    style={{ color: HDU_PRIMARY_COLOR }}
                                >
                                    {section.title}
                                </h3>
                                {section.subtitle && (
                                    <p 
                                        className="text-sm lg:text-base font-light tracking-wide"
                                        style={{ color: '#888888' }}
                                    >
                                        {section.subtitle}
                                    </p>
                                )}
                            </div>

                            {/* 右上角装饰 - 使用杭电红色 */}
                            <div 
                                className="absolute top-0 right-0"
                                style={{
                                    width: 0,
                                    height: 0,
                                    borderTop: `24px solid ${HDU_ACCENT_COLOR}`,
                                    borderLeft: '24px solid transparent',
                                    opacity: 0.5,
                                }}
                            />

                            {/* 底部装饰线（hover 时显示） */}
                            <div 
                                className="absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                                style={{ backgroundColor: HDU_ACCENT_COLOR }}
                            />
                        </div>
                    ))}
                </div>

                {/* 底部装饰 */}
                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-6 h-px"
                            style={{ backgroundColor: HDU_PRIMARY_COLOR, opacity: 0.4 }}
                        />
                        <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: HDU_ACCENT_COLOR }}
                        />
                        <span 
                            className="text-xs tracking-wider"
                            style={{ color: 'rgba(0, 61, 122, 0.5)' }}
                        >
                            HDU · 开题报告
                        </span>
                        <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: HDU_ACCENT_COLOR }}
                        />
                        <div 
                            className="w-6 h-px"
                            style={{ backgroundColor: HDU_PRIMARY_COLOR, opacity: 0.4 }}
                        />
                    </div>
                </div>
            </div>
        </HDULayoutWrapper>
    )
}

export default TableOfContentsSlideLayout

import React from 'react'
import * as z from "zod";
import HDULayoutWrapper from './HDULayoutWrapper';

export const layoutId = 'hdu-opening-numbered-bullets-slide'
export const layoutName = 'HDU Numbered Points'
export const layoutDescription = '杭电开题报告编号要点页面，适用于展示研究步骤、实验方法等有序内容。'

const HDU_PRIMARY_COLOR = '#003D7A'
const HDU_ACCENT_COLOR = '#C8102E'

const numberedBulletsSlideSchema = z.object({
    title: z.string().min(3).max(60).default('研究方法与步骤').meta({
        description: "页面主标题",
    }),
    subtitle: z.string().max(80).optional().default('Research Methodology').meta({
        description: "英文副标题（可选）",
    }),
    bulletPoints: z.array(z.object({
        title: z.string().min(2).max(80).meta({
            description: "要点标题",
        }),
        description: z.string().min(10).max(200).meta({
            description: "要点详细描述",
        }),
    })).min(1).max(4).default([
        {
            title: '文献调研与分析',
            description: '系统梳理国内外相关研究文献，总结现有方法的优势与不足，明确研究方向与创新点。'
        },
        {
            title: '理论模型构建',
            description: '基于文献分析结果，建立理论框架，设计算法模型，完成核心方法的数学推导与验证。'
        },
        {
            title: '实验设计与实施',
            description: '搭建实验环境，准备数据集，实施对比实验，验证所提方法的有效性与优越性。'
        }
    ]).meta({
        description: "编号要点列表（最多4条）",
    }),
    pageNum: z.number().optional().meta({
        description: "页码",
    })
})

export const Schema = numberedBulletsSlideSchema

export type NumberedBulletsSlideData = z.infer<typeof numberedBulletsSlideSchema>

interface NumberedBulletsSlideLayoutProps {
    data?: Partial<NumberedBulletsSlideData>
}

const NumberedBulletsSlideLayout: React.FC<NumberedBulletsSlideLayoutProps> = ({ data: slideData }) => {
    const bulletPoints = slideData?.bulletPoints || []

    return (
        <HDULayoutWrapper 
            title={slideData?.title}
            pageNum={slideData?.pageNum}
        >
            <div className="flex flex-col h-full">
                {/* Title Section */}
                <div className="mb-6">
                    <h1 
                        className="text-3xl sm:text-4xl font-bold mb-2"
                        style={{ color: HDU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究方法与步骤'}
                    </h1>
                    {slideData?.subtitle && (
                        <p 
                            className="text-sm tracking-wide"
                            style={{ color: 'rgba(0, 61, 122, 0.6)' }}
                        >
                            {slideData.subtitle}
                        </p>
                    )}
                    <div 
                        className="w-16 h-1 mt-2"
                        style={{ backgroundColor: HDU_ACCENT_COLOR }}
                    />
                </div>

                {/* Numbered Bullet Points */}
                <div className="flex-1 space-y-4 overflow-y-auto">
                    {bulletPoints.map((bullet, index) => (
                        <div 
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:shadow-md"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                border: `1px solid rgba(0, 61, 122, 0.15)`,
                            }}
                        >
                            {/* Number Badge */}
                            <div 
                                className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full text-xl font-bold"
                                style={{
                                    backgroundColor: HDU_PRIMARY_COLOR,
                                    color: '#FFFFFF',
                                }}
                            >
                                {index + 1}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <h3 
                                    className="text-lg sm:text-xl font-semibold mb-2"
                                    style={{ color: HDU_PRIMARY_COLOR }}
                                >
                                    {bullet.title}
                                </h3>
                                <p 
                                    className="text-sm sm:text-base leading-relaxed"
                                    style={{ color: '#555555' }}
                                >
                                    {bullet.description}
                                </p>
                            </div>

                            {/* Decorative corner - 使用杭电红色 */}
                            <div 
                                className="w-0 h-0 mt-1"
                                style={{
                                    borderTop: `8px solid ${HDU_ACCENT_COLOR}`,
                                    borderLeft: '8px solid transparent',
                                    opacity: 0.5,
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </HDULayoutWrapper>
    )
}

export default NumberedBulletsSlideLayout

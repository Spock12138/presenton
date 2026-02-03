import React from 'react'
import * as z from "zod";
import ZJULayoutWrapper from './ZJULayoutWrapper';

export const layoutId = 'zju-opening-numbered-bullets-slide'
export const layoutName = 'ZJU Numbered Points'
export const layoutDescription = '浙江大学开题报告编号要点页面，适用于展示研究步骤、实验方法等有序内容。'

const ZJU_PRIMARY_COLOR = '#003F88'
const ZJU_ACCENT_COLOR = '#B5985A'

const numberedBulletsSlideSchema = z.object({
    title: z.string().min(3).max(60).default('研究方案与技术路线').meta({
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
            title: '理论框架构建',
            description: '基于复杂系统理论与进化计算原理，建立面向高维多目标优化的理论模型框架。'
        },
        {
            title: '算法设计与改进',
            description: '提出自适应搜索策略与多尺度协同机制，设计高效的智能优化算法。'
        },
        {
            title: '实验验证与分析',
            description: '在标准测试函数和实际工程问题上进行系统实验，验证算法的有效性和优越性。'
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
        <ZJULayoutWrapper 
            title={slideData?.title}
            pageNum={slideData?.pageNum}
        >
            <div className="flex flex-col h-full">
                {/* Title Section */}
                <div className="mb-6">
                    <h1 
                        className="text-3xl sm:text-4xl font-bold mb-2"
                        style={{ color: ZJU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究方案与技术路线'}
                    </h1>
                    {slideData?.subtitle && (
                        <p 
                            className="text-sm tracking-wide"
                            style={{ color: 'rgba(0, 63, 136, 0.6)' }}
                        >
                            {slideData.subtitle}
                        </p>
                    )}
                    <div 
                        className="w-16 h-1 mt-2"
                        style={{ backgroundColor: ZJU_ACCENT_COLOR }}
                    />
                </div>

                {/* Numbered Bullet Points */}
                <div className="flex-1 space-y-4 overflow-y-auto">
                    {bulletPoints.map((bullet, index) => (
                        <div 
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:shadow-md"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                border: `1px solid rgba(0, 63, 136, 0.15)`,
                            }}
                        >
                            {/* Number Badge */}
                            <div 
                                className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full text-xl font-bold"
                                style={{
                                    backgroundColor: ZJU_PRIMARY_COLOR,
                                    color: '#FFFFFF',
                                }}
                            >
                                {index + 1}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <h3 
                                    className="text-lg sm:text-xl font-semibold mb-2"
                                    style={{ color: ZJU_PRIMARY_COLOR }}
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

                            {/* Decorative corner */}
                            <div 
                                className="w-0 h-0 mt-1"
                                style={{
                                    borderTop: `8px solid ${ZJU_ACCENT_COLOR}`,
                                    borderLeft: '8px solid transparent',
                                    opacity: 0.4,
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </ZJULayoutWrapper>
    )
}

export default NumberedBulletsSlideLayout

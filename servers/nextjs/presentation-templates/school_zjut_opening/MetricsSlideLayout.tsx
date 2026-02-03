import React from 'react'
import * as z from "zod";
import ZJUTLayoutWrapper from './ZJUTLayoutWrapper';

export const layoutId = 'zjut-opening-metrics-slide'
export const layoutName = 'ZJUT Metrics Slide'
export const layoutDescription = '浙江工业大学开题报告数据指标页，用于展示研究数据、实验指标或调研结果。'

// 浙工大品牌色
const ZJUT_PRIMARY_COLOR = '#1E4E79'
const ZJUT_GOLD_ACCENT = '#C9A227'

const metricsSlideSchema = z.object({
    title: z.string().min(3).max(100).default('研究数据与指标').meta({
        description: "页面标题",
    }),
    metrics: z.array(z.object({
        label: z.string().min(2).max(50).meta({
            description: "指标名称"
        }),
        value: z.string().min(1).max(15).meta({
            description: "指标数值（如：95.6%、1200+、3.2倍）"
        }),
        description: z.string().min(10).max(150).meta({
            description: "指标说明与解释"
        }),
    })).min(2).max(4).default([
        {
            value: '95.6%',
            label: '模型准确率',
            description: '在测试数据集上的分类准确率达到95.6%，超越现有基线方法。'
        },
        {
            value: '1200+',
            label: '样本数量',
            description: '收集并标注了超过1200个有效样本，涵盖多种典型场景。'
        },
        {
            value: '3.2倍',
            label: '效率提升',
            description: '相比传统方法，本方案处理效率提升3.2倍，满足实时性要求。'
        }
    ]).meta({
        description: "关键指标列表",
    })
})

export const Schema = metricsSlideSchema

export type MetricsSlideData = z.infer<typeof metricsSlideSchema>

interface MetricsSlideLayoutProps {
    data?: Partial<MetricsSlideData>
}

const MetricsSlideLayout: React.FC<MetricsSlideLayoutProps> = ({ data: slideData }) => {
    const metrics = slideData?.metrics || []

    // 根据指标数量决定布局
    const getGridCols = (count: number) => {
        if (count <= 2) return 'grid-cols-2'
        if (count === 3) return 'grid-cols-3'
        return 'grid-cols-2 lg:grid-cols-4'
    }

    return (
        <ZJUTLayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="text-center mb-8">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-3"
                        style={{ color: ZJUT_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究数据与指标'}
                    </h2>
                    <div 
                        className="w-24 h-1 mx-auto"
                        style={{ backgroundColor: ZJUT_GOLD_ACCENT }}
                    />
                </div>

                {/* 指标卡片区域 */}
                <div className={`flex-1 grid ${getGridCols(metrics.length)} gap-6 items-center`}>
                    {metrics.map((metric, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-lg p-6 shadow-md border-t-4 hover:shadow-lg transition-shadow"
                            style={{ borderTopColor: index % 2 === 0 ? ZJUT_PRIMARY_COLOR : ZJUT_GOLD_ACCENT }}
                        >
                            {/* 数值 */}
                            <div 
                                className="text-4xl sm:text-5xl font-bold mb-2"
                                style={{ color: ZJUT_PRIMARY_COLOR }}
                            >
                                {metric.value}
                            </div>
                            
                            {/* 标签 */}
                            <div 
                                className="text-lg font-semibold mb-3"
                                style={{ color: ZJUT_GOLD_ACCENT }}
                            >
                                {metric.label}
                            </div>
                            
                            {/* 描述 */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {metric.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </ZJUTLayoutWrapper>
    )
}

export default MetricsSlideLayout

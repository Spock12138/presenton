import React from 'react'
import * as z from "zod";
import HDULayoutWrapper from './HDULayoutWrapper';

export const layoutId = 'hdu-opening-metrics-slide'
export const layoutName = 'HDU Metrics Slide'
export const layoutDescription = '杭州电子科技大学开题报告数据指标页，用于展示研究数据、实验指标或调研结果。'

// 杭电品牌色
const HDU_PRIMARY_COLOR = '#003D7A'
const HDU_ACCENT_COLOR = '#C8102E'
const HDU_GOLD_ACCENT = '#D4A017'

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
            value: '97.3%',
            label: '检测准确率',
            description: '在公开安全数据集上的威胁检测准确率达到97.3%，显著优于基线方法。'
        },
        {
            value: '50万+',
            label: '训练样本',
            description: '收集并清洗50余万条网络流量样本，涵盖12种常见攻击类型。'
        },
        {
            value: '<10ms',
            label: '响应延迟',
            description: '单样本检测延迟低于10毫秒，满足实时在线检测需求。'
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

    const getAccentColor = (index: number) => {
        const colors = [HDU_PRIMARY_COLOR, HDU_ACCENT_COLOR, HDU_GOLD_ACCENT]
        return colors[index % colors.length]
    }

    return (
        <HDULayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="text-center mb-8">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-3"
                        style={{ color: HDU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究数据与指标'}
                    </h2>
                    <div 
                        className="w-24 h-1 mx-auto"
                        style={{ background: `linear-gradient(to right, ${HDU_PRIMARY_COLOR}, ${HDU_ACCENT_COLOR})` }}
                    />
                </div>

                {/* 指标卡片区域 */}
                <div className={`flex-1 grid ${getGridCols(metrics.length)} gap-6 items-center`}>
                    {metrics.map((metric, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-lg p-6 shadow-md border-t-4 hover:shadow-lg transition-shadow"
                            style={{ borderTopColor: getAccentColor(index) }}
                        >
                            {/* 数值 */}
                            <div 
                                className="text-4xl sm:text-5xl font-bold mb-2"
                                style={{ color: HDU_PRIMARY_COLOR }}
                            >
                                {metric.value}
                            </div>
                            
                            {/* 标签 */}
                            <div 
                                className="text-lg font-semibold mb-3"
                                style={{ color: getAccentColor(index) }}
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
        </HDULayoutWrapper>
    )
}

export default MetricsSlideLayout

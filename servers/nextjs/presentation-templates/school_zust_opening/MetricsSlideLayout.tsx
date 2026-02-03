import React from 'react'
import * as z from "zod";
import ZUSTLayoutWrapper from './ZUSTLayoutWrapper';

export const layoutId = 'zust-opening-metrics-slide'
export const layoutName = 'ZUST Metrics Slide'
export const layoutDescription = '浙江科技大学开题报告数据指标页，用于展示研究数据、实验指标或调研结果。'

// 浙科大品牌色
const ZUST_PRIMARY_COLOR = '#004B87'
const ZUST_ACCENT_COLOR = '#00A0E9'
const ZUST_ORANGE_ACCENT = '#FFB81C'

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
            value: '96.2%',
            label: '系统准确率',
            description: '智能识别模块在测试集上达到96.2%的准确率，超越行业基准。'
        },
        {
            value: '800+',
            label: '测试案例',
            description: '涵盖8类典型城市场景，覆盖日常管理中的主要应用需求。'
        },
        {
            value: '2.8倍',
            label: '效率提升',
            description: '相比传统方案，数据处理效率提升2.8倍，响应时间大幅缩短。'
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
        const colors = [ZUST_PRIMARY_COLOR, ZUST_ACCENT_COLOR, ZUST_ORANGE_ACCENT]
        return colors[index % colors.length]
    }

    return (
        <ZUSTLayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="text-center mb-8">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-3"
                        style={{ color: ZUST_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究数据与指标'}
                    </h2>
                    <div 
                        className="w-24 h-1 mx-auto"
                        style={{ background: `linear-gradient(to right, ${ZUST_ACCENT_COLOR}, ${ZUST_ORANGE_ACCENT})` }}
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
                                style={{ color: ZUST_PRIMARY_COLOR }}
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
        </ZUSTLayoutWrapper>
    )
}

export default MetricsSlideLayout

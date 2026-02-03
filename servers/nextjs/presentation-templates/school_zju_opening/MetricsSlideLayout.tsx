import React from 'react'
import * as z from "zod";
import ZJULayoutWrapper from './ZJULayoutWrapper';

export const layoutId = 'zju-opening-metrics-slide'
export const layoutName = 'ZJU Metrics Slide'
export const layoutDescription = '浙江大学开题报告数据指标页，用于展示研究数据、实验指标或调研结果。'

// 浙大品牌色
const ZJU_PRIMARY_COLOR = '#003F88'
const ZJU_ACCENT_COLOR = '#B5985A'

const metricsSlideSchema = z.object({
    title: z.string().min(3).max(100).default('研究基础与预期指标').meta({
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
            value: '15+',
            label: '已发表论文',
            description: '课题组在相关领域已发表SCI/EI论文15篇以上，具备扎实研究基础。'
        },
        {
            value: '3项',
            label: '在研项目',
            description: '承担国家自然科学基金面上项目3项，研究条件充足。'
        },
        {
            value: '20%↑',
            label: '预期性能提升',
            description: '预期在标准测试问题上相比现有最优方法提升20%以上。'
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
        <ZJULayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="text-center mb-8">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-3"
                        style={{ color: ZJU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究基础与预期指标'}
                    </h2>
                    <div 
                        className="w-24 h-1 mx-auto"
                        style={{ backgroundColor: ZJU_ACCENT_COLOR }}
                    />
                </div>

                {/* 指标卡片区域 */}
                <div className={`flex-1 grid ${getGridCols(metrics.length)} gap-6 items-center`}>
                    {metrics.map((metric, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-lg p-6 shadow-md border-t-4 hover:shadow-lg transition-shadow"
                            style={{ borderTopColor: index % 2 === 0 ? ZJU_PRIMARY_COLOR : ZJU_ACCENT_COLOR }}
                        >
                            {/* 数值 */}
                            <div 
                                className="text-4xl sm:text-5xl font-bold mb-2"
                                style={{ color: ZJU_PRIMARY_COLOR }}
                            >
                                {metric.value}
                            </div>
                            
                            {/* 标签 */}
                            <div 
                                className="text-lg font-semibold mb-3"
                                style={{ color: ZJU_ACCENT_COLOR }}
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
        </ZJULayoutWrapper>
    )
}

export default MetricsSlideLayout

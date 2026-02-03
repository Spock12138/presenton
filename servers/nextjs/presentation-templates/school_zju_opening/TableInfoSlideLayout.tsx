import React from 'react'
import * as z from "zod";
import ZJULayoutWrapper from './ZJULayoutWrapper';

export const layoutId = 'zju-opening-table-info-slide'
export const layoutName = 'ZJU Table Info Slide'
export const layoutDescription = '浙江大学开题报告表格页，适用于文献对比、方法比较、实验数据展示等。'

// 浙大品牌色
const ZJU_PRIMARY_COLOR = '#003F88'
const ZJU_ACCENT_COLOR = '#B5985A'

const tableInfoSlideSchema = z.object({
    title: z.string().min(3).max(60).default('相关工作对比').meta({
        description: "页面标题",
    }),
    tableData: z.object({
        headers: z.array(z.string().min(1).max(30)).min(2).max(5).meta({
            description: "表格列标题"
        }),
        rows: z.array(z.array(z.string().min(1).max(60))).min(2).max(6).meta({
            description: "表格数据行"
        })
    }).default({
        headers: ['算法', '收敛速度', '解的质量', '可扩展性', '适用范围'],
        rows: [
            ['遗传算法', '中等', '较好', '一般', '通用'],
            ['粒子群算法', '较快', '中等', '较好', '连续优化'],
            ['差分进化', '较快', '较好', '好', '数值优化'],
            ['本文方法', '快', '优秀', '优秀', '复杂系统']
        ]
    }).meta({
        description: "表格结构（标题行和数据行）"
    }),
    description: z.string().min(10).max(250).default('综合比较表明，本文提出的方法在收敛速度、解的质量和可扩展性方面均具有明显优势，尤其适用于复杂系统优化问题。').meta({
        description: "表格下方的说明文字",
    })
})

export const Schema = tableInfoSlideSchema

export type TableInfoSlideData = z.infer<typeof tableInfoSlideSchema>

interface TableInfoSlideLayoutProps {
    data?: Partial<TableInfoSlideData>
}

const TableInfoSlideLayout: React.FC<TableInfoSlideLayoutProps> = ({ data: slideData }) => {
    const tableHeaders = slideData?.tableData?.headers || ['算法', '收敛速度', '解的质量', '可扩展性', '适用范围']
    const tableRows = slideData?.tableData?.rows || [
        ['遗传算法', '中等', '较好', '一般', '通用'],
        ['粒子群算法', '较快', '中等', '较好', '连续优化'],
        ['差分进化', '较快', '较好', '好', '数值优化'],
        ['本文方法', '快', '优秀', '优秀', '复杂系统']
    ]

    return (
        <ZJULayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="text-center mb-6">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-3"
                        style={{ color: ZJU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '相关工作对比'}
                    </h2>
                    <div 
                        className="w-24 h-1 mx-auto"
                        style={{ backgroundColor: ZJU_ACCENT_COLOR }}
                    />
                </div>

                {/* 表格区域 */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                        {/* 表头 */}
                        <div 
                            className="grid gap-px"
                            style={{ 
                                gridTemplateColumns: `repeat(${tableHeaders.length}, 1fr)`,
                                backgroundColor: ZJU_PRIMARY_COLOR 
                            }}
                        >
                            {tableHeaders.map((header, index) => (
                                <div 
                                    key={index} 
                                    className="px-4 py-3 font-semibold text-center text-sm text-white"
                                >
                                    {header}
                                </div>
                            ))}
                        </div>

                        {/* 表格内容 */}
                        <div className="divide-y divide-gray-200">
                            {tableRows.map((row, rowIndex) => {
                                const isLastRow = rowIndex === tableRows.length - 1
                                return (
                                    <div
                                        key={rowIndex}
                                        className={`grid gap-px transition-colors duration-200 ${
                                            isLastRow 
                                                ? 'bg-amber-50 font-medium' 
                                                : rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                        style={{ 
                                            gridTemplateColumns: `repeat(${tableHeaders.length}, 1fr)`,
                                            borderLeft: isLastRow ? `4px solid ${ZJU_ACCENT_COLOR}` : 'none'
                                        }}
                                    >
                                        {row.slice(0, tableHeaders.length).map((cell, cellIndex) => (
                                            <div
                                                key={cellIndex}
                                                className={`px-4 py-3 text-center text-sm ${
                                                    cellIndex === 0 ? 'font-medium' : ''
                                                }`}
                                                style={{ 
                                                    color: isLastRow && cellIndex === 0 ? ZJU_PRIMARY_COLOR : '#374151'
                                                }}
                                            >
                                                {cell}
                                            </div>
                                        ))}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* 说明文字 */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 leading-relaxed max-w-4xl mx-auto">
                            {slideData?.description || '综合比较表明，本文提出的方法在收敛速度、解的质量和可扩展性方面均具有明显优势，尤其适用于复杂系统优化问题。'}
                        </p>
                    </div>
                </div>
            </div>
        </ZJULayoutWrapper>
    )
}

export default TableInfoSlideLayout

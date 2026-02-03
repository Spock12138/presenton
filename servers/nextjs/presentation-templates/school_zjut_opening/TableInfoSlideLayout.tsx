import React from 'react'
import * as z from "zod";
import ZJUTLayoutWrapper from './ZJUTLayoutWrapper';

export const layoutId = 'zjut-opening-table-info-slide'
export const layoutName = 'ZJUT Table Info Slide'
export const layoutDescription = '浙江工业大学开题报告表格页，适用于文献对比、方法比较、实验数据展示等。'

// 浙工大品牌色
const ZJUT_PRIMARY_COLOR = '#1E4E79'
const ZJUT_GOLD_ACCENT = '#C9A227'

const tableInfoSlideSchema = z.object({
    title: z.string().min(3).max(60).default('相关方法对比').meta({
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
        headers: ['方法名称', '准确率', '运行时间', '参数量', '特点'],
        rows: [
            ['传统方法A', '78.5%', '120ms', '1.2M', '简单但精度有限'],
            ['深度学习B', '89.2%', '85ms', '15M', '精度高但参数多'],
            ['轻量化C', '85.6%', '45ms', '3.5M', '速度快但泛化弱'],
            ['本文方法', '92.3%', '52ms', '5.2M', '兼顾精度与效率']
        ]
    }).meta({
        description: "表格结构（标题行和数据行）"
    }),
    description: z.string().min(10).max(250).default('通过对比分析可以看出，本文提出的方法在保持较低计算复杂度的同时，取得了最优的准确率表现，验证了所提方案的有效性。').meta({
        description: "表格下方的说明文字",
    })
})

export const Schema = tableInfoSlideSchema

export type TableInfoSlideData = z.infer<typeof tableInfoSlideSchema>

interface TableInfoSlideLayoutProps {
    data?: Partial<TableInfoSlideData>
}

const TableInfoSlideLayout: React.FC<TableInfoSlideLayoutProps> = ({ data: slideData }) => {
    const tableHeaders = slideData?.tableData?.headers || ['方法名称', '准确率', '运行时间', '参数量', '特点']
    const tableRows = slideData?.tableData?.rows || [
        ['传统方法A', '78.5%', '120ms', '1.2M', '简单但精度有限'],
        ['深度学习B', '89.2%', '85ms', '15M', '精度高但参数多'],
        ['轻量化C', '85.6%', '45ms', '3.5M', '速度快但泛化弱'],
        ['本文方法', '92.3%', '52ms', '5.2M', '兼顾精度与效率']
    ]

    return (
        <ZJUTLayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="text-center mb-6">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-3"
                        style={{ color: ZJUT_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '相关方法对比'}
                    </h2>
                    <div 
                        className="w-24 h-1 mx-auto"
                        style={{ backgroundColor: ZJUT_GOLD_ACCENT }}
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
                                backgroundColor: ZJUT_PRIMARY_COLOR 
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
                                            borderLeft: isLastRow ? `4px solid ${ZJUT_GOLD_ACCENT}` : 'none'
                                        }}
                                    >
                                        {row.slice(0, tableHeaders.length).map((cell, cellIndex) => (
                                            <div
                                                key={cellIndex}
                                                className={`px-4 py-3 text-center text-sm ${
                                                    cellIndex === 0 ? 'font-medium' : ''
                                                }`}
                                                style={{ 
                                                    color: isLastRow && cellIndex === 0 ? ZJUT_PRIMARY_COLOR : '#374151'
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
                            {slideData?.description || '通过对比分析可以看出，本文提出的方法在保持较低计算复杂度的同时，取得了最优的准确率表现，验证了所提方案的有效性。'}
                        </p>
                    </div>
                </div>
            </div>
        </ZJUTLayoutWrapper>
    )
}

export default TableInfoSlideLayout

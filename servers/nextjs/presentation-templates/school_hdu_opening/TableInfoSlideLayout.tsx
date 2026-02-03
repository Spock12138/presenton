import React from 'react'
import * as z from "zod";
import HDULayoutWrapper from './HDULayoutWrapper';

export const layoutId = 'hdu-opening-table-info-slide'
export const layoutName = 'HDU Table Info Slide'
export const layoutDescription = '杭州电子科技大学开题报告表格页，适用于文献对比、方法比较、实验数据展示等。'

// 杭电品牌色
const HDU_PRIMARY_COLOR = '#003D7A'
const HDU_ACCENT_COLOR = '#C8102E'
const HDU_GOLD_ACCENT = '#D4A017'

const tableInfoSlideSchema = z.object({
    title: z.string().min(3).max(60).default('检测方法对比').meta({
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
        headers: ['方法', '准确率', '召回率', 'F1分数', '检测延迟'],
        rows: [
            ['传统规则匹配', '82.3%', '71.5%', '0.765', '5ms'],
            ['随机森林', '89.1%', '85.2%', '0.871', '15ms'],
            ['标准LSTM', '93.5%', '90.8%', '0.921', '25ms'],
            ['本文方法', '97.3%', '95.6%', '0.964', '8ms']
        ]
    }).meta({
        description: "表格结构（标题行和数据行）"
    }),
    description: z.string().min(10).max(250).default('实验结果表明，本文提出的方法在保持低延迟的同时，各项检测指标均优于对比方法，验证了所提技术方案的有效性和先进性。').meta({
        description: "表格下方的说明文字",
    })
})

export const Schema = tableInfoSlideSchema

export type TableInfoSlideData = z.infer<typeof tableInfoSlideSchema>

interface TableInfoSlideLayoutProps {
    data?: Partial<TableInfoSlideData>
}

const TableInfoSlideLayout: React.FC<TableInfoSlideLayoutProps> = ({ data: slideData }) => {
    const tableHeaders = slideData?.tableData?.headers || ['方法', '准确率', '召回率', 'F1分数', '检测延迟']
    const tableRows = slideData?.tableData?.rows || [
        ['传统规则匹配', '82.3%', '71.5%', '0.765', '5ms'],
        ['随机森林', '89.1%', '85.2%', '0.871', '15ms'],
        ['标准LSTM', '93.5%', '90.8%', '0.921', '25ms'],
        ['本文方法', '97.3%', '95.6%', '0.964', '8ms']
    ]

    return (
        <HDULayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="text-center mb-6">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-3"
                        style={{ color: HDU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '检测方法对比'}
                    </h2>
                    <div 
                        className="w-24 h-1 mx-auto"
                        style={{ background: `linear-gradient(to right, ${HDU_PRIMARY_COLOR}, ${HDU_ACCENT_COLOR})` }}
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
                                background: `linear-gradient(135deg, ${HDU_PRIMARY_COLOR} 0%, ${HDU_PRIMARY_COLOR}dd 100%)`
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
                                                ? 'bg-red-50 font-medium' 
                                                : rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                        style={{ 
                                            gridTemplateColumns: `repeat(${tableHeaders.length}, 1fr)`,
                                            borderLeft: isLastRow ? `4px solid ${HDU_ACCENT_COLOR}` : 'none'
                                        }}
                                    >
                                        {row.slice(0, tableHeaders.length).map((cell, cellIndex) => (
                                            <div
                                                key={cellIndex}
                                                className={`px-4 py-3 text-center text-sm ${
                                                    cellIndex === 0 ? 'font-medium' : ''
                                                }`}
                                                style={{ 
                                                    color: isLastRow && cellIndex === 0 ? HDU_PRIMARY_COLOR : '#374151'
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
                            {slideData?.description || '实验结果表明，本文提出的方法在保持低延迟的同时，各项检测指标均优于对比方法，验证了所提技术方案的有效性和先进性。'}
                        </p>
                    </div>
                </div>
            </div>
        </HDULayoutWrapper>
    )
}

export default TableInfoSlideLayout

import React from 'react'
import * as z from "zod";
import ZUSTLayoutWrapper from './ZUSTLayoutWrapper';

export const layoutId = 'zust-opening-table-info-slide'
export const layoutName = 'ZUST Table Info Slide'
export const layoutDescription = '浙江科技大学开题报告表格页，适用于文献对比、方法比较、实验数据展示等。'

// 浙科大品牌色
const ZUST_PRIMARY_COLOR = '#004B87'
const ZUST_ACCENT_COLOR = '#00A0E9'
const ZUST_ORANGE_ACCENT = '#FFB81C'

const tableInfoSlideSchema = z.object({
    title: z.string().min(3).max(60).default('方案对比分析').meta({
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
        headers: ['方案名称', '覆盖范围', '响应时间', '准确率', '综合评价'],
        rows: [
            ['传统监控系统', '单一场景', '500ms', '75%', '基础功能'],
            ['云端AI平台', '多场景', '200ms', '88%', '延迟较高'],
            ['边缘计算方案', '受限场景', '50ms', '82%', '覆盖不足'],
            ['本文混合方案', '全场景', '80ms', '93%', '最优综合']
        ]
    }).meta({
        description: "表格结构（标题行和数据行）"
    }),
    description: z.string().min(10).max(250).default('通过综合对比分析，本文提出的混合架构方案在保证低延迟响应的同时，实现了更高的准确率和更广的场景覆盖，验证了技术路线的可行性。').meta({
        description: "表格下方的说明文字",
    })
})

export const Schema = tableInfoSlideSchema

export type TableInfoSlideData = z.infer<typeof tableInfoSlideSchema>

interface TableInfoSlideLayoutProps {
    data?: Partial<TableInfoSlideData>
}

const TableInfoSlideLayout: React.FC<TableInfoSlideLayoutProps> = ({ data: slideData }) => {
    const tableHeaders = slideData?.tableData?.headers || ['方案名称', '覆盖范围', '响应时间', '准确率', '综合评价']
    const tableRows = slideData?.tableData?.rows || [
        ['传统监控系统', '单一场景', '500ms', '75%', '基础功能'],
        ['云端AI平台', '多场景', '200ms', '88%', '延迟较高'],
        ['边缘计算方案', '受限场景', '50ms', '82%', '覆盖不足'],
        ['本文混合方案', '全场景', '80ms', '93%', '最优综合']
    ]

    return (
        <ZUSTLayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="text-center mb-6">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-3"
                        style={{ color: ZUST_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '方案对比分析'}
                    </h2>
                    <div 
                        className="w-24 h-1 mx-auto"
                        style={{ background: `linear-gradient(to right, ${ZUST_ACCENT_COLOR}, ${ZUST_ORANGE_ACCENT})` }}
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
                                background: `linear-gradient(135deg, ${ZUST_PRIMARY_COLOR} 0%, ${ZUST_ACCENT_COLOR} 100%)`
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
                                                ? 'bg-orange-50 font-medium' 
                                                : rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                        style={{ 
                                            gridTemplateColumns: `repeat(${tableHeaders.length}, 1fr)`,
                                            borderLeft: isLastRow ? `4px solid ${ZUST_ORANGE_ACCENT}` : 'none'
                                        }}
                                    >
                                        {row.slice(0, tableHeaders.length).map((cell, cellIndex) => (
                                            <div
                                                key={cellIndex}
                                                className={`px-4 py-3 text-center text-sm ${
                                                    cellIndex === 0 ? 'font-medium' : ''
                                                }`}
                                                style={{ 
                                                    color: isLastRow && cellIndex === 0 ? ZUST_PRIMARY_COLOR : '#374151'
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
                            {slideData?.description || '通过综合对比分析，本文提出的混合架构方案在保证低延迟响应的同时，实现了更高的准确率和更广的场景覆盖，验证了技术路线的可行性。'}
                        </p>
                    </div>
                </div>
            </div>
        </ZUSTLayoutWrapper>
    )
}

export default TableInfoSlideLayout

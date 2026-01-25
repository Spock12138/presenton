import React from 'react'
import * as z from "zod";
import SchoolLayoutWrapper from './SchoolLayoutWrapper';

export const layoutId = 'school-table-info-slide'
export const layoutName = 'School Table / Schedule'
export const layoutDescription = 'A formal academic table layout for thesis defense schedule, research timeline, or structured data presentation.'

const tableInfoSlideSchema = z.object({
    title: z.string().min(3).max(40).default('进度安排').meta({
        description: "Main title of the slide",
    }),
    tableData: z.object({
        headers: z.array(z.string().min(1).max(30)).min(2).max(5).meta({
            description: "Table column headers"
        }),
        rows: z.array(z.array(z.string().min(1).max(80))).min(2).max(8).meta({
            description: "Table rows data - each row should match the number of headers"
        })
    }).default({
        headers: ['阶段', '时间安排', '主要任务', '预期成果'],
        rows: [
            ['第一阶段', '2026.01 - 2026.03', '文献调研与理论学习', '完成文献综述报告'],
            ['第二阶段', '2026.03 - 2026.06', '研究方案设计与实验', '完成实验数据收集'],
            ['第三阶段', '2026.06 - 2026.09', '数据分析与论文撰写', '完成论文初稿'],
            ['第四阶段', '2026.09 - 2026.12', '论文修改与答辩准备', '完成论文终稿及答辩']
        ]
    }).meta({
        description: "Table structure with headers and rows"
    }),
    description: z.string().max(200).default('以上为本研究的整体进度安排，将根据实际情况进行适当调整，确保研究工作的顺利完成。').meta({
        description: "Optional descriptive text below the table",
    }),
    pageNum: z.number().optional().meta({
        description: "Page number for the slide",
    })
})

export const Schema = tableInfoSlideSchema

export type TableInfoSlideData = z.infer<typeof tableInfoSlideSchema>

interface TableInfoSlideLayoutProps {
    data?: Partial<TableInfoSlideData>
}

const PRIMARY_COLOR = '#003366'

const TableInfoSlideLayout: React.FC<TableInfoSlideLayoutProps> = ({ data: slideData }) => {
    const tableHeaders = slideData?.tableData?.headers || ['阶段', '时间安排', '主要任务', '预期成果']
    const tableRows = slideData?.tableData?.rows || [
        ['第一阶段', '2026.01 - 2026.03', '文献调研与理论学习', '完成文献综述报告'],
        ['第二阶段', '2026.03 - 2026.06', '研究方案设计与实验', '完成实验数据收集'],
        ['第三阶段', '2026.06 - 2026.09', '数据分析与论文撰写', '完成论文初稿'],
        ['第四阶段', '2026.09 - 2026.12', '论文修改与答辩准备', '完成论文终稿及答辩']
    ]

    return (
        <SchoolLayoutWrapper title={slideData?.title} pageNum={slideData?.pageNum}>
            <div className="flex flex-col h-full px-4 sm:px-8 lg:px-12 py-2">
                {/* Title Section */}
                <div className="text-center mb-4">
                    <h1 
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        {slideData?.title || '进度安排'}
                    </h1>
                    <div 
                        className="w-20 h-1 mx-auto mt-2"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    />
                </div>

                {/* Table Section */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-5xl">
                        <div 
                            className="rounded-lg overflow-hidden"
                            style={{
                                boxShadow: '0 2px 12px rgba(0, 51, 102, 0.15)',
                                border: `1px solid rgba(0, 51, 102, 0.2)`,
                            }}
                        >
                            {/* Table */}
                            <table className="w-full border-collapse">
                                {/* Table Header - 深蓝色背景，文字居中 */}
                                <thead>
                                    <tr style={{ backgroundColor: PRIMARY_COLOR }}>
                                        {tableHeaders.map((header, index) => (
                                            <th 
                                                key={index}
                                                className="px-4 py-3 text-center text-sm sm:text-base font-semibold"
                                                style={{ 
                                                    color: '#FFFFFF',
                                                    borderRight: index < tableHeaders.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                                }}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody>
                                    {tableRows.map((row, rowIndex) => (
                                        <tr 
                                            key={rowIndex}
                                            style={{
                                                backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc',
                                                borderBottom: rowIndex < tableRows.length - 1 ? '1px solid #e5e7eb' : 'none',
                                            }}
                                        >
                                            {row.slice(0, tableHeaders.length).map((cell, cellIndex) => (
                                                <td
                                                    key={cellIndex}
                                                    className="px-4 py-3 text-center text-sm sm:text-base"
                                                    style={{
                                                        color: cellIndex === 0 ? PRIMARY_COLOR : '#333333',
                                                        fontWeight: cellIndex === 0 ? 600 : 400,
                                                        borderRight: cellIndex < tableHeaders.length - 1 ? '1px solid #e5e7eb' : 'none',
                                                    }}
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                {slideData?.description && (
                    <div className="text-center mt-4">
                        <p 
                            className="text-sm sm:text-base leading-relaxed max-w-4xl mx-auto"
                            style={{ color: '#555555' }}
                        >
                            {slideData.description}
                        </p>
                    </div>
                )}
            </div>
        </SchoolLayoutWrapper>
    )
}

export default TableInfoSlideLayout

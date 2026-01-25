import React from 'react'
import * as z from "zod";
import SchoolLayoutWrapper from './SchoolLayoutWrapper';

export const layoutId = 'school-table-of-contents-slide'
export const layoutName = 'School Table of Contents'
export const layoutDescription = 'A formal academic table of contents layout for thesis defense presentations with structured chapter sections.'

const tableOfContentsSlideSchema = z.object({
    title: z.string().min(1).max(40).default('目 录').meta({
        description: "Title of the table of contents slide"
    }),
    sections: z.array(z.object({
        number: z.number().min(1).meta({
            description: "Section number"
        }),
        title: z.string().min(1).max(80).meta({
            description: "Section title"
        }),
        subtitle: z.string().max(100).optional().meta({
            description: "Optional subtitle or description"
        })
    })).default([
        { number: 1, title: "研究背景及研究意义", subtitle: "Research Background and Significance" },
        { number: 2, title: "国内外研究现状", subtitle: "Literature Review" },
        { number: 3, title: "研究内容及创新点", subtitle: "Research Content and Innovation" },
        { number: 4, title: "预期结果与进度安排", subtitle: "Expected Results and Schedule" }
    ]).meta({
        description: "List of thesis chapters/sections",
    }),
    pageNum: z.number().optional().meta({
        description: "Page number for the slide",
    })
})

export const Schema = tableOfContentsSlideSchema

export type TableOfContentsSlideData = z.infer<typeof tableOfContentsSlideSchema>

interface TableOfContentsSlideLayoutProps {
    data?: Partial<TableOfContentsSlideData>
}

const PRIMARY_COLOR = '#003366'
const ACCENT_COLOR = '#004d99'

const TableOfContentsSlideLayout: React.FC<TableOfContentsSlideLayoutProps> = ({ data: slideData }) => {
    const sections = slideData?.sections || [
        { number: 1, title: "研究背景及研究意义", subtitle: "Research Background and Significance" },
        { number: 2, title: "国内外研究现状", subtitle: "Literature Review" },
        { number: 3, title: "研究内容及创新点", subtitle: "Research Content and Innovation" },
        { number: 4, title: "预期结果与进度安排", subtitle: "Expected Results and Schedule" }
    ]

    return (
        <SchoolLayoutWrapper pageNum={slideData?.pageNum}>
            <div className="flex flex-col h-full px-4 sm:px-8 lg:px-12 py-4">
                {/* Title Section */}
                <div className="text-center mb-6">
                    <h1 
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-widest"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        {slideData?.title || '目 录'}
                    </h1>
                    <div 
                        className="w-24 h-1 mx-auto mt-3"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    />
                </div>

                {/* Sections Grid - 2x2 for 4 standard chapters */}
                <div className="flex-1 grid grid-cols-2 gap-4 lg:gap-6">
                    {sections.map((section, index) => (
                        <div 
                            key={index}
                            className="relative flex items-stretch rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
                            style={{
                                backgroundColor: 'rgba(0, 51, 102, 0.03)',
                                border: `1px solid rgba(0, 51, 102, 0.15)`,
                            }}
                        >
                            {/* Number Badge */}
                            <div 
                                className="flex items-center justify-center px-5 shrink-0"
                                style={{ 
                                    backgroundColor: PRIMARY_COLOR,
                                    minWidth: '60px',
                                }}
                            >
                                <span 
                                    className="text-2xl lg:text-3xl font-bold"
                                    style={{ color: '#FFFFFF' }}
                                >
                                    {String(section.number).padStart(2, '0')}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-center py-4 px-5">
                                <h3 
                                    className="text-lg lg:text-xl font-semibold leading-tight mb-1"
                                    style={{ color: PRIMARY_COLOR }}
                                >
                                    {section.title}
                                </h3>
                                {section.subtitle && (
                                    <p 
                                        className="text-xs lg:text-sm"
                                        style={{ color: '#666666' }}
                                    >
                                        {section.subtitle}
                                    </p>
                                )}
                            </div>

                            {/* Decorative Corner */}
                            <div 
                                className="absolute top-0 right-0 w-0 h-0"
                                style={{
                                    borderTop: `16px solid ${PRIMARY_COLOR}`,
                                    borderLeft: '16px solid transparent',
                                    opacity: 0.3,
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom Decorative Element */}
                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-8 h-px"
                            style={{ backgroundColor: PRIMARY_COLOR, opacity: 0.5 }}
                        />
                        <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: PRIMARY_COLOR, opacity: 0.5 }}
                        />
                        <div 
                            className="w-8 h-px"
                            style={{ backgroundColor: PRIMARY_COLOR, opacity: 0.5 }}
                        />
                    </div>
                </div>
            </div>
        </SchoolLayoutWrapper>
    )
}

export default TableOfContentsSlideLayout

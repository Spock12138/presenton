import React from 'react'
import * as z from "zod";
import SchoolLayoutWrapper from './SchoolLayoutWrapper';

export const layoutId = 'school-quote-slide'
export const layoutName = 'School Quote / Literature Review'
export const layoutDescription = 'A formal academic slide for displaying literature review summaries, key citations, or research conclusions with a centered block quote style.'

const quoteSlideSchema = z.object({
    title: z.string().min(3).max(60).default('文献综述').meta({
        description: "Main heading of the slide",
    }),
    quote: z.string().min(10).max(400).default('现有研究表明，该领域的核心问题在于缺乏系统性的理论框架和实证数据支撑。国内外学者虽已从不同角度进行了探索，但研究深度和广度仍有待提升，特别是在跨学科融合方面存在明显不足。').meta({
        description: "The main quote or literature review summary text",
    }),
    source: z.string().min(2).max(100).default('——综合国内外相关研究').meta({
        description: "Source or author of the quote/summary",
    }),
    highlights: z.array(z.object({
        label: z.string().min(1).max(20).meta({
            description: "Highlight label"
        }),
        value: z.string().min(1).max(30).meta({
            description: "Highlight value or statistic"
        })
    })).max(3).default([
        { label: "相关文献", value: "120+ 篇" },
        { label: "研究周期", value: "2010-2025" },
        { label: "核心期刊", value: "45 篇" }
    ]).meta({
        description: "Optional highlight statistics or key points"
    }),
    pageNum: z.number().optional().meta({
        description: "Page number for the slide",
    })
})

export const Schema = quoteSlideSchema

export type QuoteSlideData = z.infer<typeof quoteSlideSchema>

interface QuoteSlideLayoutProps {
    data?: Partial<QuoteSlideData>
}

const PRIMARY_COLOR = '#003366'

const QuoteSlideLayout: React.FC<QuoteSlideLayoutProps> = ({ data: slideData }) => {
    const highlights = slideData?.highlights || [
        { label: "相关文献", value: "120+ 篇" },
        { label: "研究周期", value: "2010-2025" },
        { label: "核心期刊", value: "45 篇" }
    ]

    return (
        <SchoolLayoutWrapper title={slideData?.title} pageNum={slideData?.pageNum}>
            <div className="flex flex-col h-full px-4 sm:px-8 lg:px-12 py-4">
                {/* Title Section */}
                <div className="text-center mb-4">
                    <h1 
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        {slideData?.title || '文献综述'}
                    </h1>
                    <div 
                        className="w-20 h-1 mx-auto mt-2"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    />
                </div>

                {/* Main Quote Block - Academic Style */}
                <div className="flex-1 flex items-center justify-center">
                    <div 
                        className="w-full max-w-4xl mx-auto rounded-lg relative"
                        style={{
                            backgroundColor: '#f5f7fa',
                            border: `1px solid rgba(0, 51, 102, 0.15)`,
                            padding: '32px 40px',
                        }}
                    >
                        {/* Quote Icon - Left */}
                        <div 
                            className="absolute -top-4 left-6"
                            style={{ color: PRIMARY_COLOR, opacity: 0.3 }}
                        >
                            <svg 
                                width="48" 
                                height="48" 
                                viewBox="0 0 24 24" 
                                fill="currentColor"
                            >
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                        </div>

                        {/* Left Border Accent */}
                        <div 
                            className="absolute left-0 top-8 bottom-8 w-1 rounded-full"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                        />

                        {/* Quote Text */}
                        <blockquote 
                            className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-center px-4"
                            style={{ 
                                color: '#333333',
                                fontStyle: 'normal',
                                lineHeight: '1.8',
                            }}
                        >
                            {slideData?.quote || '现有研究表明，该领域的核心问题在于缺乏系统性的理论框架和实证数据支撑。国内外学者虽已从不同角度进行了探索，但研究深度和广度仍有待提升，特别是在跨学科融合方面存在明显不足。'}
                        </blockquote>

                        {/* Source */}
                        <div className="mt-6 text-right pr-4">
                            <cite 
                                className="text-base not-italic font-medium"
                                style={{ color: PRIMARY_COLOR }}
                            >
                                {slideData?.source || '——综合国内外相关研究'}
                            </cite>
                        </div>

                        {/* Quote Icon - Right */}
                        <div 
                            className="absolute -bottom-4 right-6 transform rotate-180"
                            style={{ color: PRIMARY_COLOR, opacity: 0.3 }}
                        >
                            <svg 
                                width="48" 
                                height="48" 
                                viewBox="0 0 24 24" 
                                fill="currentColor"
                            >
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Highlights / Statistics Row */}
                {highlights.length > 0 && (
                    <div className="flex justify-center gap-8 lg:gap-16 mt-4">
                        {highlights.map((item, index) => (
                            <div 
                                key={index}
                                className="text-center px-4 py-2 rounded"
                                style={{
                                    backgroundColor: 'rgba(0, 51, 102, 0.05)',
                                    border: `1px solid rgba(0, 51, 102, 0.1)`,
                                }}
                            >
                                <div 
                                    className="text-xl lg:text-2xl font-bold"
                                    style={{ color: PRIMARY_COLOR }}
                                >
                                    {item.value}
                                </div>
                                <div 
                                    className="text-xs lg:text-sm mt-1"
                                    style={{ color: '#666666' }}
                                >
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SchoolLayoutWrapper>
    )
}

export default QuoteSlideLayout

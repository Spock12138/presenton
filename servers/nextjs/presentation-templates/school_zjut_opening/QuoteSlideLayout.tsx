import React from 'react'
import * as z from "zod";
import ZJUTLayoutWrapper from './ZJUTLayoutWrapper';

export const layoutId = 'zjut-opening-quote-slide'
export const layoutName = 'ZJUT Quote Slide'
export const layoutDescription = '浙工大引用页面，适用于展示研究意义、专家观点或重要理论引用。'

const ZJUT_PRIMARY_COLOR = '#1E4E79'
const ZJUT_GOLD_ACCENT = '#C9A227'

const quoteSlideSchema = z.object({
    quote: z.string().min(10).max(300).default('创新是引领发展的第一动力，抓创新就是抓发展，谋创新就是谋未来。').meta({
        description: "引用文字内容",
    }),
    author: z.string().max(100).optional().default('习近平').meta({
        description: "引用来源或作者（可选）",
    }),
    context: z.string().max(150).optional().default('在全国科技创新大会上的讲话').meta({
        description: "引用出处或背景说明（可选）",
    }),
    pageNum: z.number().optional().meta({
        description: "页码",
    })
})

export const Schema = quoteSlideSchema

export type QuoteSlideData = z.infer<typeof quoteSlideSchema>

interface QuoteSlideLayoutProps {
    data?: Partial<QuoteSlideData>
}

const QuoteSlideLayout: React.FC<QuoteSlideLayoutProps> = ({ data: slideData }) => {
    return (
        <ZJUTLayoutWrapper pageNum={slideData?.pageNum}>
            <div className="flex flex-col items-center justify-center h-full px-8 sm:px-16">
                {/* Decorative top quote mark */}
                <div 
                    className="text-8xl leading-none mb-4"
                    style={{ 
                        color: ZJUT_GOLD_ACCENT,
                        opacity: 0.3,
                        fontFamily: 'Georgia, serif',
                    }}
                >
                    "
                </div>

                {/* Quote Content */}
                <blockquote className="text-center max-w-4xl">
                    <p 
                        className="text-2xl sm:text-3xl lg:text-4xl font-medium leading-relaxed mb-8"
                        style={{ 
                            color: ZJUT_PRIMARY_COLOR,
                            fontStyle: 'italic',
                        }}
                    >
                        {slideData?.quote || '创新是引领发展的第一动力，抓创新就是抓发展，谋创新就是谋未来。'}
                    </p>
                </blockquote>

                {/* Decorative divider */}
                <div className="flex items-center gap-3 mb-6">
                    <div 
                        className="w-12 h-px"
                        style={{ backgroundColor: ZJUT_GOLD_ACCENT }}
                    />
                    <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: ZJUT_GOLD_ACCENT }}
                    />
                    <div 
                        className="w-12 h-px"
                        style={{ backgroundColor: ZJUT_GOLD_ACCENT }}
                    />
                </div>

                {/* Author & Context */}
                <div className="text-center">
                    {slideData?.author && (
                        <p 
                            className="text-lg sm:text-xl font-semibold mb-1"
                            style={{ color: ZJUT_PRIMARY_COLOR }}
                        >
                            — {slideData.author}
                        </p>
                    )}
                    {slideData?.context && (
                        <p 
                            className="text-sm sm:text-base"
                            style={{ color: 'rgba(30, 78, 121, 0.7)' }}
                        >
                            {slideData.context}
                        </p>
                    )}
                </div>

                {/* Decorative bottom quote mark */}
                <div 
                    className="text-8xl leading-none mt-4"
                    style={{ 
                        color: ZJUT_GOLD_ACCENT,
                        opacity: 0.3,
                        fontFamily: 'Georgia, serif',
                        transform: 'rotate(180deg)',
                    }}
                >
                    "
                </div>
            </div>
        </ZJUTLayoutWrapper>
    )
}

export default QuoteSlideLayout

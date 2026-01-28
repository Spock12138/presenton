import React from 'react'
import * as z from "zod";
import HDULayoutWrapper from './HDULayoutWrapper';

export const layoutId = 'hdu-opening-quote-slide'
export const layoutName = 'HDU Quote Slide'
export const layoutDescription = '杭电引用页面，适用于展示研究意义、专家观点或重要理论引用。'

const HDU_PRIMARY_COLOR = '#003D7A'
const HDU_ACCENT_COLOR = '#C8102E'
const HDU_GOLD_ACCENT = '#D4A017'

const quoteSlideSchema = z.object({
    quote: z.string().min(10).max(300).default('科技是国家强盛之基，创新是民族进步之魂。').meta({
        description: "引用文字内容",
    }),
    author: z.string().max(100).optional().default('习近平').meta({
        description: "引用来源或作者（可选）",
    }),
    context: z.string().max(150).optional().default('在中国科学院第十九次院士大会上的讲话').meta({
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
        <HDULayoutWrapper pageNum={slideData?.pageNum}>
            <div className="flex flex-col items-center justify-center h-full px-8 sm:px-16">
                {/* Decorative top quote mark */}
                <div 
                    className="text-8xl leading-none mb-4"
                    style={{ 
                        color: HDU_ACCENT_COLOR,
                        opacity: 0.25,
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
                            color: HDU_PRIMARY_COLOR,
                            fontStyle: 'italic',
                        }}
                    >
                        {slideData?.quote || '科技是国家强盛之基，创新是民族进步之魂。'}
                    </p>
                </blockquote>

                {/* Decorative divider */}
                <div className="flex items-center gap-3 mb-6">
                    <div 
                        className="w-12 h-px"
                        style={{ backgroundColor: HDU_ACCENT_COLOR }}
                    />
                    <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: HDU_GOLD_ACCENT }}
                    />
                    <div 
                        className="w-12 h-px"
                        style={{ backgroundColor: HDU_ACCENT_COLOR }}
                    />
                </div>

                {/* Author & Context */}
                <div className="text-center">
                    {slideData?.author && (
                        <p 
                            className="text-lg sm:text-xl font-semibold mb-1"
                            style={{ color: HDU_PRIMARY_COLOR }}
                        >
                            — {slideData.author}
                        </p>
                    )}
                    {slideData?.context && (
                        <p 
                            className="text-sm sm:text-base"
                            style={{ color: 'rgba(0, 61, 122, 0.7)' }}
                        >
                            {slideData.context}
                        </p>
                    )}
                </div>

                {/* Decorative bottom quote mark */}
                <div 
                    className="text-8xl leading-none mt-4"
                    style={{ 
                        color: HDU_ACCENT_COLOR,
                        opacity: 0.25,
                        fontFamily: 'Georgia, serif',
                        transform: 'rotate(180deg)',
                    }}
                >
                    "
                </div>
            </div>
        </HDULayoutWrapper>
    )
}

export default QuoteSlideLayout

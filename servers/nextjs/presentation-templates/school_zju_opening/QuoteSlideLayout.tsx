import React from 'react'
import * as z from "zod";
import ZJULayoutWrapper from './ZJULayoutWrapper';

export const layoutId = 'zju-opening-quote-slide'
export const layoutName = 'ZJU Quote Slide'
export const layoutDescription = '浙江大学开题报告引用/结语页面，用于展示重要引言、研究宗旨或总结展望。'

const ZJU_PRIMARY_COLOR = '#003F88'
const ZJU_ACCENT_COLOR = '#B5985A'

const quoteSlideSchema = z.object({
    quote: z.string().min(10).max(300).default('求是创新，追求卓越。以科学方法探索真理，以创新精神服务社会。').meta({
        description: "引用或结语文本",
    }),
    author: z.string().max(50).optional().default('').meta({
        description: "引用来源或作者（可选）",
    }),
    context: z.string().max(100).optional().default('').meta({
        description: "背景说明（可选）",
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
        <ZJULayoutWrapper pageNum={slideData?.pageNum}>
            <div className="h-full flex flex-col items-center justify-center px-8">
                {/* 装饰性引号 - 开始 */}
                <div 
                    className="text-8xl font-serif leading-none mb-4"
                    style={{ 
                        color: ZJU_ACCENT_COLOR,
                        opacity: 0.3,
                        fontFamily: 'Georgia, serif',
                    }}
                >
                    "
                </div>

                {/* 引用文本 */}
                <blockquote 
                    className="text-2xl sm:text-3xl lg:text-4xl text-center font-medium leading-relaxed max-w-4xl"
                    style={{ 
                        color: ZJU_PRIMARY_COLOR,
                        fontFamily: '"Source Han Serif SC", "SimSun", serif',
                    }}
                >
                    {slideData?.quote || '求是创新，追求卓越。以科学方法探索真理，以创新精神服务社会。'}
                </blockquote>

                {/* 装饰性引号 - 结束 */}
                <div 
                    className="text-8xl font-serif leading-none mt-4"
                    style={{ 
                        color: ZJU_ACCENT_COLOR,
                        opacity: 0.3,
                        fontFamily: 'Georgia, serif',
                    }}
                >
                    "
                </div>

                {/* 装饰分割线 */}
                <div 
                    className="w-24 h-1 my-6"
                    style={{ backgroundColor: ZJU_ACCENT_COLOR }}
                />

                {/* 作者与背景 */}
                {(slideData?.author || slideData?.context) && (
                    <div className="text-center">
                        {slideData?.author && (
                            <p 
                                className="text-lg font-semibold mb-1"
                                style={{ color: ZJU_PRIMARY_COLOR }}
                            >
                                —— {slideData.author}
                            </p>
                        )}
                        {slideData?.context && (
                            <p 
                                className="text-sm"
                                style={{ color: '#666666' }}
                            >
                                {slideData.context}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </ZJULayoutWrapper>
    )
}

export default QuoteSlideLayout

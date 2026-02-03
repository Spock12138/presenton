import React from 'react'
import * as z from "zod";
import HDULayoutWrapper from './HDULayoutWrapper';
import { ImageSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'hdu-opening-basic-info-slide'
export const layoutName = 'HDU Basic Info Slide'
export const layoutDescription = '杭州电子科技大学开题报告基础信息页，适用于研究背景、研究意义、应用场景等内容展示。'

// 杭电品牌色
const HDU_PRIMARY_COLOR = '#003D7A'
const HDU_ACCENT_COLOR = '#C8102E'
const HDU_GOLD_ACCENT = '#D4A017'

const basicInfoSlideSchema = z.object({
    title: z.string().min(3).max(60).default('研究背景').meta({
        description: "页面标题",
    }),
    description: z.string().min(20).max(400).default('随着网络安全形势日益严峻，传统的安全防护手段已难以应对复杂多变的威胁环境。基于机器学习的智能威胁检测技术成为研究热点，但在实时性、准确性和可解释性方面仍存在改进空间。本研究旨在构建高效、可靠的安全防护体系。').meta({
        description: "详细描述文本",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: '网络安全与数据保护'
    }).meta({
        description: "配图",
    })
})

export const Schema = basicInfoSlideSchema

export type BasicInfoSlideData = z.infer<typeof basicInfoSlideSchema>

interface BasicInfoSlideLayoutProps {
    data?: Partial<BasicInfoSlideData>
}

const BasicInfoSlideLayout: React.FC<BasicInfoSlideLayoutProps> = ({ data: slideData }) => {
    return (
        <HDULayoutWrapper title={slideData?.title}>
            <div className="h-full flex gap-10 items-center">
                {/* 左侧图片区域 */}
                <div className="w-2/5 flex items-center justify-center">
                    <div 
                        className="relative w-full max-w-sm"
                    >
                        {/* 装饰性背景框 */}
                        <div 
                            className="absolute -top-3 -left-3 w-full h-full rounded-lg"
                            style={{ backgroundColor: `${HDU_ACCENT_COLOR}20` }}
                        />
                        <div 
                            className="absolute -bottom-3 -right-3 w-full h-full rounded-lg border-2"
                            style={{ borderColor: HDU_PRIMARY_COLOR }}
                        />
                        
                        {/* 主图片 */}
                        <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                            <img
                                src={slideData?.image?.__image_url__ || ''}
                                alt={slideData?.image?.__image_prompt__ || slideData?.title || ''}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* 右侧内容区域 */}
                <div className="w-3/5 flex flex-col justify-center">
                    {/* 标题 */}
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-4"
                        style={{ color: HDU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究背景'}
                    </h2>
                    
                    {/* 装饰线 */}
                    <div 
                        className="w-20 h-1 mb-6"
                        style={{ background: `linear-gradient(to right, ${HDU_PRIMARY_COLOR}, ${HDU_ACCENT_COLOR})` }}
                    />
                    
                    {/* 描述文本 */}
                    <div 
                        className="text-base leading-relaxed text-gray-700 space-y-4"
                        style={{ textAlign: 'justify' }}
                    >
                        {(slideData?.description || '随着网络安全形势日益严峻，传统的安全防护手段已难以应对复杂多变的威胁环境。基于机器学习的智能威胁检测技术成为研究热点，但在实时性、准确性和可解释性方面仍存在改进空间。本研究旨在构建高效、可靠的安全防护体系。')
                            .split('。')
                            .filter(s => s.trim())
                            .map((sentence, index) => (
                                <p key={index} className="flex items-start">
                                    <span 
                                        className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                        style={{ backgroundColor: HDU_ACCENT_COLOR }}
                                    />
                                    <span>{sentence}。</span>
                                </p>
                            ))
                        }
                    </div>
                </div>
            </div>
        </HDULayoutWrapper>
    )
}

export default BasicInfoSlideLayout

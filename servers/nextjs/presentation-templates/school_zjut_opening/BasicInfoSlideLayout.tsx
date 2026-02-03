import React from 'react'
import * as z from "zod";
import ZJUTLayoutWrapper from './ZJUTLayoutWrapper';
import { ImageSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'zjut-opening-basic-info-slide'
export const layoutName = 'ZJUT Basic Info Slide'
export const layoutDescription = '浙江工业大学开题报告基础信息页，适用于研究背景、研究意义、应用场景等内容展示。'

// 浙工大品牌色
const ZJUT_PRIMARY_COLOR = '#1E4E79'
const ZJUT_GOLD_ACCENT = '#C9A227'

const basicInfoSlideSchema = z.object({
    title: z.string().min(3).max(60).default('研究背景').meta({
        description: "页面标题",
    }),
    description: z.string().min(20).max(400).default('随着人工智能技术的快速发展，深度学习在计算机视觉、自然语言处理等领域取得了突破性进展。然而，现有方法在面对复杂场景时仍存在诸多挑战，如模型泛化能力不足、计算资源消耗大等问题。本研究旨在探索更高效、更鲁棒的解决方案，推动相关技术的实际应用。').meta({
        description: "详细描述文本",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: '人工智能与科技研究背景'
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
        <ZJUTLayoutWrapper title={slideData?.title}>
            <div className="h-full flex gap-10 items-center">
                {/* 左侧图片区域 */}
                <div className="w-2/5 flex items-center justify-center">
                    <div 
                        className="relative w-full max-w-sm"
                    >
                        {/* 装饰性背景框 */}
                        <div 
                            className="absolute -top-3 -left-3 w-full h-full rounded-lg"
                            style={{ backgroundColor: `${ZJUT_GOLD_ACCENT}30` }}
                        />
                        <div 
                            className="absolute -bottom-3 -right-3 w-full h-full rounded-lg border-2"
                            style={{ borderColor: ZJUT_PRIMARY_COLOR }}
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
                        style={{ color: ZJUT_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究背景'}
                    </h2>
                    
                    {/* 装饰线 */}
                    <div 
                        className="w-20 h-1 mb-6"
                        style={{ backgroundColor: ZJUT_GOLD_ACCENT }}
                    />
                    
                    {/* 描述文本 */}
                    <div 
                        className="text-base leading-relaxed text-gray-700 space-y-4"
                        style={{ textAlign: 'justify' }}
                    >
                        {(slideData?.description || '随着人工智能技术的快速发展，深度学习在计算机视觉、自然语言处理等领域取得了突破性进展。然而，现有方法在面对复杂场景时仍存在诸多挑战，如模型泛化能力不足、计算资源消耗大等问题。本研究旨在探索更高效、更鲁棒的解决方案，推动相关技术的实际应用。')
                            .split('。')
                            .filter(s => s.trim())
                            .map((sentence, index) => (
                                <p key={index} className="flex items-start">
                                    <span 
                                        className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                        style={{ backgroundColor: ZJUT_GOLD_ACCENT }}
                                    />
                                    <span>{sentence}。</span>
                                </p>
                            ))
                        }
                    </div>
                </div>
            </div>
        </ZJUTLayoutWrapper>
    )
}

export default BasicInfoSlideLayout

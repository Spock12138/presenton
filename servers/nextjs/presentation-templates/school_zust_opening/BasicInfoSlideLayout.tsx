import React from 'react'
import * as z from "zod";
import ZUSTLayoutWrapper from './ZUSTLayoutWrapper';
import { ImageSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'zust-opening-basic-info-slide'
export const layoutName = 'ZUST Basic Info Slide'
export const layoutDescription = '浙江科技大学开题报告基础信息页，适用于研究背景、研究意义、应用场景等内容展示。'

// 浙科大品牌色
const ZUST_PRIMARY_COLOR = '#004B87'
const ZUST_ACCENT_COLOR = '#00A0E9'
const ZUST_ORANGE_ACCENT = '#FFB81C'

const basicInfoSlideSchema = z.object({
    title: z.string().min(3).max(60).default('研究背景').meta({
        description: "页面标题",
    }),
    description: z.string().min(20).max(400).default('随着信息技术的飞速发展，智慧城市建设成为全球趋势。然而，现有系统在数据融合、智能决策等方面仍面临诸多挑战。本研究旨在结合人工智能技术，构建更加高效、智能的城市管理系统，推动城市数字化转型。').meta({
        description: "详细描述文本",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: '智慧城市科技背景'
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
        <ZUSTLayoutWrapper title={slideData?.title}>
            <div className="h-full flex gap-10 items-center">
                {/* 左侧图片区域 */}
                <div className="w-2/5 flex items-center justify-center">
                    <div 
                        className="relative w-full max-w-sm"
                    >
                        {/* 装饰性背景框 */}
                        <div 
                            className="absolute -top-3 -left-3 w-full h-full rounded-lg"
                            style={{ backgroundColor: `${ZUST_ORANGE_ACCENT}30` }}
                        />
                        <div 
                            className="absolute -bottom-3 -right-3 w-full h-full rounded-lg border-2"
                            style={{ borderColor: ZUST_ACCENT_COLOR }}
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
                        style={{ color: ZUST_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究背景'}
                    </h2>
                    
                    {/* 装饰线 */}
                    <div 
                        className="w-20 h-1 mb-6"
                        style={{ background: `linear-gradient(to right, ${ZUST_ACCENT_COLOR}, ${ZUST_ORANGE_ACCENT})` }}
                    />
                    
                    {/* 描述文本 */}
                    <div 
                        className="text-base leading-relaxed text-gray-700 space-y-4"
                        style={{ textAlign: 'justify' }}
                    >
                        {(slideData?.description || '随着信息技术的飞速发展，智慧城市建设成为全球趋势。然而，现有系统在数据融合、智能决策等方面仍面临诸多挑战。本研究旨在结合人工智能技术，构建更加高效、智能的城市管理系统，推动城市数字化转型。')
                            .split('。')
                            .filter(s => s.trim())
                            .map((sentence, index) => (
                                <p key={index} className="flex items-start">
                                    <span 
                                        className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                        style={{ backgroundColor: ZUST_ORANGE_ACCENT }}
                                    />
                                    <span>{sentence}。</span>
                                </p>
                            ))
                        }
                    </div>
                </div>
            </div>
        </ZUSTLayoutWrapper>
    )
}

export default BasicInfoSlideLayout

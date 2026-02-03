import React from 'react'
import * as z from "zod";
import ZJULayoutWrapper from './ZJULayoutWrapper';
import { ImageSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'zju-opening-basic-info-slide'
export const layoutName = 'ZJU Basic Info Slide'
export const layoutDescription = '浙江大学开题报告基础信息页，适用于研究背景、研究意义、应用场景等内容展示。'

// 浙大品牌色
const ZJU_PRIMARY_COLOR = '#003F88'
const ZJU_ACCENT_COLOR = '#B5985A'

const basicInfoSlideSchema = z.object({
    title: z.string().min(3).max(60).default('研究背景').meta({
        description: "页面标题",
    }),
    description: z.string().min(20).max(400).default('随着人工智能与复杂系统理论的深入发展，智能优化算法在工程设计、资源调度、科学计算等领域展现出广阔的应用前景。然而，面对高维、多约束、动态变化的复杂优化问题，现有算法在收敛速度、解的质量和计算效率方面仍存在不足，亟需创新性突破。').meta({
        description: "详细描述文本",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: '数学公式与算法可视化'
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
        <ZJULayoutWrapper title={slideData?.title}>
            <div className="h-full flex gap-10 items-center">
                {/* 左侧图片区域 */}
                <div className="w-2/5 flex items-center justify-center">
                    <div 
                        className="relative w-full max-w-sm"
                    >
                        {/* 装饰性背景框 */}
                        <div 
                            className="absolute -top-3 -left-3 w-full h-full rounded-lg"
                            style={{ backgroundColor: `${ZJU_ACCENT_COLOR}25` }}
                        />
                        <div 
                            className="absolute -bottom-3 -right-3 w-full h-full rounded-lg border-2"
                            style={{ borderColor: ZJU_PRIMARY_COLOR }}
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
                        style={{ color: ZJU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究背景'}
                    </h2>
                    
                    {/* 装饰线 */}
                    <div 
                        className="w-20 h-1 mb-6"
                        style={{ backgroundColor: ZJU_ACCENT_COLOR }}
                    />
                    
                    {/* 描述文本 */}
                    <div 
                        className="text-base leading-relaxed text-gray-700 space-y-4"
                        style={{ textAlign: 'justify' }}
                    >
                        {(slideData?.description || '随着人工智能与复杂系统理论的深入发展，智能优化算法在工程设计、资源调度、科学计算等领域展现出广阔的应用前景。然而，面对高维、多约束、动态变化的复杂优化问题，现有算法在收敛速度、解的质量和计算效率方面仍存在不足，亟需创新性突破。')
                            .split('。')
                            .filter(s => s.trim())
                            .map((sentence, index) => (
                                <p key={index} className="flex items-start">
                                    <span 
                                        className="inline-block w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                                        style={{ backgroundColor: ZJU_ACCENT_COLOR }}
                                    />
                                    <span>{sentence}。</span>
                                </p>
                            ))
                        }
                    </div>
                </div>
            </div>
        </ZJULayoutWrapper>
    )
}

export default BasicInfoSlideLayout

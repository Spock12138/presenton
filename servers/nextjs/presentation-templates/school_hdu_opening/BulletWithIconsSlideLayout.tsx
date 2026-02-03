import React from 'react'
import * as z from "zod";
import HDULayoutWrapper from './HDULayoutWrapper';
import { ImageSchema, IconSchema } from '@/presentation-templates/defaultSchemes';
import { RemoteSvgIcon } from '@/app/hooks/useRemoteSvgIcon';

export const layoutId = 'hdu-opening-bullet-icons-slide'
export const layoutName = 'HDU Bullet with Icons'
export const layoutDescription = '杭州电子科技大学开题报告图标要点页，适用于问题分析、研究方法、技术路线等内容展示。'

// 杭电品牌色
const HDU_PRIMARY_COLOR = '#003D7A'
const HDU_ACCENT_COLOR = '#C8102E'
const HDU_GOLD_ACCENT = '#D4A017'

const bulletWithIconsSlideSchema = z.object({
    title: z.string().min(3).max(60).default('核心技术方案').meta({
        description: "页面标题",
    }),
    description: z.string().max(200).default('本研究提出的网络安全威胁检测技术方案，融合多种先进方法解决实际问题。').meta({
        description: "主要描述文本",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: '服务器机房与网络设备'
    }).meta({
        description: "配图",
    }),
    bulletPoints: z.array(z.object({
        title: z.string().min(2).max(60).meta({
            description: "要点标题",
        }),
        description: z.string().min(10).max(120).meta({
            description: "要点描述",
        }),
        icon: IconSchema,
    })).min(2).max(4).default([
        {
            title: '特征工程优化',
            description: '基于领域知识设计高效特征提取方案，提升模型对异常流量的识别能力。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/setting-bold.svg',
                __icon_query__: 'settings configuration'
            }
        },
        {
            title: '深度神经网络',
            description: '采用CNN-LSTM混合架构，有效捕获流量的时空特征与序列模式。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/cpu-bold.svg',
                __icon_query__: 'neural network deep learning'
            }
        },
        {
            title: '在线学习机制',
            description: '引入增量学习策略，使模型能够适应不断演化的新型威胁。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/refresh-bold.svg',
                __icon_query__: 'refresh update learning'
            }
        }
    ]).meta({
        description: "带图标的要点列表",
    })
})

export const Schema = bulletWithIconsSlideSchema

export type BulletWithIconsSlideData = z.infer<typeof bulletWithIconsSlideSchema>

interface BulletWithIconsSlideLayoutProps {
    data?: Partial<BulletWithIconsSlideData>
}

const BulletWithIconsSlideLayout: React.FC<BulletWithIconsSlideLayoutProps> = ({ data: slideData }) => {
    const bulletPoints = slideData?.bulletPoints || []

    const getBorderColor = (index: number) => {
        const colors = [HDU_PRIMARY_COLOR, HDU_ACCENT_COLOR, HDU_GOLD_ACCENT]
        return colors[index % colors.length]
    }

    return (
        <HDULayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="mb-6">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-2"
                        style={{ color: HDU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '核心技术方案'}
                    </h2>
                    <div 
                        className="w-20 h-1 mb-3"
                        style={{ background: `linear-gradient(to right, ${HDU_PRIMARY_COLOR}, ${HDU_ACCENT_COLOR})` }}
                    />
                    <p className="text-base text-gray-600 max-w-3xl">
                        {slideData?.description || '本研究提出的网络安全威胁检测技术方案，融合多种先进方法解决实际问题。'}
                    </p>
                </div>

                {/* 内容区域 - 左图右列表 */}
                <div className="flex-1 flex gap-8">
                    {/* 左侧图片 */}
                    <div className="w-2/5 flex items-center">
                        <div 
                            className="w-full h-64 rounded-lg overflow-hidden shadow-lg border-2"
                            style={{ borderColor: `${HDU_PRIMARY_COLOR}30` }}
                        >
                            <img
                                src={slideData?.image?.__image_url__ || ''}
                                alt={slideData?.image?.__image_prompt__ || slideData?.title || ''}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* 右侧要点列表 */}
                    <div className="w-3/5 flex flex-col justify-center gap-4">
                        {bulletPoints.map((bullet, index) => (
                            <div 
                                key={index}
                                className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border-l-4 hover:shadow-md transition-shadow"
                                style={{ borderLeftColor: getBorderColor(index) }}
                            >
                                {/* 图标 */}
                                <div 
                                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${getBorderColor(index)}15` }}
                                >
                                    <RemoteSvgIcon
                                        url={bullet.icon?.__icon_url__ || ''}
                                        className="w-6 h-6"
                                        color={getBorderColor(index)}
                                    />
                                </div>
                                
                                {/* 文本内容 */}
                                <div className="flex-1">
                                    <h4 
                                        className="text-lg font-semibold mb-1"
                                        style={{ color: HDU_PRIMARY_COLOR }}
                                    >
                                        {bullet.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {bullet.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </HDULayoutWrapper>
    )
}

export default BulletWithIconsSlideLayout

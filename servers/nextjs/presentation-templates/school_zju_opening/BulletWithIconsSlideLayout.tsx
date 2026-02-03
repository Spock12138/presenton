import React from 'react'
import * as z from "zod";
import ZJULayoutWrapper from './ZJULayoutWrapper';
import { ImageSchema, IconSchema } from '@/presentation-templates/defaultSchemes';
import { RemoteSvgIcon } from '@/app/hooks/useRemoteSvgIcon';

export const layoutId = 'zju-opening-bullet-icons-slide'
export const layoutName = 'ZJU Bullet with Icons'
export const layoutDescription = '浙江大学开题报告图标要点页，适用于问题分析、研究方法、技术路线等内容展示。'

// 浙大品牌色
const ZJU_PRIMARY_COLOR = '#003F88'
const ZJU_ACCENT_COLOR = '#B5985A'

const bulletWithIconsSlideSchema = z.object({
    title: z.string().min(3).max(60).default('关键科学问题').meta({
        description: "页面标题",
    }),
    description: z.string().max(200).default('本研究聚焦复杂系统优化中的核心科学问题，提出创新性解决方案。').meta({
        description: "主要描述文本",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: '科学研究与数据分析'
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
            title: '高维空间搜索效率',
            description: '如何在高维决策空间中高效探索并避免陷入局部最优。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/search-bold.svg',
                __icon_query__: 'search explore'
            }
        },
        {
            title: '多目标平衡机制',
            description: '如何在多个相互冲突的目标之间实现有效的权衡与平衡。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/scales-bold.svg',
                __icon_query__: 'balance scales tradeoff'
            }
        },
        {
            title: '动态环境适应性',
            description: '如何使算法具备对动态变化环境的快速响应与自适应能力。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/refresh-bold.svg',
                __icon_query__: 'adaptive dynamic change'
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

    return (
        <ZJULayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="mb-6">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-2"
                        style={{ color: ZJU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '关键科学问题'}
                    </h2>
                    <div 
                        className="w-20 h-1 mb-3"
                        style={{ backgroundColor: ZJU_ACCENT_COLOR }}
                    />
                    <p className="text-base text-gray-600 max-w-3xl">
                        {slideData?.description || '本研究聚焦复杂系统优化中的核心科学问题，提出创新性解决方案。'}
                    </p>
                </div>

                {/* 内容区域 - 左图右列表 */}
                <div className="flex-1 flex gap-8">
                    {/* 左侧图片 */}
                    <div className="w-2/5 flex items-center">
                        <div 
                            className="w-full h-64 rounded-lg overflow-hidden shadow-lg border-2"
                            style={{ borderColor: `${ZJU_PRIMARY_COLOR}20` }}
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
                                style={{ borderLeftColor: index % 2 === 0 ? ZJU_PRIMARY_COLOR : ZJU_ACCENT_COLOR }}
                            >
                                {/* 图标 */}
                                <div 
                                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${ZJU_PRIMARY_COLOR}10` }}
                                >
                                    <RemoteSvgIcon
                                        url={bullet.icon?.__icon_url__ || ''}
                                        className="w-6 h-6"
                                        color={ZJU_PRIMARY_COLOR}
                                    />
                                </div>
                                
                                {/* 文本内容 */}
                                <div className="flex-1">
                                    <h4 
                                        className="text-lg font-semibold mb-1"
                                        style={{ color: ZJU_PRIMARY_COLOR }}
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
        </ZJULayoutWrapper>
    )
}

export default BulletWithIconsSlideLayout

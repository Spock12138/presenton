import React from 'react'
import * as z from "zod";
import ZUSTLayoutWrapper from './ZUSTLayoutWrapper';
import { ImageSchema, IconSchema } from '@/presentation-templates/defaultSchemes';
import { RemoteSvgIcon } from '@/app/hooks/useRemoteSvgIcon';

export const layoutId = 'zust-opening-bullet-icons-slide'
export const layoutName = 'ZUST Bullet with Icons'
export const layoutDescription = '浙江科技大学开题报告图标要点页，适用于问题分析、研究方法、技术路线等内容展示。'

// 浙科大品牌色
const ZUST_PRIMARY_COLOR = '#004B87'
const ZUST_ACCENT_COLOR = '#00A0E9'
const ZUST_ORANGE_ACCENT = '#FFB81C'

const bulletWithIconsSlideSchema = z.object({
    title: z.string().min(3).max(60).default('关键技术与方法').meta({
        description: "页面标题",
    }),
    description: z.string().max(200).default('本研究采用的核心技术方案与创新方法，解决智慧城市建设中的关键技术难题。').meta({
        description: "主要描述文本",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: '科技电路板与数据处理'
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
            title: '多源数据融合',
            description: '整合城市各类传感器数据，构建统一的数据治理与分析平台。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/database-bold.svg',
                __icon_query__: 'database data fusion'
            }
        },
        {
            title: '深度学习模型',
            description: '基于Transformer架构设计轻量化模型，支持端侧部署。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/cpu-bold.svg',
                __icon_query__: 'neural network ai'
            }
        },
        {
            title: '实时决策引擎',
            description: '结合规则推理与机器学习，实现毫秒级智能决策响应。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/flash-bold.svg',
                __icon_query__: 'lightning speed fast'
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
        const colors = [ZUST_PRIMARY_COLOR, ZUST_ACCENT_COLOR, ZUST_ORANGE_ACCENT]
        return colors[index % colors.length]
    }

    return (
        <ZUSTLayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="mb-6">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-2"
                        style={{ color: ZUST_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '关键技术与方法'}
                    </h2>
                    <div 
                        className="w-20 h-1 mb-3"
                        style={{ background: `linear-gradient(to right, ${ZUST_ACCENT_COLOR}, ${ZUST_ORANGE_ACCENT})` }}
                    />
                    <p className="text-base text-gray-600 max-w-3xl">
                        {slideData?.description || '本研究采用的核心技术方案与创新方法，解决智慧城市建设中的关键技术难题。'}
                    </p>
                </div>

                {/* 内容区域 - 左图右列表 */}
                <div className="flex-1 flex gap-8">
                    {/* 左侧图片 */}
                    <div className="w-2/5 flex items-center">
                        <div 
                            className="w-full h-64 rounded-lg overflow-hidden shadow-lg border-2"
                            style={{ borderColor: `${ZUST_ACCENT_COLOR}40` }}
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
                                        style={{ color: ZUST_PRIMARY_COLOR }}
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
        </ZUSTLayoutWrapper>
    )
}

export default BulletWithIconsSlideLayout

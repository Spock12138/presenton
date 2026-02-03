import React from 'react'
import * as z from "zod";
import ZJUTLayoutWrapper from './ZJUTLayoutWrapper';
import { ImageSchema, IconSchema } from '@/presentation-templates/defaultSchemes';
import { RemoteSvgIcon } from '@/app/hooks/useRemoteSvgIcon';

export const layoutId = 'zjut-opening-bullet-icons-slide'
export const layoutName = 'ZJUT Bullet with Icons'
export const layoutDescription = '浙江工业大学开题报告图标要点页，适用于问题分析、研究方法、技术路线等内容展示。'

// 浙工大品牌色
const ZJUT_PRIMARY_COLOR = '#1E4E79'
const ZJUT_GOLD_ACCENT = '#C9A227'

const bulletWithIconsSlideSchema = z.object({
    title: z.string().min(3).max(60).default('研究问题与挑战').meta({
        description: "页面标题",
    }),
    description: z.string().max(200).default('当前领域存在的核心问题与技术挑战，亟待通过创新方法加以解决。').meta({
        description: "主要描述文本",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: '科研人员在实验室进行研究工作'
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
            title: '数据质量问题',
            description: '现有数据集存在标注不一致、噪声干扰等问题，影响模型训练效果。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/database-bold.svg',
                __icon_query__: 'database data storage'
            }
        },
        {
            title: '计算效率瓶颈',
            description: '传统方法计算复杂度高，难以满足大规模数据处理的实时性需求。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/cpu-bold.svg',
                __icon_query__: 'cpu processor computing'
            }
        },
        {
            title: '泛化能力不足',
            description: '现有模型在跨域场景下性能下降明显，缺乏良好的迁移学习能力。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/graph-bold.svg',
                __icon_query__: 'neural network graph'
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
        <ZJUTLayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="mb-6">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-2"
                        style={{ color: ZJUT_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究问题与挑战'}
                    </h2>
                    <div 
                        className="w-20 h-1 mb-3"
                        style={{ backgroundColor: ZJUT_GOLD_ACCENT }}
                    />
                    <p className="text-base text-gray-600 max-w-3xl">
                        {slideData?.description || '当前领域存在的核心问题与技术挑战，亟待通过创新方法加以解决。'}
                    </p>
                </div>

                {/* 内容区域 - 左图右列表 */}
                <div className="flex-1 flex gap-8">
                    {/* 左侧图片 */}
                    <div className="w-2/5 flex items-center">
                        <div 
                            className="w-full h-64 rounded-lg overflow-hidden shadow-lg border-2"
                            style={{ borderColor: `${ZJUT_PRIMARY_COLOR}20` }}
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
                                style={{ borderLeftColor: index % 2 === 0 ? ZJUT_PRIMARY_COLOR : ZJUT_GOLD_ACCENT }}
                            >
                                {/* 图标 */}
                                <div 
                                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${ZJUT_PRIMARY_COLOR}10` }}
                                >
                                    <RemoteSvgIcon
                                        url={bullet.icon?.__icon_url__ || ''}
                                        className="w-6 h-6"
                                        color={ZJUT_PRIMARY_COLOR}
                                    />
                                </div>
                                
                                {/* 文本内容 */}
                                <div className="flex-1">
                                    <h4 
                                        className="text-lg font-semibold mb-1"
                                        style={{ color: ZJUT_PRIMARY_COLOR }}
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
        </ZJUTLayoutWrapper>
    )
}

export default BulletWithIconsSlideLayout

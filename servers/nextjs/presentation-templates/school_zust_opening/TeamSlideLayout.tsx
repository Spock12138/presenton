import React from 'react'
import * as z from "zod";
import ZUSTLayoutWrapper from './ZUSTLayoutWrapper';
import { ImageSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'zust-opening-team-slide'
export const layoutName = 'ZUST Team Slide'
export const layoutDescription = '浙江科技大学开题报告研究团队页，用于展示指导教师与研究团队成员信息。'

// 浙科大品牌色
const ZUST_PRIMARY_COLOR = '#004B87'
const ZUST_ACCENT_COLOR = '#00A0E9'
const ZUST_ORANGE_ACCENT = '#FFB81C'

const teamMemberSchema = z.object({
    name: z.string().min(2).max(30).meta({
        description: "成员姓名"
    }),
    position: z.string().min(2).max(50).meta({
        description: "职称/身份"
    }),
    description: z.string().max(100).meta({
        description: "简要介绍"
    }),
    image: ImageSchema
});

const teamSlideSchema = z.object({
    title: z.string().min(3).max(40).default('研究团队').meta({
        description: "页面标题",
    }),
    teamDescription: z.string().min(10).max(200).default('本研究由信息与电子工程学院智能系统团队完成，团队专注于人工智能与物联网技术研究，拥有丰富的产学研合作经验。').meta({
        description: "团队整体介绍",
    }),
    teamMembers: z.array(teamMemberSchema).min(2).max(4).default([
        {
            name: '王建国 教授',
            position: '指导教师 / 博士生导师',
            description: '研究方向：智能物联网、边缘计算，主持省部级项目5项。',
            image: {
                __image_url__: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                __image_prompt__: '教授学者头像'
            }
        },
        {
            name: '张伟',
            position: '硕士研究生（本人）',
            description: '研究方向：智慧城市、深度学习，参与横向项目2项。',
            image: {
                __image_url__: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                __image_prompt__: '研究生学生头像'
            }
        },
        {
            name: '刘芳 副教授',
            position: '联合指导教师',
            description: '研究方向：数据挖掘与可视化，发表高水平论文20余篇。',
            image: {
                __image_url__: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                __image_prompt__: '女性学者头像'
            }
        }
    ]).meta({
        description: "团队成员列表",
    })
})

export const Schema = teamSlideSchema

export type TeamSlideData = z.infer<typeof teamSlideSchema>

interface TeamSlideLayoutProps {
    data?: Partial<TeamSlideData>
}

const TeamSlideLayout: React.FC<TeamSlideLayoutProps> = ({ data: slideData }) => {
    const teamMembers = slideData?.teamMembers || []

    // 根据人数决定布局
    const getGridCols = (count: number) => {
        if (count <= 2) return 'grid-cols-2'
        if (count === 3) return 'grid-cols-3'
        return 'grid-cols-2 lg:grid-cols-4'
    }

    const getBorderColor = (index: number) => {
        return index === 0 ? ZUST_ORANGE_ACCENT : ZUST_ACCENT_COLOR
    }

    return (
        <ZUSTLayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="text-center mb-4">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-2"
                        style={{ color: ZUST_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究团队'}
                    </h2>
                    <div 
                        className="w-24 h-1 mx-auto mb-3"
                        style={{ background: `linear-gradient(to right, ${ZUST_ACCENT_COLOR}, ${ZUST_ORANGE_ACCENT})` }}
                    />
                    <p className="text-sm text-gray-600 max-w-3xl mx-auto">
                        {slideData?.teamDescription || '本研究由信息与电子工程学院智能系统团队完成，团队专注于人工智能与物联网技术研究，拥有丰富的产学研合作经验。'}
                    </p>
                </div>

                {/* 成员卡片区域 */}
                <div className={`flex-1 grid ${getGridCols(teamMembers.length)} gap-6 items-center`}>
                    {teamMembers.map((member, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
                        >
                            {/* 头像区域 */}
                            <div 
                                className="relative h-32 overflow-hidden"
                                style={{ backgroundColor: `${ZUST_ACCENT_COLOR}10` }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div 
                                        className="w-20 h-20 rounded-full overflow-hidden border-3 shadow-md"
                                        style={{ borderColor: getBorderColor(index), borderWidth: '3px' }}
                                    >
                                        <img
                                            src={member.image?.__image_url__ || ''}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                
                                {/* 指导教师标识 */}
                                {index === 0 && (
                                    <div 
                                        className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-white rounded"
                                        style={{ backgroundColor: ZUST_ORANGE_ACCENT }}
                                    >
                                        指导教师
                                    </div>
                                )}
                            </div>
                            
                            {/* 信息区域 */}
                            <div className="p-4 text-center">
                                <h4 
                                    className="text-lg font-bold mb-1"
                                    style={{ color: ZUST_PRIMARY_COLOR }}
                                >
                                    {member.name}
                                </h4>
                                <p 
                                    className="text-sm font-medium mb-2"
                                    style={{ color: ZUST_ACCENT_COLOR }}
                                >
                                    {member.position}
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    {member.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ZUSTLayoutWrapper>
    )
}

export default TeamSlideLayout

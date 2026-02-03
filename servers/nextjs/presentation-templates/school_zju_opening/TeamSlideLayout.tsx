import React from 'react'
import * as z from "zod";
import ZJULayoutWrapper from './ZJULayoutWrapper';
import { ImageSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'zju-opening-team-slide'
export const layoutName = 'ZJU Team Slide'
export const layoutDescription = '浙江大学开题报告研究团队页，用于展示指导教师与研究团队成员信息。'

// 浙大品牌色
const ZJU_PRIMARY_COLOR = '#003F88'
const ZJU_ACCENT_COLOR = '#B5985A'

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
    teamDescription: z.string().min(10).max(200).default('本研究由计算机科学与技术学院智能计算与优化团队完成，团队在进化计算与智能优化领域具有深厚积累，承担多项国家级科研项目。').meta({
        description: "团队整体介绍",
    }),
    teamMembers: z.array(teamMemberSchema).min(2).max(4).default([
        {
            name: '王明远 教授',
            position: '指导教师 / 博士生导师',
            description: '研究方向：进化计算、多目标优化，IEEE Fellow，主持国家杰青项目。',
            image: {
                __image_url__: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                __image_prompt__: '教授学者头像'
            }
        },
        {
            name: '赵明',
            position: '博士研究生（本人）',
            description: '研究方向：智能优化算法、复杂系统建模，发表CCF-A类论文2篇。',
            image: {
                __image_url__: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                __image_prompt__: '研究生学生头像'
            }
        },
        {
            name: '李雪梅 副教授',
            position: '联合指导教师',
            description: '研究方向：机器学习与数据挖掘，浙江省青年拔尖人才。',
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

    return (
        <ZJULayoutWrapper title={slideData?.title}>
            <div className="h-full flex flex-col">
                {/* 标题区域 */}
                <div className="text-center mb-4">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-2"
                        style={{ color: ZJU_PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究团队'}
                    </h2>
                    <div 
                        className="w-24 h-1 mx-auto mb-3"
                        style={{ backgroundColor: ZJU_ACCENT_COLOR }}
                    />
                    <p className="text-sm text-gray-600 max-w-3xl mx-auto">
                        {slideData?.teamDescription || '本研究由计算机科学与技术学院智能计算与优化团队完成，团队在进化计算与智能优化领域具有深厚积累，承担多项国家级科研项目。'}
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
                                style={{ backgroundColor: `${ZJU_PRIMARY_COLOR}10` }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div 
                                        className="w-20 h-20 rounded-full overflow-hidden border-3 shadow-md"
                                        style={{ borderColor: index === 0 ? ZJU_ACCENT_COLOR : ZJU_PRIMARY_COLOR, borderWidth: '3px' }}
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
                                        style={{ backgroundColor: ZJU_ACCENT_COLOR }}
                                    >
                                        指导教师
                                    </div>
                                )}
                            </div>
                            
                            {/* 信息区域 */}
                            <div className="p-4 text-center">
                                <h4 
                                    className="text-lg font-bold mb-1"
                                    style={{ color: ZJU_PRIMARY_COLOR }}
                                >
                                    {member.name}
                                </h4>
                                <p 
                                    className="text-sm font-medium mb-2"
                                    style={{ color: ZJU_ACCENT_COLOR }}
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
        </ZJULayoutWrapper>
    )
}

export default TeamSlideLayout

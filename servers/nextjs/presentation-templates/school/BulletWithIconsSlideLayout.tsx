import React from 'react'
import * as z from "zod";
import { ImageSchema, IconSchema } from '@/presentation-templates/defaultSchemes';
import { RemoteSvgIcon } from '@/app/hooks/useRemoteSvgIcon';
import SchoolLayoutWrapper from './SchoolLayoutWrapper';

export const layoutId = 'school-bullet-with-icons-slide'
export const layoutName = 'School Bullet with Icons'
export const layoutDescription = 'A formal academic slide with bullet points, icons, and supporting image for thesis presentations.'

const bulletWithIconsSlideSchema = z.object({
    title: z.string().min(3).max(40).default('研究背景').meta({
        description: "Main title of the slide",
    }),
    description: z.string().max(150).default('本研究旨在探讨当前学术领域的关键问题，分析现有研究的不足，并提出创新性的解决方案。').meta({
        description: "Main description text explaining the topic",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: 'University lecture hall with students and professor'
    }).meta({
        description: "Supporting image for the slide",
    }),
    bulletPoints: z.array(z.object({
        title: z.string().min(2).max(60).meta({
            description: "Bullet point title",
        }),
        description: z.string().min(10).max(100).meta({
            description: "Bullet point description",
        }),
        icon: IconSchema,
    })).min(1).max(3).default([
        {
            title: '研究意义',
            description: '填补现有研究空白，为该领域提供新的理论视角和实践指导。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/book-open-bold.svg',
                __icon_query__: 'book research academic'
            }
        },
        {
            title: '创新点',
            description: '采用跨学科方法，结合最新技术手段进行深入分析。',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/lightbulb-bold.svg',
                __icon_query__: 'lightbulb innovation idea'
            }
        }
    ]).meta({
        description: "List of bullet points with icons and descriptions",
    }),
    pageNum: z.number().optional().meta({
        description: "Page number for the slide",
    })
})

export const Schema = bulletWithIconsSlideSchema

export type BulletWithIconsSlideData = z.infer<typeof bulletWithIconsSlideSchema>

interface BulletWithIconsSlideLayoutProps {
    data?: Partial<BulletWithIconsSlideData>
}

const BulletWithIconsSlideLayout: React.FC<BulletWithIconsSlideLayoutProps> = ({ data: slideData }) => {
    const bulletPoints = slideData?.bulletPoints || []
    const PRIMARY_COLOR = '#003366'

    return (
        <SchoolLayoutWrapper title={slideData?.title} pageNum={slideData?.pageNum}>
            {/* Main Content - 适配新的页眉页脚布局 */}
            <div className="flex flex-col h-full px-4 sm:px-8 lg:px-12 py-2">
                {/* Title Section */}
                <div className="mb-3">
                    <h1 
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        {slideData?.title || '研究背景'}
                    </h1>
                    <div 
                        className="w-16 h-1 mt-2"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    />
                </div>

                {/* Content Container - 左文字右图片 */}
                <div className="flex flex-1 gap-6">
                    {/* Left Section - Bullet Points */}
                    <div className="flex-1 flex flex-col justify-center">
                        {/* Description */}
                        <p 
                            className="text-sm sm:text-base leading-relaxed mb-4"
                            style={{ color: '#333333' }}
                        >
                            {slideData?.description || '本研究旨在探讨当前学术领域的关键问题，分析现有研究的不足，并提出创新性的解决方案。'}
                        </p>

                        {/* Bullet Points */}
                        <div className="space-y-3">
                            {bulletPoints.map((bullet, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-start space-x-3 p-3 rounded-lg"
                                    style={{
                                        backgroundColor: 'rgba(0, 51, 102, 0.04)',
                                        border: '1px solid rgba(0, 51, 102, 0.1)',
                                    }}
                                >
                                    {/* Icon */}
                                    <div 
                                        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: PRIMARY_COLOR }}
                                    >
                                        <RemoteSvgIcon
                                            url={bullet.icon.__icon_url__}
                                            strokeColor="currentColor"
                                            className="w-4 h-4"
                                            color="#FFFFFF"
                                            title={bullet.icon.__icon_query__}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 
                                            className="text-base font-semibold mb-1"
                                            style={{ color: PRIMARY_COLOR }}
                                        >
                                            {bullet.title}
                                        </h3>
                                        <p 
                                            className="text-xs sm:text-sm leading-relaxed"
                                            style={{ color: '#555555' }}
                                        >
                                            {bullet.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section - Image / Chart Placeholder */}
                    <div className="flex-1 flex items-center justify-center">
                        <div 
                            className="w-full max-w-sm h-56 rounded-lg overflow-hidden"
                            style={{
                                boxShadow: '0 4px 16px rgba(0, 51, 102, 0.15)',
                                border: `2px solid ${PRIMARY_COLOR}`,
                            }}
                        >
                            <img
                                src={slideData?.image?.__image_url__ || ''}
                                alt={slideData?.image?.__image_prompt__ || slideData?.title || ''}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </SchoolLayoutWrapper>
    )
}

export default BulletWithIconsSlideLayout

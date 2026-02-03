import React from 'react'
import * as z from "zod";

export const layoutId = 'zju-opening-intro-slide'
export const layoutName = 'ZJU Opening Report Cover'
export const layoutDescription = '浙江大学开题报告封面页，包含论文标题、学生信息、指导教师等关键信息。'

// 浙大品牌色
const ZJU_PRIMARY_COLOR = '#003F88'
const ZJU_ACCENT_COLOR = '#B5985A'

const introSlideSchema = z.object({
    title: z.string().min(3).max(120).default('面向复杂系统的智能优化算法研究').meta({
        description: "论文/研究主标题",
    }),
    subtitle: z.string().max(150).optional().default('').meta({
        description: "副标题（可选）",
    }),
    studentName: z.string().min(2).max(50).default('赵明').meta({
        description: "学生姓名",
    }),
    studentId: z.string().max(30).optional().default('3210100001').meta({
        description: "学号（可选）",
    }),
    supervisorName: z.string().max(50).default('王教授').meta({
        description: "指导教师姓名",
    }),
    supervisorTitle: z.string().max(30).optional().default('教授、博士生导师').meta({
        description: "指导教师职称（可选）",
    }),
    college: z.string().max(100).default('计算机科学与技术学院').meta({
        description: "所在学院",
    }),
    major: z.string().max(80).optional().default('计算机科学与技术').meta({
        description: "专业方向（可选）",
    }),
    presentationDate: z.string().min(2).max(50).default('2026年2月3日').meta({
        description: "开题日期",
    }),
})

export const Schema = introSlideSchema

export type IntroSlideData = z.infer<typeof introSlideSchema>

interface IntroSlideLayoutProps {
    data?: Partial<IntroSlideData>
}

const IntroSlideLayout: React.FC<IntroSlideLayoutProps> = ({ data: slideData }) => {
    const {
        title = '面向复杂系统的智能优化算法研究',
        subtitle = '',
        studentName = '赵明',
        studentId = '3210100001',
        supervisorName = '王教授',
        supervisorTitle = '教授、博士生导师',
        college = '计算机科学与技术学院',
        major = '计算机科学与技术',
        presentationDate = '2026年2月3日',
    } = slideData || {}

    return (
        <div
            className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden"
            style={{
                fontFamily: '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "SimSun", serif',
                backgroundImage: 'url(/templates/school_zju_opening/bg_cover.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Background Overlay - 求是蓝渐变遮罩 */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(160deg, rgba(0, 63, 136, 0.90) 0%, rgba(0, 63, 136, 0.78) 50%, rgba(26, 93, 173, 0.85) 100%)`,
                }}
            />

            {/* 顶部装饰线 - 浙大金色 */}
            <div 
                className="absolute top-0 left-0 right-0 h-1 z-20"
                style={{ backgroundColor: ZJU_ACCENT_COLOR }}
            />

            {/* University Logo - 顶部居中 */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
                <div className="relative h-16">
                    <img 
                        src="/templates/school_zju_opening/logo_long.png" 
                        alt="浙江大学"
                        className="h-16 w-auto object-contain"
                        style={{
                            filter: 'brightness(0) invert(1)',
                        }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                        }}
                    />
                    {/* Fallback text when image fails to load */}
                    <div 
                        className="hidden text-center whitespace-nowrap"
                        style={{ 
                            color: '#FFFFFF',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            letterSpacing: '0.15em',
                        }}
                    >
                        浙江大学
                        <br />
                        <span style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>
                            ZHEJIANG UNIVERSITY
                        </span>
                    </div>
                </div>
                <p 
                    className="mt-3 text-sm tracking-[0.3em] uppercase"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                    Thesis Proposal Defense
                </p>
            </div>

            {/* 主体内容区 - 标题居中 */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 pt-28 pb-40">
                {/* 开题报告标识 */}
                <div 
                    className="mb-6 px-6 py-2 rounded-sm"
                    style={{ 
                        backgroundColor: 'rgba(181, 152, 90, 0.15)',
                        border: `1px solid ${ZJU_ACCENT_COLOR}`,
                    }}
                >
                    <span 
                        className="text-base font-semibold tracking-[0.2em]"
                        style={{ color: ZJU_ACCENT_COLOR }}
                    >
                        博士学位论文开题报告
                    </span>
                </div>

                {/* 主标题 */}
                <h1 
                    className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold mb-4 leading-tight text-center max-w-5xl"
                    style={{ 
                        color: '#FFFFFF',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    {title}
                </h1>

                {/* 副标题 */}
                {subtitle && (
                    <p 
                        className="text-xl sm:text-2xl mb-6 max-w-4xl text-center"
                        style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                    >
                        {subtitle}
                    </p>
                )}

                {/* 装饰分割线 */}
                <div className="flex items-center gap-3 mt-2">
                    <div className="w-16 h-px" style={{ backgroundColor: ZJU_ACCENT_COLOR, opacity: 0.6 }} />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ZJU_ACCENT_COLOR }} />
                    <div className="w-16 h-px" style={{ backgroundColor: ZJU_ACCENT_COLOR, opacity: 0.6 }} />
                </div>
            </div>

            {/* 底部信息栏 - 半透明深色容器 */}
            <div 
                className="absolute bottom-0 left-0 right-0 z-10"
                style={{
                    background: 'linear-gradient(to top, rgba(0, 31, 68, 0.96) 0%, rgba(0, 63, 136, 0.92) 100%)',
                    borderTop: `2px solid ${ZJU_ACCENT_COLOR}`,
                }}
            >
                <div className="px-12 py-6">
                    <div className="grid grid-cols-4 gap-6 text-center">
                        {/* 学生信息 */}
                        <div className="flex flex-col">
                            <span 
                                className="text-xs mb-1 tracking-wider uppercase"
                                style={{ color: 'rgba(181, 152, 90, 0.85)' }}
                            >
                                答辩人 / Student
                            </span>
                            <span 
                                className="text-lg font-semibold"
                                style={{ color: '#FFFFFF' }}
                            >
                                {studentName}
                            </span>
                            {studentId && (
                                <span 
                                    className="text-xs mt-0.5"
                                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                                >
                                    学号：{studentId}
                                </span>
                            )}
                        </div>

                        {/* 指导教师 */}
                        <div className="flex flex-col">
                            <span 
                                className="text-xs mb-1 tracking-wider uppercase"
                                style={{ color: 'rgba(181, 152, 90, 0.85)' }}
                            >
                                指导教师 / Supervisor
                            </span>
                            <span 
                                className="text-lg font-semibold"
                                style={{ color: '#FFFFFF' }}
                            >
                                {supervisorName}
                            </span>
                            {supervisorTitle && (
                                <span 
                                    className="text-xs mt-0.5"
                                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                                >
                                    {supervisorTitle}
                                </span>
                            )}
                        </div>

                        {/* 学院 */}
                        <div className="flex flex-col">
                            <span 
                                className="text-xs mb-1 tracking-wider uppercase"
                                style={{ color: 'rgba(181, 152, 90, 0.85)' }}
                            >
                                所在学院 / College
                            </span>
                            <span 
                                className="text-lg font-semibold"
                                style={{ color: '#FFFFFF' }}
                            >
                                {college}
                            </span>
                            {major && (
                                <span 
                                    className="text-xs mt-0.5"
                                    style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                                >
                                    {major}
                                </span>
                            )}
                        </div>

                        {/* 日期 */}
                        <div className="flex flex-col">
                            <span 
                                className="text-xs mb-1 tracking-wider uppercase"
                                style={{ color: 'rgba(181, 152, 90, 0.85)' }}
                            >
                                答辩日期 / Date
                            </span>
                            <span 
                                className="text-lg font-semibold"
                                style={{ color: '#FFFFFF' }}
                            >
                                {presentationDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 装饰角元素 */}
            <div 
                className="absolute top-0 left-0 w-24 h-24 z-10"
                style={{
                    borderTop: `3px solid ${ZJU_ACCENT_COLOR}`,
                    borderLeft: `3px solid ${ZJU_ACCENT_COLOR}`,
                    opacity: 0.5,
                }}
            />
            <div 
                className="absolute top-0 right-0 w-24 h-24 z-10"
                style={{
                    borderTop: `3px solid ${ZJU_ACCENT_COLOR}`,
                    borderRight: `3px solid ${ZJU_ACCENT_COLOR}`,
                    opacity: 0.5,
                }}
            />
        </div>
    )
}

export default IntroSlideLayout

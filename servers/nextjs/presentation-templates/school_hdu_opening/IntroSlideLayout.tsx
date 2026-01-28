import React from 'react'
import * as z from "zod";

export const layoutId = 'hdu-opening-intro-slide'
export const layoutName = 'HDU Opening Report Cover'
export const layoutDescription = '杭州电子科技大学开题报告封面页，包含论文标题、学生信息、指导教师等关键信息。'

// 杭电品牌色
const HDU_PRIMARY_COLOR = '#003D7A'
const HDU_ACCENT_COLOR = '#C8102E'
const HDU_GOLD_ACCENT = '#D4A017'

const introSlideSchema = z.object({
    title: z.string().min(3).max(120).default('基于机器学习的网络安全威胁检测研究').meta({
        description: "论文/研究主标题",
    }),
    subtitle: z.string().max(150).optional().default('').meta({
        description: "副标题（可选）",
    }),
    studentName: z.string().min(2).max(50).default('李明').meta({
        description: "学生姓名",
    }),
    studentId: z.string().max(30).optional().default('202112345678').meta({
        description: "学号（可选）",
    }),
    supervisorName: z.string().max(50).default('陈教授').meta({
        description: "指导教师姓名",
    }),
    supervisorTitle: z.string().max(30).optional().default('教授、博士生导师').meta({
        description: "指导教师职称（可选）",
    }),
    college: z.string().max(100).default('计算机学院').meta({
        description: "所在学院",
    }),
    major: z.string().max(80).optional().default('计算机科学与技术').meta({
        description: "专业方向（可选）",
    }),
    presentationDate: z.string().min(2).max(50).default('2026年1月27日').meta({
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
        title = '基于机器学习的网络安全威胁检测研究',
        subtitle = '',
        studentName = '李明',
        studentId = '202112345678',
        supervisorName = '陈教授',
        supervisorTitle = '教授、博士生导师',
        college = '计算机学院',
        major = '计算机科学与技术',
        presentationDate = '2026年1月27日',
    } = slideData || {}

    return (
        <div
            className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden"
            style={{
                fontFamily: '"Source Han Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif',
                backgroundImage: 'url(/templates/school_hdu_opening/bg_cover.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Background Overlay - 深蓝渐变遮罩 */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(135deg, rgba(0, 61, 122, 0.90) 0%, rgba(0, 61, 122, 0.78) 50%, rgba(200, 16, 46, 0.25) 100%)`,
                }}
            />

            {/* 顶部装饰线 - 杭电蓝红配色 */}
            <div 
                className="absolute top-0 left-0 right-0 h-1 z-20"
                style={{ 
                    background: `linear-gradient(to right, ${HDU_PRIMARY_COLOR} 0%, ${HDU_ACCENT_COLOR} 100%)`,
                }}
            />

            {/* University Logo - 顶部居中 */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
                <div className="relative h-14">
                    <img 
                        src="/templates/school_hdu_opening/logo_long.png" 
                        alt="杭州电子科技大学"
                        className="h-14 w-auto object-contain"
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
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            letterSpacing: '0.1em',
                        }}
                    >
                        杭州电子科技大学
                        <br />
                        <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>
                            HANGZHOU DIANZI UNIVERSITY
                        </span>
                    </div>
                </div>
                <p 
                    className="mt-3 text-sm tracking-[0.3em] uppercase"
                    style={{ color: 'rgba(255, 255, 255, 0.75)' }}
                >
                    Thesis Proposal Defense
                </p>
            </div>

            {/* 主体内容区 - 标题居中 */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 pt-24 pb-40">
                {/* 开题报告标识 */}
                <div 
                    className="mb-6 px-6 py-2 rounded-sm"
                    style={{ 
                        backgroundColor: 'rgba(212, 160, 23, 0.12)',
                        border: `1px solid ${HDU_GOLD_ACCENT}`,
                    }}
                >
                    <span 
                        className="text-base font-semibold tracking-[0.2em]"
                        style={{ color: HDU_GOLD_ACCENT }}
                    >
                        硕士学位论文开题报告
                    </span>
                </div>

                {/* 主标题 */}
                <h1 
                    className="text-4xl sm:text-5xl lg:text-[3.2rem] font-bold mb-4 leading-tight text-center max-w-5xl"
                    style={{ 
                        color: '#FFFFFF',
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    {title}
                </h1>

                {/* 副标题 */}
                {subtitle && (
                    <p 
                        className="text-xl sm:text-2xl mb-6 max-w-4xl text-center"
                        style={{ color: 'rgba(255, 255, 255, 0.88)' }}
                    >
                        {subtitle}
                    </p>
                )}

                {/* 装饰分割线 - 融入杭电红色元素 */}
                <div className="flex items-center gap-3 mt-2">
                    <div className="w-12 h-px" style={{ backgroundColor: HDU_GOLD_ACCENT, opacity: 0.7 }} />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: HDU_ACCENT_COLOR }} />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: HDU_GOLD_ACCENT }} />
                    <div className="w-12 h-px" style={{ backgroundColor: HDU_GOLD_ACCENT, opacity: 0.7 }} />
                </div>
            </div>

            {/* 底部信息栏 - 半透明深色容器 */}
            <div 
                className="absolute bottom-0 left-0 right-0 z-10"
                style={{
                    background: 'linear-gradient(to top, rgba(0, 30, 60, 0.96) 0%, rgba(0, 50, 90, 0.92) 100%)',
                    borderTop: `2px solid ${HDU_GOLD_ACCENT}`,
                }}
            >
                <div className="px-12 py-6">
                    <div className="grid grid-cols-4 gap-6 text-center">
                        {/* 学生信息 */}
                        <div className="flex flex-col">
                            <span 
                                className="text-xs mb-1 tracking-wider uppercase"
                                style={{ color: 'rgba(212, 160, 23, 0.85)' }}
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
                                    style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                                >
                                    学号：{studentId}
                                </span>
                            )}
                        </div>

                        {/* 指导教师 */}
                        <div className="flex flex-col">
                            <span 
                                className="text-xs mb-1 tracking-wider uppercase"
                                style={{ color: 'rgba(212, 160, 23, 0.85)' }}
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
                                    style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                                >
                                    {supervisorTitle}
                                </span>
                            )}
                        </div>

                        {/* 学院 */}
                        <div className="flex flex-col">
                            <span 
                                className="text-xs mb-1 tracking-wider uppercase"
                                style={{ color: 'rgba(212, 160, 23, 0.85)' }}
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
                                    style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                                >
                                    {major}
                                </span>
                            )}
                        </div>

                        {/* 日期 */}
                        <div className="flex flex-col">
                            <span 
                                className="text-xs mb-1 tracking-wider uppercase"
                                style={{ color: 'rgba(212, 160, 23, 0.85)' }}
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

            {/* 装饰角元素 - 使用杭电配色 */}
            <div 
                className="absolute top-0 left-0 w-20 h-20 z-10"
                style={{
                    borderTop: `3px solid ${HDU_GOLD_ACCENT}`,
                    borderLeft: `3px solid ${HDU_GOLD_ACCENT}`,
                    opacity: 0.5,
                }}
            />
            <div 
                className="absolute top-0 right-0 w-20 h-20 z-10"
                style={{
                    borderTop: `3px solid ${HDU_ACCENT_COLOR}`,
                    borderRight: `3px solid ${HDU_ACCENT_COLOR}`,
                    opacity: 0.4,
                }}
            />
        </div>
    )
}

export default IntroSlideLayout

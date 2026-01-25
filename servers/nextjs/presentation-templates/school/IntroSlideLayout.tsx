import React from 'react'
import * as z from "zod";

export const layoutId = 'school-intro-slide'
export const layoutName = 'School Intro Slide'
export const layoutDescription = 'A formal academic cover slide for university thesis defense with title and presenter information.'

const introSlideSchema = z.object({
    title: z.string().min(3).max(100).default('Research Title Goes Here').meta({
        description: "Main title of the thesis or presentation",
    }),
    subtitle: z.string().max(150).default('A Study on Academic Excellence').meta({
        description: "Subtitle or research topic description",
    }),
    presenterName: z.string().min(2).max(50).default('张三').meta({
        description: "Name of the presenter/student",
    }),
    supervisorName: z.string().max(50).default('李教授').meta({
        description: "Name of the thesis supervisor",
    }),
    department: z.string().max(100).default('计算机科学与技术学院').meta({
        description: "Department or college name",
    }),
    presentationDate: z.string().min(2).max(50).default('2026年1月').meta({
        description: "Date of the presentation",
    }),
})

export const Schema = introSlideSchema

export type IntroSlideData = z.infer<typeof introSlideSchema>

interface IntroSlideLayoutProps {
    data?: Partial<IntroSlideData>
}

const IntroSlideLayout: React.FC<IntroSlideLayoutProps> = ({ data: slideData }) => {
    return (
        <div
            className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden"
            style={{
                fontFamily: '"Times New Roman", "Songti SC", "SimSun", serif',
                backgroundImage: 'url(/templates/school/bg_cover.jpg)',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Background Overlay */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(0, 51, 102, 0.85) 0%, rgba(0, 51, 102, 0.7) 100%)',
                }}
            />

            {/* University Logo - Top Center */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
                <img 
                    src="/templates/school/logo.png" 
                    alt="University Logo"
                    className="h-20 w-auto object-contain"
                    style={{
                        filter: 'brightness(0) invert(1)',
                    }}
                />
            </div>

            {/* Main Content - Centered */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 text-center">
                {/* Department */}
                <p 
                    className="text-lg mb-4 tracking-wider"
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                    {slideData?.department || '计算机科学与技术学院'}
                </p>

                {/* Main Title */}
                <h1 
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight max-w-4xl"
                    style={{ color: '#FFFFFF' }}
                >
                    {slideData?.title || 'Research Title Goes Here'}
                </h1>

                {/* Decorative Line */}
                <div 
                    className="w-32 h-1 mb-6"
                    style={{ backgroundColor: '#FFD700' }}
                />

                {/* Subtitle */}
                <p 
                    className="text-xl sm:text-2xl mb-12 max-w-3xl"
                    style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                    {slideData?.subtitle || 'A Study on Academic Excellence'}
                </p>
            </div>

            {/* Presenter Info - Bottom Right */}
            <div 
                className="absolute bottom-8 right-12 z-10 text-right"
                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
            >
                <p className="text-lg mb-1">
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>汇报人：</span>
                    <span className="font-semibold">{slideData?.presenterName || '张三'}</span>
                </p>
                <p className="text-lg mb-1">
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>指导教师：</span>
                    <span className="font-semibold">{slideData?.supervisorName || '李教授'}</span>
                </p>
                <p className="text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {slideData?.presentationDate || '2026年1月'}
                </p>
            </div>

            {/* Decorative Corner Elements */}
            <div 
                className="absolute top-0 left-0 w-24 h-24 z-10"
                style={{
                    borderTop: '3px solid rgba(255, 215, 0, 0.5)',
                    borderLeft: '3px solid rgba(255, 215, 0, 0.5)',
                }}
            />
            <div 
                className="absolute bottom-0 right-0 w-24 h-24 z-10"
                style={{
                    borderBottom: '3px solid rgba(255, 215, 0, 0.5)',
                    borderRight: '3px solid rgba(255, 215, 0, 0.5)',
                }}
            />
        </div>
    )
}

export default IntroSlideLayout

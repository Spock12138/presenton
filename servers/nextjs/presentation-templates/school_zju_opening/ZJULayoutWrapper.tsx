import React from 'react'

interface ZJULayoutWrapperProps {
    children: React.ReactNode
    title?: string
    pageNum?: number
}

// 浙江大学品牌色常量
const ZJU_PRIMARY_COLOR = '#003F88'  // 浙大求是蓝
const ZJU_ACCENT_COLOR = '#B5985A'   // 浙大金色
const ZJU_SECONDARY_COLOR = '#1A5DAD' // 辅助蓝
const HEADER_HEIGHT = 64  // 页眉高度
const FOOTER_HEIGHT = 48  // 页脚高度

const ZJULayoutWrapper: React.FC<ZJULayoutWrapperProps> = ({ 
    children, 
    title, 
    pageNum 
}) => {
    return (
        <div
            className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden flex flex-col"
            style={{
                fontFamily: '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "SimSun", serif',
                backgroundImage: 'url(/templates/school_zju_opening/bg_watermark.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Background Overlay - 增强可读性的白色遮罩 */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.94)',
                }}
            />

            {/* Header - 页眉 */}
            <header 
                className="relative z-10 flex items-center justify-between px-8 sm:px-12 lg:px-16 shrink-0"
                style={{
                    height: `${HEADER_HEIGHT}px`,
                    borderBottom: `3px solid ${ZJU_PRIMARY_COLOR}`,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                }}
            >
                {/* 左侧 - 浙大长条形 Logo */}
                <div className="flex items-center">
                    <img 
                        src="/templates/school_zju_opening/logo_long.png" 
                        alt="浙江大学"
                        className="h-10 w-auto object-contain"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                        }}
                    />
                    {/* Fallback text when image fails to load */}
                    <div 
                        className="hidden items-center gap-2 whitespace-nowrap"
                        style={{ 
                            color: ZJU_PRIMARY_COLOR,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        <span>浙江大学</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.7 }}>
                            ZHEJIANG UNIVERSITY
                        </span>
                    </div>
                </div>

                {/* 右侧 - 开题报告标识 */}
                <div 
                    className="flex items-center gap-2 text-base font-semibold tracking-wide"
                    style={{ color: ZJU_PRIMARY_COLOR }}
                >
                    <span>开题报告</span>
                    <span className="opacity-60">/</span>
                    <span className="text-sm font-normal opacity-80">Thesis Proposal</span>
                </div>
            </header>

            {/* Main Content Area - 主体区域 */}
            <main 
                className="relative z-10 flex-1 overflow-hidden"
                style={{
                    padding: '20px 40px',
                }}
            >
                {children}
            </main>

            {/* Footer - 页脚 */}
            <footer 
                className="relative z-10 flex items-center justify-between px-8 sm:px-12 lg:px-16 shrink-0"
                style={{
                    height: `${FOOTER_HEIGHT}px`,
                    borderTop: `1px solid rgba(0, 63, 136, 0.2)`,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                }}
            >
                {/* 左侧留空用于平衡布局 */}
                <div className="flex-1" />
                
                {/* 中间 - 校训："求是创新" */}
                <div 
                    className="flex items-center justify-center flex-1"
                    style={{ color: ZJU_ACCENT_COLOR }}
                >
                    <span 
                        className="text-base tracking-[0.3em] font-medium"
                        style={{ fontFamily: '"Source Han Serif SC", "SimSun", serif' }}
                    >
                        求是创新
                    </span>
                </div>
                
                {/* 右侧 - 页码 */}
                <div className="flex-1 flex justify-end">
                    {pageNum !== undefined && (
                        <div 
                            className="flex items-center gap-2 text-sm"
                            style={{ color: ZJU_PRIMARY_COLOR }}
                        >
                            <span className="opacity-60">Page</span>
                            <span 
                                className="w-7 h-7 flex items-center justify-center rounded-full font-semibold text-white"
                                style={{ backgroundColor: ZJU_PRIMARY_COLOR }}
                            >
                                {pageNum}
                            </span>
                        </div>
                    )}
                </div>
            </footer>

            {/* 装饰性顶部金线 */}
            <div 
                className="absolute top-0 left-0 right-0 h-1 z-20"
                style={{ backgroundColor: ZJU_ACCENT_COLOR }}
            />
        </div>
    )
}

export default ZJULayoutWrapper

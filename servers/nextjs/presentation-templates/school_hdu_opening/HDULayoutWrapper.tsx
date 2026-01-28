import React from 'react'

interface HDULayoutWrapperProps {
    children: React.ReactNode
    title?: string
    pageNum?: number
}

// 杭州电子科技大学品牌色常量
const HDU_PRIMARY_COLOR = '#003D7A'  // 杭电官方深蓝色
const HDU_ACCENT_COLOR = '#C8102E'  // 杭电红色（辅助色）
const HEADER_HEIGHT = 64  // 页眉高度
const FOOTER_HEIGHT = 48  // 页脚高度

const HDULayoutWrapper: React.FC<HDULayoutWrapperProps> = ({ 
    children, 
    title, 
    pageNum 
}) => {
    return (
        <div
            className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden flex flex-col"
            style={{
                fontFamily: '"Source Han Sans SC", "Noto Sans SC", "Microsoft YaHei", "微软雅黑", sans-serif',
                backgroundImage: 'url(/templates/school_hdu_opening/bg_watermark.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Background Overlay - 增强可读性的白色遮罩 */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.93)',
                }}
            />

            {/* Header - 页眉 */}
            <header 
                className="relative z-10 flex items-center justify-between px-8 sm:px-12 lg:px-16 shrink-0"
                style={{
                    height: `${HEADER_HEIGHT}px`,
                    borderBottom: `3px solid ${HDU_PRIMARY_COLOR}`,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                }}
            >
                {/* 左侧 - 杭电长条形 Logo */}
                <div className="flex items-center">
                    <img 
                        src="/templates/school_hdu_opening/logo_long.png" 
                        alt="杭州电子科技大学"
                        className="h-10 w-auto object-contain"
                    />
                </div>

                {/* 右侧 - 开题报告标识 */}
                <div 
                    className="flex items-center gap-2 text-base font-semibold tracking-wide"
                    style={{ color: HDU_PRIMARY_COLOR }}
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
                    borderTop: `1px solid rgba(0, 61, 122, 0.2)`,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                }}
            >
                {/* 左侧留空用于平衡布局 */}
                <div className="flex-1" />
                
                {/* 中间 - 校训图片："笃学力行 守正求新" */}
                <div className="flex items-center justify-center flex-1">
                    <img 
                        src="/templates/school_hdu_opening/motto.png" 
                        alt="笃学力行 守正求新"
                        className="h-5 w-auto object-contain"
                        style={{ opacity: 0.75 }}
                    />
                </div>
                
                {/* 右侧 - 页码 */}
                <div className="flex-1 flex justify-end">
                    {pageNum !== undefined && (
                        <div 
                            className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold"
                            style={{ 
                                backgroundColor: HDU_PRIMARY_COLOR,
                                color: '#FFFFFF',
                            }}
                        >
                            {pageNum}
                        </div>
                    )}
                </div>
            </footer>
        </div>
    )
}

export default HDULayoutWrapper

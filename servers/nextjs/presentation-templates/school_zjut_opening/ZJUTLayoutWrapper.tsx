import React from 'react'

interface ZJUTLayoutWrapperProps {
    children: React.ReactNode
    title?: string
    pageNum?: number
}

// 浙江工业大学品牌色常量
const ZJUT_PRIMARY_COLOR = '#1E4E79'  // 浙工大官方深蓝色
const ZJUT_SECONDARY_COLOR = '#2C6AA0'  // 辅助蓝色
const HEADER_HEIGHT = 64  // 页眉高度
const FOOTER_HEIGHT = 48  // 页脚高度

const ZJUTLayoutWrapper: React.FC<ZJUTLayoutWrapperProps> = ({ 
    children, 
    title, 
    pageNum 
}) => {
    return (
        <div
            className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden flex flex-col"
            style={{
                fontFamily: '"Source Han Serif SC", "Noto Serif SC", "Songti SC", "SimSun", "宋体", serif',
                backgroundImage: 'url(/templates/school_zjut_opening/bg_watermark.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Background Overlay - 增强可读性的白色遮罩 */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                }}
            />

            {/* Header - 页眉 */}
            <header 
                className="relative z-10 flex items-center justify-between px-8 sm:px-12 lg:px-16 shrink-0"
                style={{
                    height: `${HEADER_HEIGHT}px`,
                    borderBottom: `3px solid ${ZJUT_PRIMARY_COLOR}`,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                }}
            >
                {/* 左侧 - 浙工大长条形 Logo */}
                <div className="flex items-center">
                    <img 
                        src="/templates/school_zjut_opening/logo_long.png" 
                        alt="浙江工业大学"
                        className="h-10 w-auto object-contain"
                    />
                </div>

                {/* 右侧 - 开题报告标识 */}
                <div 
                    className="flex items-center gap-2 text-base font-semibold tracking-wide"
                    style={{ color: ZJUT_PRIMARY_COLOR }}
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
                    borderTop: `1px solid rgba(30, 78, 121, 0.2)`,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                }}
            >
                {/* 左侧留空用于平衡布局 */}
                <div className="flex-1" />
                
                {/* 中间 - 校训图片："厚德健行" */}
                <div className="flex items-center justify-center flex-1">
                    <img 
                        src="/templates/school_zjut_opening/motto.png" 
                        alt="厚德健行"
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
                                backgroundColor: ZJUT_PRIMARY_COLOR,
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

export default ZJUTLayoutWrapper

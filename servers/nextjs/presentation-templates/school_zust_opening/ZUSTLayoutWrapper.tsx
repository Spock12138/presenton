import React from 'react'

interface ZUSTLayoutWrapperProps {
    children: React.ReactNode
    title?: string
    pageNum?: number
}

// 浙江科技大学品牌色常量
const ZUST_PRIMARY_COLOR = '#004B87'  // 浙科大科技蓝
const ZUST_ACCENT_COLOR = '#00A0E9'  // 亮蓝色
const ZUST_ORANGE_ACCENT = '#FFB81C'  // 活力橙黄
const HEADER_HEIGHT = 64  // 页眉高度
const FOOTER_HEIGHT = 48  // 页脚高度

const ZUSTLayoutWrapper: React.FC<ZUSTLayoutWrapperProps> = ({ 
    children, 
    title, 
    pageNum 
}) => {
    return (
        <div
            className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden flex flex-col"
            style={{
                fontFamily: '"Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif',
                backgroundImage: 'url(/templates/school_zust_opening/bg_watermark.jpg)',
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
                    borderBottom: `3px solid ${ZUST_PRIMARY_COLOR}`,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                }}
            >
                {/* 左侧 - 浙科大长条形 Logo */}
                <div className="flex items-center">
                    <div 
                        className="relative h-10 px-3 py-1 rounded"
                        style={{
                            backgroundColor: ZUST_PRIMARY_COLOR,
                        }}
                    >
                        <img 
                            src="/templates/school_zust_opening/logo_long.png" 
                            alt="浙江科技大学"
                            className="h-8 w-auto object-contain"
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
                                color: '#FFFFFF',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                            }}
                        >
                            <div 
                                className="w-6 h-6 flex items-center justify-center text-xs font-bold"
                                style={{
                                    backgroundColor: ZUST_ORANGE_ACCENT,
                                    color: '#333333',
                                }}
                            >
                                Z
                            </div>
                            <span>浙江科技大学</span>
                        </div>
                    </div>
                </div>

                {/* 右侧 - 开题报告标识 */}
                <div 
                    className="flex items-center gap-2 text-base font-semibold tracking-wide"
                    style={{ color: ZUST_PRIMARY_COLOR }}
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
                    borderTop: `1px solid rgba(0, 75, 135, 0.2)`,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                }}
            >
                {/* 左侧留空用于平衡布局 */}
                <div className="flex-1" />
                
                {/* 中间 - 校训图片："崇德尚用 求真创新" */}
                <div className="flex items-center justify-center flex-1">
                    <img 
                        src="/templates/school_zust_opening/motto.png" 
                        alt="崇德尚用 求真创新"
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
                                backgroundColor: ZUST_PRIMARY_COLOR,
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

export default ZUSTLayoutWrapper

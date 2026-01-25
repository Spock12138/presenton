import React from 'react'

interface SchoolLayoutWrapperProps {
    children: React.ReactNode
    title?: string
    pageNum?: number
}

// 常量定义
const HEADER_HEIGHT = 60  // 页眉高度
const FOOTER_HEIGHT = 50  // 页脚高度
const PRIMARY_COLOR = '#003366'  // 校徽蓝

const SchoolLayoutWrapper: React.FC<SchoolLayoutWrapperProps> = ({ 
    children, 
    title, 
    pageNum 
}) => {
    return (
        <div
            className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden flex flex-col"
            style={{
                fontFamily: '"Times New Roman", "Songti SC", "SimSun", "宋体", serif',
                backgroundImage: 'url(/templates/school/bg_content.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Background Overlay for readability */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}
            />

            {/* Header - 页眉 */}
            <header 
                className="relative z-10 flex items-center px-8 sm:px-12 lg:px-16 shrink-0"
                style={{
                    height: `${HEADER_HEIGHT}px`,
                    borderBottom: `2px solid ${PRIMARY_COLOR}`,
                }}
            >
                {/* Logo - 左对齐 */}
                <div className="flex items-center gap-4">
                    <img 
                        src="/templates/school/logo.png" 
                        alt="University Logo"
                        className="h-10 w-auto object-contain"
                    />
                    {title && (
                        <h2 
                            className="text-lg font-semibold ml-4"
                            style={{ color: PRIMARY_COLOR }}
                        >
                            {title}
                        </h2>
                    )}
                </div>
            </header>

            {/* Main Content Area - 主体区域 */}
            <main 
                className="relative z-10 flex-1 overflow-hidden"
                style={{
                    padding: '16px 32px',
                }}
            >
                {children}
            </main>

            {/* Footer - 页脚 */}
            <footer 
                className="relative z-10 flex items-center justify-between px-8 sm:px-12 lg:px-16 shrink-0"
                style={{
                    height: `${FOOTER_HEIGHT}px`,
                    borderTop: '1px solid #cccccc',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }}
            >
                {/* 左侧留空用于平衡布局 */}
                <div className="flex-1" />
                
                {/* 中间 - 校训图片 */}
                <div className="flex items-center justify-center flex-1">
                    <img 
                        src="/templates/school/motto.png" 
                        alt="University Motto"
                        className="h-6 w-auto object-contain opacity-80"
                    />
                </div>
                
                {/* 右侧 - 页码 */}
                <div className="flex-1 flex justify-end">
                    {pageNum !== undefined && (
                        <span 
                            className="text-sm font-medium"
                            style={{ color: PRIMARY_COLOR }}
                        >
                            {pageNum}
                        </span>
                    )}
                </div>
            </footer>
        </div>
    )
}

export default SchoolLayoutWrapper

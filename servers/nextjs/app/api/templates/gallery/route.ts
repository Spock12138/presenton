import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export interface GalleryTemplate {
    id: string
    name: string
    description: string
    tags: string[]
    thumbnailUrl: string
    schoolId: string
    usage: string
    major: string
    ordered: boolean
    isDefault: boolean
}

interface SettingsJson {
    name?: string
    description?: string
    tags?: string[]
    ordered?: boolean
    default?: boolean
}

/**
 * 从模板文件夹名称中解析学校ID和用途
 * 例如: school_zjut_opening -> { schoolId: 'zjut', usage: '开题报告' }
 */
function parseTemplateFolder(folderName: string): { schoolId: string; usage: string } {
    // 默认值
    let schoolId = 'all'
    let usage = '通用'

    // 匹配模式: school_{schoolId}_{usage}
    const schoolMatch = folderName.match(/^school_([a-z]+)_(.+)$/)
    if (schoolMatch) {
        schoolId = schoolMatch[1] // zjut, hdu, zust 等
        const usageKey = schoolMatch[2]
        
        // 将 usage key 映射为中文
        const usageMap: Record<string, string> = {
            'opening': '开题报告',
            'defense': '毕业答辩',
            'report': '期末汇报',
            'lecture': '学术讲座',
            'meeting': '组会汇报',
        }
        usage = usageMap[usageKey] || usageKey
    } else if (folderName === 'general' || folderName === 'standard' || folderName === 'modern' || folderName === 'swift') {
        schoolId = 'all'
        usage = '通用'
    }

    return { schoolId, usage }
}

/**
 * 从 tags 中推断专业类型
 */
function inferMajor(tags: string[]): string {
    const tagStr = tags.join(' ').toLowerCase()
    
    if (tagStr.includes('计算机') || tagStr.includes('信息') || tagStr.includes('软件')) {
        return '计算机系'
    }
    if (tagStr.includes('经济') || tagStr.includes('管理') || tagStr.includes('金融')) {
        return '经济管理'
    }
    if (tagStr.includes('艺术') || tagStr.includes('设计')) {
        return '艺术设计'
    }
    if (tagStr.includes('医学') || tagStr.includes('医药')) {
        return '医学'
    }
    if (tagStr.includes('人文') || tagStr.includes('社科') || tagStr.includes('文学')) {
        return '人文社科'
    }
    if (tagStr.includes('理工') || tagStr.includes('工程') || tagStr.includes('学术')) {
        return '理工科'
    }
    
    return '全部'
}

export async function GET() {
    try {
        // 获取 presentation-templates 目录路径
        const templatesDirectory = path.join(process.cwd(), 'presentation-templates')
        
        // 读取所有子目录
        const items = await fs.readdir(templatesDirectory, { withFileTypes: true })
        
        // 过滤出目录，排除文件和某些特殊目录
        const templateDirectories = items
            .filter(item => item.isDirectory())
            .map(dir => dir.name)
            .filter(name => !name.startsWith('.') && !name.startsWith('_'))
        
        const galleryTemplates: GalleryTemplate[] = []
        
        // 扫描每个模板目录
        for (const folderName of templateDirectories) {
            try {
                const templatePath = path.join(templatesDirectory, folderName)
                const settingsPath = path.join(templatePath, 'settings.json')
                
                // 尝试读取 settings.json
                let settings: SettingsJson = {}
                try {
                    const settingsContent = await fs.readFile(settingsPath, 'utf-8')
                    settings = JSON.parse(settingsContent)
                } catch {
                    // 如果没有 settings.json，使用默认值
                    console.warn(`No settings.json found for template: ${folderName}`)
                    settings = {
                        name: folderName,
                        description: `${folderName} template`,
                        tags: [],
                        ordered: false,
                        default: false,
                    }
                }
                
                // 解析文件夹名称获取学校ID和用途
                const { schoolId, usage } = parseTemplateFolder(folderName)
                
                // 构建缩略图路径 - 优先使用 thumbnail.jpg，如果不存在则使用 bg_cover.jpg
                let thumbnailUrl = `/templates/${folderName}/thumbnail.jpg`
                
                // 检查是否存在 thumbnail.jpg，不存在则使用 bg_cover.jpg
                try {
                    const thumbnailPath = path.join(process.cwd(), 'public', 'templates', folderName, 'thumbnail.jpg')
                    await fs.access(thumbnailPath)
                } catch {
                    // thumbnail.jpg 不存在，使用 bg_cover.jpg 作为替代
                    thumbnailUrl = `/templates/${folderName}/bg_cover.jpg`
                }
                
                // 构建模板对象
                const template: GalleryTemplate = {
                    id: folderName,
                    name: settings.name || folderName,
                    description: settings.description || '',
                    tags: settings.tags || [],
                    thumbnailUrl,
                    schoolId,
                    usage,
                    major: inferMajor(settings.tags || []),
                    ordered: settings.ordered || false,
                    isDefault: settings.default || false,
                }
                
                galleryTemplates.push(template)
                
            } catch (error) {
                console.error(`Error processing template ${folderName}:`, error)
                // 继续处理其他模板
            }
        }
        
        // 按照 isDefault 和 name 排序（默认模板在前）
        galleryTemplates.sort((a, b) => {
            if (a.isDefault && !b.isDefault) return -1
            if (!a.isDefault && b.isDefault) return 1
            return a.name.localeCompare(b.name, 'zh-CN')
        })
        
        return NextResponse.json({
            success: true,
            data: galleryTemplates,
            total: galleryTemplates.length,
        })
        
    } catch (error) {
        console.error('Error reading presentation-templates directory:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to read presentation-templates directory',
                data: [],
                total: 0,
            },
            { status: 500 }
        )
    }
}

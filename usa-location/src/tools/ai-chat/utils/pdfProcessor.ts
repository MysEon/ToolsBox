import { FileInfo } from '../types/chat';

// PDF.js 动态导入以避免SSR问题
let pdfjsLib: any = null;

const initPdfJs = async () => {
  if (typeof window !== 'undefined' && !pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');

    // 设置worker路径
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
  return pdfjsLib;
};

export interface PDFProcessResult {
  success: boolean;
  text?: string;
  pageCount?: number;
  error?: string;
}

export class PDFProcessor {
  // 处理PDF文件
  static async processFile(file: File): Promise<FileInfo> {
    try {
      // 验证文件类型
      if (file.type !== 'application/pdf') {
        throw new Error('只支持PDF文件');
      }

      // 验证文件大小 (10MB限制)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('文件大小不能超过10MB');
      }

      // 初始化PDF.js
      await initPdfJs();
      if (!pdfjsLib) {
        throw new Error('PDF处理器初始化失败');
      }

      // 读取文件内容
      const arrayBuffer = await file.arrayBuffer();
      const result = await this.extractTextFromPDF(arrayBuffer);

      if (!result.success) {
        throw new Error(result.error || 'PDF解析失败');
      }

      const fileInfo: FileInfo = {
        id: this.generateFileId(),
        name: file.name,
        type: file.type,
        size: file.size,
        content: result.text,
        uploadTime: Date.now()
      };

      return fileInfo;
    } catch (error) {
      console.error('PDF processing failed:', error);
      throw error;
    }
  }

  // 从PDF提取文本
  static async extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<PDFProcessResult> {
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      let fullText = '';

      // 逐页提取文本
      for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          
          fullText += `\n--- 第${pageNum}页 ---\n${pageText}\n`;
        } catch (pageError) {
          console.warn(`Failed to extract text from page ${pageNum}:`, pageError);
          fullText += `\n--- 第${pageNum}页 (解析失败) ---\n`;
        }
      }

      // 清理文本
      const cleanedText = this.cleanText(fullText);

      return {
        success: true,
        text: cleanedText,
        pageCount
      };
    } catch (error) {
      console.error('PDF text extraction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 清理提取的文本
  static cleanText(text: string): string {
    return text
      // 移除多余的空白字符
      .replace(/\s+/g, ' ')
      // 移除多余的换行
      .replace(/\n\s*\n/g, '\n')
      // 移除首尾空白
      .trim()
      // 限制文本长度 (100KB)
      .substring(0, 100000);
  }

  // 验证PDF文件
  static async validatePDF(file: File): Promise<{ valid: boolean; error?: string }> {
    try {
      if (file.type !== 'application/pdf') {
        return { valid: false, error: '只支持PDF文件' };
      }

      if (file.size > 10 * 1024 * 1024) {
        return { valid: false, error: '文件大小不能超过10MB' };
      }

      // 尝试读取PDF头部
      const chunk = file.slice(0, 1024);
      const arrayBuffer = await chunk.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const header = String.fromCharCode.apply(null, Array.from(uint8Array.slice(0, 4)));

      if (header !== '%PDF') {
        return { valid: false, error: '文件格式不正确' };
      }

      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : '文件验证失败' 
      };
    }
  }

  // 生成文件ID
  static generateFileId(): string {
    return 'file_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }

  // 格式化文件大小
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 截取文本预览
  static getTextPreview(text: string, maxLength: number = 200): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
}

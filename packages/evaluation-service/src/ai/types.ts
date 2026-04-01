/**
 * AI 评估提供商抽象接口
 * 支持 mock（规则引擎）/ tencent（腾讯云）/ xfyun（科大讯飞）三种模式
 * 通过 EVALUATION_AI_PROVIDER 环境变量切换，默认为 mock
 */

export interface ASRResult {
  /** 识别出的文本 */
  transcript: string;
  /** 词级时间戳（可选，供发音分析使用） */
  words?: Array<{
    word: string;
    startTime: number;
    endTime: number;
    confidence: number;
  }>;
  /** 置信度 0-1 */
  confidence: number;
}

export interface PronunciationScore {
  /** 总体发音分 0-100 */
  overall: number;
  /** 各音素错误列表 */
  errors: Array<{
    word: string;
    expected: string;
    actual: string;
    startTime?: number;
    endTime?: number;
    severity: 'minor' | 'moderate' | 'severe';
  }>;
}

export interface EvaluationInput {
  /** 学生录音的 base64 编码（wav/mp3/m4a，最大 5MB） */
  audioBase64?: string;
  /** 学生录音的 URL（与 audioBase64 二选一） */
  audioUrl?: string;
  /** 参考文本（朗读/跟读题型使用） */
  referenceText?: string;
  /** 学生转写文本（如已有，则跳过 ASR） */
  transcript?: string;
}

export interface AIEvaluationResult {
  transcript: string;
  pronunciationScore: PronunciationScore;
  fluencyScore: number;
  overallScore: number;
  provider: string;
}

/**
 * AI 评估提供商接口
 */
export interface AIEvaluationProvider {
  readonly name: string;
  /**
   * 对学生录音进行 ASR + 发音评测
   */
  evaluate(input: EvaluationInput): Promise<AIEvaluationResult>;
}

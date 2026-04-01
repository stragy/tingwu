/**
 * Mock AI 评估提供商
 * 使用纯规则引擎，无需外部 API，适合开发/测试环境
 */

import { AIEvaluationProvider, AIEvaluationResult, EvaluationInput } from './types';

export class MockAIProvider implements AIEvaluationProvider {
  readonly name = 'mock';

  async evaluate(input: EvaluationInput): Promise<AIEvaluationResult> {
    const transcript = input.transcript || this.mockTranscript(input.referenceText);
    const fluencyScore = this.calcFluency(transcript);
    const pronunciationScore = this.calcPronunciation(transcript, input.referenceText);
    const overallScore = pronunciationScore.overall * 0.4 + fluencyScore * 0.3 + 70 * 0.3;

    return {
      transcript,
      pronunciationScore,
      fluencyScore,
      overallScore: Math.round(overallScore),
      provider: this.name,
    };
  }

  private mockTranscript(reference?: string): string {
    // 模拟学生转写：在参考文本基础上随机省略 10-20% 的词
    if (!reference) return 'Hello, this is a mock transcript for testing purposes.';
    const words = reference.split(/\s+/);
    return words.filter(() => Math.random() > 0.15).join(' ');
  }

  private calcFluency(transcript: string): number {
    const sentences = transcript.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const avgWords = transcript.split(/\s+/).length / Math.max(sentences.length, 1);
    return Math.min(Math.max(100 - Math.abs(avgWords - 12.5) * 2, 60), 100);
  }

  private calcPronunciation(
    transcript: string,
    reference?: string
  ): AIEvaluationResult['pronunciationScore'] {
    if (!reference) {
      return { overall: Math.round(70 + Math.random() * 20), errors: [] };
    }
    const refWords = reference.toLowerCase().split(/\s+/);
    const stuWords = transcript.toLowerCase().split(/\s+/);
    const errors: AIEvaluationResult['pronunciationScore']['errors'] = [];

    refWords.forEach((word, i) => {
      if (!stuWords.includes(word) && word.length > 3) {
        errors.push({
          word,
          expected: word,
          actual: stuWords[i] || '[omitted]',
          severity: 'minor',
        });
      }
    });

    const errorRate = errors.length / Math.max(refWords.length, 1);
    const overall = Math.round(Math.max(100 - errorRate * 150, 40));
    return { overall, errors: errors.slice(0, 10) };
  }
}

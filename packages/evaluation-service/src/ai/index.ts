/**
 * AI 评估提供商工厂
 * 根据 EVALUATION_AI_PROVIDER 环境变量选择实现：
 *   mock    — 内置规则引擎（默认，无需外部 API）
 *   tencent — 腾讯云 ASR + 口语评测
 *   xfyun   — 科大讯飞 ASR + 口语评测
 */

import { AIEvaluationProvider } from './types';
import { MockAIProvider } from './mockProvider';
import { TencentAIProvider } from './tencentProvider';
import { XfyunAIProvider } from './xfyunProvider';

let _provider: AIEvaluationProvider | null = null;

export function getAIProvider(): AIEvaluationProvider {
  if (_provider) return _provider;

  const providerName = (process.env.EVALUATION_AI_PROVIDER || 'mock').toLowerCase();

  switch (providerName) {
    case 'tencent':
      console.log('[AI] Using Tencent Cloud ASR + Oral Evaluation provider');
      _provider = new TencentAIProvider();
      break;
    case 'xfyun':
      console.log('[AI] Using Xfyun (iFlytek) ASR + Oral Evaluation provider');
      _provider = new XfyunAIProvider();
      break;
    case 'mock':
    default:
      console.log('[AI] Using Mock evaluation provider (rule-based, no external API)');
      _provider = new MockAIProvider();
      break;
  }

  return _provider;
}

export { AIEvaluationProvider, AIEvaluationResult, EvaluationInput } from './types';
